<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { FileService } from '~/services/app-client/fileService'
import AppImagePreviewModal from '../AppImagePreviewModal.vue'
import AppFileUploaderButton from './AppFileUploaderButton.vue'

const { t } = useI18n()

const props = defineProps<{
  input: string
  file: string | null
  placeholder?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  label?: string
  disabled?: boolean
  type?: 'text' | 'textarea'
}>()

const emit = defineEmits(['update:input', 'update:file'])

const input = computed({
  get: () => props.input,
  set: (value: string | null) => emit('update:input', value),
})

const imageUrl = ref<string | null>(null)
const isUploading = ref(false)

const file = computed({
  get: () => props.file,
  set: (value: string | null) => emit('update:file', value),
})
const fileModel = ref<File | null>(null)
const fileService = new FileService()
const showModal = ref(false)
watch(fileModel, async (value: File | null) => {
  if (value) {
    // Check file size (1MB = 1024 * 1024 bytes)
    const maxSize = 1024 * 1024 // 1MB in bytes
    if (value.size > maxSize) {
      useToast({
        message: t('file_size_error'),
        isError: true,
      })
      fileModel.value = null
      return
    }

    try {
      isUploading.value = true
      useToast({
        message: t('image_uploading'),
        isError: false,
      })

      const url = await fileService.uploadFile(value)
      file.value = url
      imageUrl.value = url

      // Show success notification
      useToast({
        message: t('image_upload_success'),
        isError: false,
      })
    } catch {
      useToast({
        message: t('image_upload_failed'),
        isError: true,
      })
    } finally {
      isUploading.value = false
    }
  }
})
watch(
  () => props.file,
  (newValue: string | null) => {
    if (newValue) {
      imageUrl.value = newValue
    }
  },
  { immediate: true }
)
const removeImage = () => {
  imageUrl.value = null
  file.value = null
  fileModel.value = null
}
</script>

<template>
  <p class="text-sm">
    {{ label }}
  </p>
  <div class="flex w-full items-center gap-2">
    <BaseInput
      v-if="type === 'text'"
      v-model="input"
      :placeholder="placeholder || $t('enter-the-text')"
      :size="size || 'md'"
      :classes="{
        wrapper: 'w-full bg-white',
      }"
      :disabled="disabled"
    />
    <BaseTextarea
      v-if="type === 'textarea'"
      v-model="input"
      :placeholder="placeholder || $t('enter-the-text')"
      :size="size || 'md'"
      :classes="{
        wrapper: 'w-full',
      }"
      class="w-full"
      :disabled="disabled"
    />
    <AppFileUploaderButton v-model="fileModel">
      <BaseButtonIcon :disabled="disabled || isUploading" variant="outline">
        <Icon
          :name="isUploading ? 'tabler:loader-2' : 'tabler:photo'"
          class="text-primary-500"
          size="18"
          :class="{ 'animate-spin': isUploading }"
        />
      </BaseButtonIcon>
    </AppFileUploaderButton>
    <BaseButtonIcon
      v-if="imageUrl"
      variant="outline"
      class="cursor-pointer"
      @click="showModal = true"
    >
      <Icon name="tabler:eye" class="text-primary-500" size="18" />
    </BaseButtonIcon>
  </div>
  <!--  <div class="flex items-center mt-2 gap-2" v-if="fileModel">
    <p>
      Selected Image :
      <span class="font-bold">{{ fileModel.name }}</span>
    </p>
    <Icon
      name="tabler:trash"
      class="text-red-500 cursor-pointer"
      @click="fileModel = null"
      size="18"
    ></Icon>
  </div> -->
  <AppImagePreviewModal
    v-model="showModal"
    :image-key="imageUrl?.toString() ?? ''"
    @remove="removeImage"
  />
</template>
