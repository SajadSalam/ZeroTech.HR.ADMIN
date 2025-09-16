<script setup lang="ts">
import SignaturePad from 'signature_pad'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { FileService } from '~/services/app-client/fileService'
import { useToast } from '~/composables/toaster'

// Props
interface Props {
    modelValue?: string
    existingSignature?: string
    showFileInput?: boolean
    showSaveButton?: boolean
    showExportButton?: boolean
    showPreview?: boolean
    canvasWidth?: number
    canvasHeight?: number
    backgroundColor?: string
    penColor?: string
    minWidth?: number
    maxWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    existingSignature: '',
    showFileInput: true,
    showSaveButton: true,
    showExportButton: false,
    showPreview: true,
    canvasWidth: 500,
    canvasHeight: 200,
    backgroundColor: 'rgb(255, 255, 255)',
    penColor: 'rgb(0, 0, 0)',
    minWidth: 1,
    maxWidth: 3
})

// Emits
const emit = defineEmits<{
    'update:modelValue': [value: string]
    'signature-saved': [signatureData: string]
    'signature-as-file': [file: File]
    'signature-cleared': []
    'signature-loaded': [signatureData: string]
    'file-uploaded': [file: File, signatureData: string]
}>()

// Composables
const { t } = useI18n()

const fileService = new FileService()

// Refs
const signatureCanvas = ref<HTMLCanvasElement>()
const fileInput = ref<HTMLInputElement>()
let signaturePad: SignaturePad | null = null

// State
const signatureImage = ref<string>('')
const isLoading = ref(false)

// Computed
const isEmpty = computed(() => {
    return signaturePad?.isEmpty() ?? true
})

// Watch for external signature changes
watch(() => props.existingSignature, (newSignature) => {
    if (newSignature && signaturePad) {
        loadSignatureFromDataURL(newSignature)
    }
}, { immediate: true })

// Watch for model value changes
watch(() => props.modelValue, (newValue) => {
    if (newValue && newValue !== signatureImage.value && signaturePad) {
        loadSignatureFromDataURL(newValue)
    }
}, { immediate: true })

// Initialize signature pad
onMounted(() => {
    if (signatureCanvas.value) {
        // First resize the canvas to get proper dimensions
        resizeCanvas()
        
        // Then initialize the signature pad
        signaturePad = new SignaturePad(signatureCanvas.value, {
            backgroundColor: 'rgba(0,0,0,0)', // Transparent background
            penColor: props.penColor,
            minWidth: props.minWidth,
            maxWidth: props.maxWidth,
        })

        // Update model when signature changes
        signaturePad.addEventListener('endStroke', updateSignatureModel)

        // Load existing signature if provided
        if (props.existingSignature) {
            loadSignatureFromDataURL(props.existingSignature)
        } else if (props.modelValue) {
            loadSignatureFromDataURL(props.modelValue)
        }

        // Listen for resize events and reinitialize signature pad
        const handleResize = () => {
            if (signaturePad) {
                const currentSignature = signaturePad.isEmpty() ? null : signaturePad.toDataURL()
                resizeCanvas()
                if (currentSignature) {
                    loadSignatureFromDataURL(currentSignature)
                }
            }
        }
        window.addEventListener('resize', handleResize)
        
        // Store the function reference for cleanup
        ;(signatureCanvas.value as any).__handleResize = handleResize
    }
})

onUnmounted(() => {
    if (signatureCanvas.value && (signatureCanvas.value as any).__handleResize) {
        window.removeEventListener('resize', (signatureCanvas.value as any).__handleResize)
    }
})

// Functions
function clearSignature() {
    if (signaturePad) {
        signaturePad.clear()
        signatureImage.value = ''
        emit('update:modelValue', '')
        emit('signature-cleared')
    }
}

// Update model value when signature changes
function updateSignatureModel() {
    if (!signaturePad) return
    
    const signatureData = signaturePad.toDataURL('image/png') // PNG with transparent background
    signatureImage.value = signatureData
    emit('update:modelValue', signatureData)
}

