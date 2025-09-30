<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  modelValue: File | null
  placeholder?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  label?: string
  disabled?: boolean
  accept?: string
  error?: string | null
  maxSize?: number // in MB
  showPreview?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  size: 'md',
  disabled: false,
  accept: '.xlsx,.xls',
  maxSize: 5, // 5MB default
  showPreview: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: File | null]
  'file-error': [error: string]
}>()

const { t } = useI18n()

const fileInput = ref<HTMLInputElement | null>(null)
const isDragOver = ref(false)
const isUploading = ref(false)
const validationError = ref<string | null>(null)

const fileModel = computed({
  get: () => props.modelValue,
  set: (value: File | null) => {
    validationError.value = null
    emit('update:modelValue', value)
  },
})

const acceptedTypes = computed(() => {
  if (props.accept === '.xlsx,.xls') {
    return [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
  }
  return props.accept.split(',').map(type => type.trim())
})

const validateFile = (file: File): string | null => {
  // Check file size
  const maxSizeBytes = props.maxSize * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return t('file-size-too-large', { maxSize: props.maxSize })
  }

  // Check file type
  if (props.accept !== '*') {
    const isValidType = acceptedTypes.value.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase())
      }
      return file.type === type
    })
    
    if (!isValidType) {
      return t('invalid-file-type-excel')
    }
  }

  return null
}

const handleFileSelect = (file: File) => {
  const error = validateFile(file)
  if (error) {
    validationError.value = error
    emit('file-error', error)
    return
  }
  
  fileModel.value = file
}

const triggerFileInput = () => {
  if (props.disabled) return
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    handleFileSelect(file)
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  
  if (props.disabled) return
  
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    handleFileSelect(files[0])
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (!props.disabled) {
    isDragOver.value = true
  }
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const removeFile = () => {
  fileModel.value = null
  validationError.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const displayError = computed(() => {
  return validationError.value || props.error
})
</script>

<template>
  <div class="space-y-3">
    <!-- Label -->
    <label v-if="label" class="block text-sm font-medium text-muted-700 dark:text-muted-200">
      {{ label }}
      <span v-if="!disabled" class="text-xs text-muted-500 ml-1">
        ({{ $t('max-file-size') }}: {{ maxSize }}MB)
      </span>
    </label>

    <!-- Upload Area -->
    <div
      class="relative border-2 border-dashed rounded-lg transition-all duration-200 ease-in-out"
      :class="{
        'border-primary-300 bg-primary-50 dark:border-primary-600 dark:bg-primary-900/20': isDragOver && !disabled,
        'border-danger-300 bg-danger-50 dark:border-danger-600 dark:bg-danger-900/20': displayError,
        'border-success-300 bg-success-50 dark:border-success-600 dark:bg-success-900/20': fileModel && !displayError,
        'border-muted-300 bg-muted-50 dark:border-muted-600 dark:bg-muted-800': !isDragOver && !displayError && !fileModel,
        'border-muted-200 bg-muted-100 dark:border-muted-700 dark:bg-muted-900': disabled,
        'cursor-pointer hover:border-primary-400 hover:bg-primary-25 dark:hover:border-primary-500 dark:hover:bg-primary-900/10': !disabled && !fileModel,
        'cursor-not-allowed opacity-60': disabled
      }"
      @click="triggerFileInput"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :disabled="disabled"
        class="hidden"
        @change="handleFileChange"
      >

      <!-- File Selected State -->
      <div v-if="fileModel" class="p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-success-100 dark:bg-success-900/30 rounded-lg flex items-center justify-center">
                <Icon name="tabler:file-spreadsheet" class="w-5 h-5 text-success-600 dark:text-success-400" />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-muted-900 dark:text-muted-100 truncate">
                {{ fileModel.name }}
              </p>
              <p class="text-xs text-muted-500 dark:text-muted-400">
                {{ formatFileSize(fileModel.size) }}
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <BaseButton
              size="sm"
              variant="outline"
              color="danger"
              :disabled="disabled"
              @click.stop="removeFile"
            >
              <Icon name="tabler:trash" class="w-4 h-4" />
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Upload Prompt State -->
      <div v-else class="p-8 text-center">
        <div class="mx-auto w-12 h-12 mb-4">
          <div class="w-full h-full bg-muted-100 dark:bg-muted-700 rounded-lg flex items-center justify-center">
            <Icon 
              :name="isUploading ? 'tabler:loader' : 'tabler:cloud-upload'" 
              :class="{ 'animate-spin': isUploading }"
              class="w-6 h-6 text-muted-500 dark:text-muted-400" 
            />
          </div>
        </div>
        
        <div class="space-y-2">
          <p class="text-sm font-medium text-muted-700 dark:text-muted-200">
            <span v-if="!disabled">
              {{ $t('click-to-upload-or-drag-and-drop') }}
            </span>
            <span v-else>{{ $t('file-upload-disabled') }}</span>
          </p>
          <p class="text-xs text-muted-500 dark:text-muted-400">
            {{ $t('supported-formats') }}: XLSX, XLS
          </p>
        </div>
      </div>

      <!-- Loading Overlay -->
      <div
        v-if="isUploading"
        class="absolute inset-0 bg-white/80 dark:bg-muted-900/80 rounded-lg flex items-center justify-center"
      >
        <div class="text-center space-y-2">
          <Icon name="tabler:loader" class="w-6 h-6 text-primary-500 animate-spin mx-auto" />
          <p class="text-sm text-muted-600 dark:text-muted-300">{{ $t('uploading-file') }}...</p>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="displayError" class="flex items-start space-x-2 p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
      <Icon name="tabler:alert-circle" class="w-4 h-4 text-danger-500 mt-0.5 flex-shrink-0" />
      <p class="text-sm text-danger-700 dark:text-danger-400">
        {{ displayError }}
      </p>
    </div>

    <!-- Success Message -->
    <div v-else-if="fileModel" class="flex items-start space-x-2 p-3 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg">
      <Icon name="tabler:check-circle" class="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
      <p class="text-sm text-success-700 dark:text-success-400">
        {{ $t('file-selected-successfully') }}
      </p>
    </div>

    <!-- File Requirements -->
    <div v-if="!fileModel && !displayError" class="text-xs text-muted-500 dark:text-muted-400 space-y-1">
      <p>• {{ $t('file-requirements') }}:</p>
      <p class="ml-2">- {{ $t('max-size') }}: {{ maxSize }}MB</p>
      <p class="ml-2">- {{ $t('accepted-formats') }}: Excel (.xlsx, .xls)</p>
    </div>
  </div>
</template>
