<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  label?: string
  accept?: string
  disabled?: boolean
  error?: string | null
  maxSize?: number // in MB
}

const props = withDefaults(defineProps<Props>(), {
  accept: '.xlsx,.xls',
  disabled: false,
  error: null,
  maxSize: 10,
})

const model = defineModel<File | null>()

const emit = defineEmits<{
  'file-error': [error: string]
}>()

const { t } = useI18n()
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

const fileName = computed(() => model.value?.name || '')
const fileSize = computed(() => {
  if (!model.value) return ''
  const sizeInMB = model.value.size / (1024 * 1024)
  return sizeInMB < 1
    ? `${(model.value.size / 1024).toFixed(2)} KB`
    : `${sizeInMB.toFixed(2)} MB`
})

const validateFile = (file: File): string | null => {
  // Check file size
  const maxSizeBytes = props.maxSize * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return t('file-size-exceeds-limit', { size: props.maxSize })
  }

  // Check file type
  if (props.accept) {
    const acceptedTypes = props.accept.split(',').map(type => type.trim())
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!acceptedTypes.includes(fileExtension)) {
      return t('invalid-file-format')
    }
  }

  return null
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    const error = validateFile(file)
    if (error) {
      emit('file-error', error)
      model.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
      return
    }
    model.value = file
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  
  if (file) {
    const error = validateFile(file)
    if (error) {
      emit('file-error', error)
      model.value = null
      return
    }
    model.value = file
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const removeFile = () => {
  model.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const openFileDialog = () => {
  if (!props.disabled) {
    fileInput.value?.click()
  }
}

// Clear error when file is removed
watch(model, (newValue) => {
  if (!newValue && props.error) {
    emit('file-error', '')
  }
})
</script>

<template>
  <div class="space-y-2">
    <label v-if="label" class="text-sm font-medium text-muted-700 dark:text-muted-200">
      {{ label }}
    </label>

    <!-- Upload Area -->
    <div
      class="relative rounded-lg border-2 border-dashed transition-all"
      :class="{
        'border-primary-500 bg-primary-50 dark:bg-primary-900/10': isDragging && !disabled,
        'border-muted-300 bg-muted-50 dark:border-muted-700 dark:bg-muted-800': !isDragging && !disabled && !error,
        'border-danger-500 bg-danger-50 dark:bg-danger-900/10': error,
        'cursor-not-allowed opacity-50': disabled,
      }"
      @drop.prevent="handleDrop"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
    >
      <!-- File Input -->
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        :accept="accept"
        :disabled="disabled"
        @change="handleFileSelect"
      />

      <!-- Upload Content -->
      <div v-if="!model" class="p-8 text-center" @click="openFileDialog">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted-100 dark:bg-muted-700">
          <Icon name="tabler-upload" class="size-8 text-muted-400" />
        </div>
        <p class="mb-2 text-sm font-medium text-muted-700 dark:text-muted-200">
          {{ $t('click-to-upload-or-drag-and-drop') }}
        </p>
        <p class="text-xs text-muted-500 dark:text-muted-400">
          {{ $t('accepted-formats') }}: {{ accept }}
        </p>
        <p class="text-xs text-muted-500 dark:text-muted-400">
          {{ $t('max-file-size') }}: {{ maxSize }} MB
        </p>
      </div>

      <!-- Selected File Display -->
      <div v-else class="flex items-center justify-between p-4">
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-success-100 dark:bg-success-900/20">
            <Icon name="tabler-file-spreadsheet" class="size-6 text-success-600 dark:text-success-400" />
          </div>
          <div>
            <p class="text-sm font-medium text-muted-700 dark:text-muted-200">
              {{ fileName }}
            </p>
            <p class="text-xs text-muted-500 dark:text-muted-400">
              {{ fileSize }}
            </p>
          </div>
        </div>
        <BaseButton
          v-if="!disabled"
          size="sm"
          variant="outline"
          color="danger"
          @click.stop="removeFile"
        >
          <Icon name="tabler-x" class="size-4" />
        </BaseButton>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="text-sm text-danger-500">
      {{ error }}
    </p>
  </div>
</template>


