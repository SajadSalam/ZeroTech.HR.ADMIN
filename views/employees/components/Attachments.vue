<script setup lang="ts">
import { baseURL } from '~/services/app-client/axios'

type AttachmentBox = {
  fileName?: string
  fileSizeFormatted?: string
  description?: string
  attachmentType: string
  filePath?: string
  fileSize?: number
  contentType?: string
}
const props = defineProps<{
  attachments?: AttachmentBox[]
}>()

const items: AttachmentBox[] =
  props.attachments ??
  []

const isImageViewDialogOpen = ref(false)
const selectedImageUrl = ref<string>('')
const selectedImageName = ref<string>('')

function onView(attachment: AttachmentBox) {
  if (!attachment.filePath) return

  selectedImageUrl.value = `https://hr-api.pomelo-bot.xyz${attachment.filePath}`
  selectedImageName.value = attachment.fileName ?? 'صورة'
  isImageViewDialogOpen.value = true
}

function onDownload(attachment: AttachmentBox) {
  if (!attachment.filePath) return

  const downloadUrl = `https://hr-api.pomelo-bot.xyz${attachment.filePath}`
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = attachment.fileName ?? 'download'
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <section class="">
    <h3 class="mb-2">الوثائق و المرفقات</h3>
    <div class="grid gap-4 md:grid-cols-2">
      <div v-for="(b, i) in attachments" :key="i"
        class="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-4 shadow-sm">
        <div class="flex flex-col items-center justify-center gap-2">
          <div class="flex flex-col items-center justify-center gap-1">
            <div class="text-sm text-#40444C">الوثيقة</div>

            <div class="">{{ b.fileName ?? '' }}</div>
            <div class="">{{ b.description ?? '' }}</div>
          </div>

          <div class="flex w-full items-center gap-2">
            <BaseButton variant="pastel" class="gap-2 w-full" color="success" rounded="sm" @click="onView(b)">
              <Icon name="i-ph:eye-duotone" class="size-5" />
              عرض
            </BaseButton>
            <BaseButton variant="pastel" class="gap-2 w-full" color="primary" rounded="sm" @click="onDownload(b)">
              <Icon name="i-ph:cloud-arrow-down-duotone" class="size-5" />
              تحميل
              <span class="text-xs text-gray-500">{{ b.fileSizeFormatted ?? '' }}</span>
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <AppDialog v-model="isImageViewDialogOpen" :title="selectedImageName" size="xl" overflow-y="visible">
      <div class="flex items-center justify-center p-4">
        <img :src="selectedImageUrl" :alt="selectedImageName" class="max-w-full max-h-[70vh] object-contain rounded-lg"
          @error="(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'300\'%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dominant-baseline=\'middle\' font-family=\'Arial\' font-size=\'18\' fill=\'%23999\'%3Eفشل تحميل الصورة%3C/text%3E%3C/svg%3E' }" />
      </div>
      <template #actions>
        <BaseButton color="muted" @click="isImageViewDialogOpen = false">
          إغلاق
        </BaseButton>
      </template>
    </AppDialog>
  </section>
</template>
