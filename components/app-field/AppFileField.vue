<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { baseURL } from '~/services/app-client/axios';
import { FileService } from '~/services/app-client/fileService';

const { t } = useI18n()

const props = defineProps<{
  multiple?: boolean
  append?: boolean
  accept?: string
}>()

const model = defineModel<string>()
const imagesSrc = reactive<Map<string, string>>(new Map())
const uploadingFiles = reactive<Map<string, boolean>>(new Map())
const fileService = new FileService()

const inputEle = ref()

const open = () => {
  inputEle.value.click()
}

const change = async (e: Event) => {
  const target = e.target as HTMLInputElement

  if (!target.files?.length) return

  // Take only the first file if multiple is not enabled
  const file = target.files.item(0) as File
  if (!file) return

  const maxSize = 1024 * 1024 // 1MB in bytes

  // Validate file size
  if (file.size > maxSize) {
    useToast({
      message: t('file_size_error'),
      isError: true,
    })
    return
  }

  // Clear previous previews if not appending
  if (!props.append) {
    if (model.value) {
      imagesSrc.delete(model.value)
      uploadingFiles.delete(model.value)
    }
  }

  // Show preview immediately using temp key
  const tempKey = `temp_${file.name}_${Date.now()}`
  const src = await preview(file)
  
  if (!src) {
    useToast({
      message: t('image_upload_failed'),
      isError: true,
    })
    return
  }

  imagesSrc.set(tempKey, src)
  uploadingFiles.set(tempKey, true)
  model.value = tempKey

  // Upload file
  try {
    useToast({
      message: t('image_uploading'),
      isError: false,
    })

    const url = await fileService.uploadFile(file)
    
    if (!url) {
      throw new Error('Upload failed')
    }

    // Replace temp key with actual URL
    model.value = url
    
    // Store the full URL for display
    const displayUrl = url.startsWith('http') ? url : baseURL + url
    imagesSrc.set(url, displayUrl)
    uploadingFiles.delete(tempKey)
    imagesSrc.delete(tempKey)

    useToast({
      message: t('image_upload_success'),
      isError: false,
    })
  } catch (error) {
    // Clean up on error
    model.value = ''
    imagesSrc.delete(tempKey)
    uploadingFiles.delete(tempKey)

    useToast({
      message: t('image_upload_failed'),
      isError: true,
    })
  }

  // Reset input
  target.value = ''
}

const remove = () => {
  if (model.value) {
    const urlToRemove = model.value
    model.value = ''
    // Clean up imagesSrc and uploadingFiles
    imagesSrc.delete(urlToRemove)
    uploadingFiles.delete(urlToRemove)
  }
}

const preview = async (file: File): Promise<string | undefined> => {
  if (!file) return undefined

  try {
    const result_base64 = await new Promise<string | null>((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.onload = () => resolve(fileReader.result as string | null)
      fileReader.onerror = () => reject(new Error('Failed to read file'))
      fileReader.readAsDataURL(file)
    })

    return result_base64 || undefined
  } catch (error) {
    console.error('Preview error:', error)
    return undefined
  }
}

// Computed property for image source
const imageSrc = computed(() => {
  const url = model.value
  if (!url) return ''
  
  // For temp keys, get from imagesSrc (base64 preview)
  if (url.startsWith('temp_')) {
    return imagesSrc.get(url) || ''
  }
  
  // For uploaded URLs, get from imagesSrc or construct full URL
  const cachedSrc = imagesSrc.get(url)
  if (cachedSrc) {
    return cachedSrc
  }
  
  // Fallback: construct URL
  return url.startsWith('http') ? url : baseURL + url
})

// Watch model to update imagesSrc when URLs are set externally
watch(
  () => model.value,
  (newValue) => {
    if (newValue && !newValue.startsWith('temp_') && !imagesSrc.has(newValue)) {
      // Store the full URL for display
      const displayUrl = newValue.startsWith('http') ? newValue : baseURL + newValue
      imagesSrc.set(newValue, displayUrl)
    }
  },
  { immediate: true }
)
</script>
<template>
  <div>
    <div
      class="border-[#E0E0E024] hover:border-[#E0E0E044] focus:border-[#E0E0E044] bg-[#F8F8F8] group cursor-pointer rounded-lg border-[2px] border-dashed border-muted-300 p-3 transition-colors duration-300 hover:border-muted-400"
      tabindex="0"
      role="button"
      @click="open"
    >
      <div class="flex flex-col items-center gap-2 p-1 text-center">
        <div class="flex items-center justify-center rounded-xl bg-primary-500/35 p-2">
          <Icon name="solar-file-download-linear" class="size-6 text-primary-500" />
        </div>
        <h4 class="text-base text-muted-400">اسحب وافلت الملف</h4>

        <label
          for="file"
          class="cursor-pointer text-sm text-muted-400 transition-colors duration-300 group-hover:text-primary-500 group-focus:text-primary-500"
        >
          او انفر لرفع الملف
        </label>
      </div>
    </div>
  </div>
  <div v-if="model" class="mt-6 flex items-center gap-3">
    <div
      class="flex size-24 items-center justify-center rounded-md border-secondary"
      style="position: relative"
    >
      <img
        class="absolute size-full rounded-md object-cover"
        :src="imageSrc"
        alt="Image preview"
      >
      <div
        v-if="uploadingFiles.get(model)"
        class="absolute size-full flex items-center justify-center rounded-md bg-black/50 z-20"
      >
        <Icon name="tabler:loader-2" class="size-6 text-white animate-spin" />
      </div>
      <div
        v-else
        class="absolute size-full cursor-pointer rounded-md"
        style="background: rgba(0, 0, 0, 0.8)"
      />
      <Icon
        v-if="!uploadingFiles.get(model)"
        name="ph:trash"
        class="z-10 size-5 cursor-pointer text-red-900"
        @click="remove"
      />
    </div>
  </div>
  <input ref="inputEle" hidden type="file" :accept="accept" @change="change" >
</template>