// Convert canvas to File object for upload
async function convertCanvasToFile(): Promise<File> {
    if (!signatureCanvas.value || !signaturePad) {
        throw new Error('Canvas or SignaturePad not available')
    }

    return new Promise((resolve, reject) => {
        // Create a new canvas with transparent background
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')!
        
        // Set canvas dimensions
        tempCanvas.width = signatureCanvas.value!.width
        tempCanvas.height = signatureCanvas.value!.height
        
        // Don't fill background - leave it transparent
        // Copy the signature from the original canvas
        tempCtx.drawImage(signatureCanvas.value!, 0, 0)
        
        tempCanvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], `signature-${Date.now()}.png`, {
                    type: 'image/png'
                })
                resolve(file)
            } else {
                reject(new Error('Failed to convert canvas to blob'))
            }
        }, 'image/png')
    })
}

// Public method to get signature as file (can be called by parent components)
async function getSignatureAsFile(): Promise<File | null> {
    if (!signaturePad || signaturePad.isEmpty()) {
        return null
    }

    try {
        return await convertCanvasToFile()
    } catch (error) {
        console.error('Error converting signature to file:', error)
        return null
    }
}

// Expose methods for parent components
defineExpose({
    getSignatureAsFile,
    clearSignature,
    isEmpty: () => signaturePad?.isEmpty() ?? true,
    getSignatureDataURL: () => signaturePad?.toDataURL('image/png') ?? ''
})

async function exportSignature() {
    if (!signaturePad || signaturePad.isEmpty()) {
        useToast({
            title: t('signature-required'),
            isError: true
        })
        return
    }

    try {
        const signatureData = signaturePad.toDataURL('image/png') // PNG with transparent background
        const link = document.createElement('a')
        link.download = `signature-${Date.now()}.png`
        link.href = signatureData
        link.click()

        useToast({
            title: t('signature-exported-successfully'),
            isError: false
        })
    } catch (error) {
        useToast({
            title: t('error-exporting-signature'),
            isError: true
        })
        console.error('Error exporting signature:', error)
    }
}

async function loadFromFile(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) return

    try {
        isLoading.value = true

        // Validate file type
        if (!file.type.startsWith('image/')) {
            useToast({
                title: t('invalid-file-type'),
                isError: true
            })
            return
        }

        // Upload file to service if needed

        // Load image to canvas
        const reader = new FileReader()
        reader.onload = (e) => {
            const img = new Image()
            img.onload = () => {
                if (signaturePad && signatureCanvas.value) {
                    // Clear existing signature
                    signaturePad.clear()

                    // Draw image on canvas
                    const ctx = signatureCanvas.value.getContext('2d')
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, signatureCanvas.value.width, signatureCanvas.value.height)
                    }

                    const signatureData = signaturePad.toDataURL()
                    signatureImage.value = signatureData

                    emit('update:modelValue', signatureData)
                    emit('signature-loaded', signatureData)
                    emit('file-uploaded', file, signatureData)

                    useToast({
                        title: t('signature-loaded-successfully'),
                        isError: false
                    })
                }
            }
            img.src = e.target?.result as string
        }   
        reader.readAsDataURL(file)

    } catch (error) {
        useToast({
            title: t('error-loading-signature'),
            isError: true
        })
        console.error('Error loading signature from file:', error)
    } finally {
        isLoading.value = false
        // Reset file input
        if (fileInput.value) {
            fileInput.value.value = ''
        }
    }
}

function loadSignatureFromDataURL(dataUrl: string) {
    if (!signaturePad || !signatureCanvas.value || !dataUrl) return

    const img = new Image()
    img.onload = () => {
        signaturePad!.clear()
        const ctx = signatureCanvas.value!.getContext('2d')
        if (ctx) {
            ctx.drawImage(img, 0, 0, signatureCanvas.value!.width, signatureCanvas.value!.height)
        }
        signatureImage.value = dataUrl
    }
    img.src = dataUrl
}

