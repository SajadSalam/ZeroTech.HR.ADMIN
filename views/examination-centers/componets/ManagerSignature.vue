<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppToaster } from '~/services/toaster/toaster'
import { useToast } from '~/composables/toaster'
import { useExaminationCenters } from '../store/index'
import SignaturePad from '~/components/app-field/SignaturePad.vue'

interface Props {
    examCenterId?: string
    existingSignature?: string
}

const props = withDefaults(defineProps<Props>(), {
    examCenterId: '',
    existingSignature: ''
})

const examinationCentersStore = useExaminationCenters()
const toaster = useAppToaster()
const { t } = useI18n()

// Dialog state
const isDialogOpen = defineModel<boolean>('isOpen', { default: false })

// Signature state
const signatureData = ref<string>('')
const isLoading = ref(false)
const signaturePadRef = ref<InstanceType<typeof SignaturePad>>()

// Handle save signature externally
const handleSaveSignature = async () => {
    if (!signaturePadRef.value) {
        useToast({
            title: t('signature-component-not-available'),
            isError: true
        })
        return
    }

    if (signaturePadRef.value.isEmpty()) {
        useToast({
            title: t('signature-required'),
            isError: true
        })
        return
    }

    try {
        isLoading.value = true
        const signatureFile = await signaturePadRef.value.getSignatureAsFile()
        
        if (!signatureFile) {
            useToast({
                title: t('error-converting-signature'),
                isError: true
            })
            return
        }

        await examinationCentersStore.setManagerSignature(props.examCenterId, signatureFile)

        useToast({
            title: t('signature-saved-successfully'),
            isError: false
        })

        // Close dialog after successful save
        examinationCentersStore.isManagerSignatureDialogOpen = false
    } catch (error) {
        useToast({
            title: t('error-saving-signature'),
            isError: true
        })
    } finally {
        isLoading.value = false
    }
}

const handleSignatureCleared = () => {
    signatureData.value = ''
}

// Handle dialog close
const handleClose = () => {
    signatureData.value = ''
    examinationCentersStore.isManagerSignatureDialogOpen = false
}
</script>

<template>
    <AppDialog v-model="examinationCentersStore.isManagerSignatureDialogOpen" :title="$t('manager-signature')"
        size="2xl" :loading="isLoading">
        <div class="w-20 h-20 flex rounded-full items-center justify-center pa-5 bg-primary-500 bg-opacity-10 pa-5">
            <Icon name="ph:pen-nib-duotone" class="size-10 text-primary-500" />

        </div>
        <div class="space-y-4 my-2 w-full">
            <!-- Instructions -->

            <p class="mt-1 teary-700 dark:text-primary-500">
                {{ $t('signature-instructions-desc') }}
            </p>
             <!-- Signature Pad Component -->
             <SignaturePad 
                 ref="signaturePadRef"
                 v-model="signatureData" 
                 :show-file-input="false" 
                 :show-save-button="true"
                 :show-export-button="false" 
                 :show-preview="false" 
                 :canvas-height="200"
                 @signature-cleared="handleSignatureCleared" 
             />

            <!-- Signature status -->
            <div class="text-start text-sm text-muted-500">
                <ul>
                    <li> {{ $t('put-the-pointer-inside-the-box-below') }} </li>
                    <li> {{ $t('use-the-mouse-or-touch-screen-to-draw-your-signature') }} </li>
                    <li> {{ $t('if-the-signature-is-not-clear-you-can-press-the-clear-button-to-try-again') }} </li>
                    <li> {{ $t('after-completing-press-the-save-button-to-confirm-it-in-the-certificates') }} </li>
                </ul>
            </div>
        </div>

        <template #actions>

            <BaseButton color="muted" variant="outline" @click="handleClose">
                {{ $t('cancel') }}
            </BaseButton>
            <BaseButton color="primary" @click="handleSaveSignature">
                <Icon name="ph:signature-duotone" class="size-4 me-2" />
                {{ $t('save') }}
            </BaseButton>
        </template>
    </AppDialog>
</template>

<style scoped>
canvas {
    cursor: crosshair;
}
</style>
