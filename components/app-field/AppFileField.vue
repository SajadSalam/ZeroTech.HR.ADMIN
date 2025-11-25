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

// Support both single string and array of strings for backward compatibility
const model = defineModel<string | string[] | null>()
const imagesSrc = reactive<Map<string, string>>(new Map())
const uploadingFiles = reactive<Map<string, boolean>>(new Map())
const fileService = new FileService()

// Computed property to normalize model value to array
const modelArray = computed<string[]>({
  get: () => {
    if (!model.value) return []
    if (Array.isArray(model.value)) return model.value
    return [model.value]
  },
  set: (newValue: string[]) => {
    if (props.multiple) {
      model.value = newValue
    } else {
      model.value = newValue.length > 0 ? newValue[0] : null
    }
  }
})

const inputEle = ref()

const open = () => {
  inputEle.value.click()
}

const change = async (e: Event) => {
  const target = e.target as HTMLInputElement

  if (!target.files?.length) return

  const maxSize = 1024 * 1024 // 1MB in bytes
  const filesToUpload: File[] = []
  const tempKeys: string[] = []

  // Process all files
  for (let i = 0; i < target.files.length; i++) {
    const file = target.files[i]
    if (!file) continue

    // Validate file size
    if (file.size > maxSize) {
      useToast({
        message: `${file.name}: ${t('file_size_error')}`,
        isError: true,
      })
      continue
    }

    filesToUpload.push(file)
  }

  if (filesToUpload.length === 0) return

  // Clear previous previews if not appending
  if (!props.append) {
    modelArray.value.forEach(url => {
      imagesSrc.delete(url)
      uploadingFiles.delete(url)
    })
    modelArray.value = []
  }

  // Show previews immediately using temp keys
  for (const file of filesToUpload) {
    const tempKey = `temp_${file.name}_${Date.now()}_${Math.random()}`
    const src = await preview(file)
    
    if (!src) {
      useToast({
        message: `${file.name}: ${t('image_upload_failed')}`,
        isError: true,
      })
      continue
    }

    imagesSrc.set(tempKey, src)
    uploadingFiles.set(tempKey, true)
    tempKeys.push(tempKey)
    modelArray.value.push(tempKey)
  }

  // Upload files
  try {
    useToast({
      message: t('image_uploading'),
      isError: false,
    })

    let urls: string[]
    
    if (props.multiple && filesToUpload.length > 1) {
      // Use uploadFiles for multiple files
      urls = await fileService.uploadFiles(filesToUpload)
    } else {
      // Use uploadFile for single file
      const url = await fileService.uploadFile(filesToUpload[0])
      urls = url ? [url] : []
    }
    
    if (!urls || urls.length === 0) {
      throw new Error('Upload failed')
    }

    // Replace temp keys with actual URLs
    tempKeys.forEach((tempKey, index) => {
      const url = urls[index]
      if (url) {
        const modelIndex = modelArray.value.indexOf(tempKey)
        if (modelIndex !== -1) {
          modelArray.value[modelIndex] = url
        }
        
        // Store the full URL for display
        const displayUrl = url.startsWith('http') ? url : baseURL + url
        imagesSrc.set(url, displayUrl)
        uploadingFiles.delete(tempKey)
        imagesSrc.delete(tempKey)
      }
    })

    useToast({
      message: t('image_upload_success'),
      isError: false,
    })
  } catch (error) {
    // Clean up on error
    tempKeys.forEach(tempKey => {
      const index = modelArray.value.indexOf(tempKey)
      if (index !== -1) {
        modelArray.value.splice(index, 1)
      }
      imagesSrc.delete(tempKey)
      uploadingFiles.delete(tempKey)
    })

    useToast({
      message: t('image_upload_failed'),
      isError: true,
    })
  }

  // Reset input
  target.value = ''
}

const remove = (url: string) => {
  const index = modelArray.value.indexOf(url)
  if (index !== -1) {
    modelArray.value.splice(index, 1)
    // Clean up imagesSrc and uploadingFiles
    imagesSrc.delete(url)
    uploadingFiles.delete(url)
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

// Computed property for image sources
const getImageSrc = (url: string) => {
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
}

// Watch model to update imagesSrc when URLs are set externally
watch(
  () => model.value,
  (newValue) => {
    if (newValue && Array.isArray(newValue)) {
      newValue.forEach(url => {
        if (url && !url.startsWith('temp_') && !imagesSrc.has(url)) {
          // Store the full URL for display
          const displayUrl = url.startsWith('http') ? url : baseURL + url
          imagesSrc.set(url, displayUrl)
        }
      })
    }
  },
  { immediate: true, deep: true }
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
        <h4 class="text-base text-muted-400">اسحب وافلت {{ multiple ? 'الملفات' : 'الملف' }}</h4>

        <label
          for="file"
          class="cursor-pointer text-sm text-muted-400 transition-colors duration-300 group-hover:text-primary-500 group-focus:text-primary-500"
        >
          او انقر لرفع {{ multiple ? 'الملفات' : 'الملف' }}
        </label>
      </div>
    </div>
  </div>
  <div v-if="modelArray && modelArray.length > 0" class="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
    <div
      v-for="url in modelArray"
      :key="url"
      class="flex size-24 items-center justify-center rounded-md border-secondary"
      style="position: relative"
    >
      <img
        class="absolute size-full rounded-md object-cover"
        :src="getImageSrc(url)"
        alt="Image preview"
      >
      <div
        v-if="uploadingFiles.get(url)"
        class="absolute size-full flex items-center justify-center rounded-md bg-black/50 z-20"
      >
        <Icon name="tabler:loader-2" class="size-6 text-white animate-spin" />
      </div>
      <div
        v-else
        class="absolute size-full cursor-pointer rounded-md opacity-0 hover:opacity-100 transition-opacity"
        style="background: rgba(0, 0, 0, 0.8)"
        @click="remove(url)"
      >
        <div class="flex items-center justify-center size-full">
          <Icon
            name="ph:trash"
            class="size-5 text-red-500"
          />
        </div>
      </div>
    </div>
  </div>
  <input ref="inputEle" hidden type="file" :accept="accept" :multiple="multiple" @change="change" >
</template>