// Resize canvas to make it high-DPI aware
function resizeCanvas() {
    if (!signatureCanvas.value) return

    const canvas = signatureCanvas.value
    const ratio = Math.max(window.devicePixelRatio || 1, 1)

    // Save the current signature if it exists
    const currentSignature = signaturePad && !signaturePad.isEmpty() ? signaturePad.toDataURL() : null

    // Get the display size (CSS pixels)
    const displayWidth = props.canvasWidth || canvas.offsetWidth
    const displayHeight = props.canvasHeight || canvas.offsetHeight

    // Set the internal size to the display size * ratio for high-DPI
    canvas.width = displayWidth * ratio
    canvas.height = displayHeight * ratio

    // Set the CSS size to the display size
    canvas.style.width = displayWidth + 'px'
    canvas.style.height = displayHeight + 'px'

    // Scale the context to match the device pixel ratio
    const ctx = canvas.getContext('2d')!
    ctx.scale(ratio, ratio)

    // Restore the signature if it existed
    if (currentSignature && signaturePad) {
        loadSignatureFromDataURL(currentSignature)
    }
}
</script>


<template>
    <div class="signature-wrapper">
        <!-- File Input for Loading Existing Signature -->
        <div v-if="showFileInput" class="file-input-section">
            <label for="signature-file" class="file-input-label">
                <Icon name="material-symbols:upload-file" class="size-4 mr-2" />
                {{ $t('load-signature-from-file') }}
            </label>
            <input id="signature-file" ref="fileInput" type="file" accept="image/*" class="hidden"
                @change="loadFromFile" />
        </div>

        <!-- Signature Canvas -->
        <div class="canvas-container w-full">
            <canvas ref="signatureCanvas" class="signature-canvas"></canvas>

            <!-- Clear Button Overlay -->
            <BaseButton v-if="!isEmpty" size="sm" color="muted" variant="outline" class="clear-button"
                @click="clearSignature">
                <Icon name="material-symbols:clear" class="size-4" />
                {{ $t('clear') }}
            </BaseButton>
        </div>

         <!-- Action Buttons -->
         <div class="action-buttons">
             <BaseButton 
                 v-if="showSaveButton" 
                 color="muted" 
                 variant="outline"
                 @click="clearSignature"
             >
                 <Icon name="ph:eraser-duotone" class="size-4 mr-2" />
                 {{ $t('clear') }}
             </BaseButton>

             <BaseButton 
                 v-if="showExportButton" 
                 color="muted" 
                 variant="outline" 
                 :disabled="isEmpty"
                 @click="exportSignature"
             >
                 <Icon name="material-symbols:download" class="size-4 mr-2" />
                 {{ $t('export') }}
             </BaseButton>
         </div>

        <!-- Signature Preview -->
        <div v-if="signatureImage && showPreview" class="signature-preview">
            <h3 class="preview-title">{{ $t('signature-preview') }}</h3>
            <img :src="signatureImage" :alt="$t('signature-image')" class="preview-image" />
        </div>
    </div>
</template>

<style scoped>
.signature-wrapper {
    @apply w-full space-y-4;
}

.file-input-section {
    @apply flex items-center justify-center;
}

.file-input-label {
    @apply inline-flex items-center px-4 py-2 bg-muted-100 dark:bg-muted-800 text-muted-700 dark:text-muted-300 border border-muted-300 dark:border-muted-600 rounded-lg cursor-pointer hover:bg-muted-200 dark:hover:bg-muted-700 transition-colors;
}

.canvas-container {
    @apply relative;
}

.signature-canvas {
    @apply bg-white dark:bg-muted-900 border-2 border-dashed border-muted-300 dark:border-muted-600 rounded-lg;
    touch-action: none;
    cursor: crosshair;
    display: block;
    max-width: 100%;
}

.clear-button {
    @apply absolute top-2 right-2;
}

.action-buttons {
    @apply flex items-center justify-center gap-3;
}

.signature-preview {
    @apply text-center space-y-3;
}

.preview-title {
    @apply text-sm font-medium text-muted-700 dark:text-muted-300;
}

.preview-image {
    @apply max-w-full h-auto border border-muted-200 dark:border-muted-700 rounded-lg shadow-sm;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
    .action-buttons {
        @apply flex-col w-full;
    }
    
    .signature-canvas {
        height: 150px;
    }
}
</style>
