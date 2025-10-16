<script setup lang="ts">
type AttachmentBox = {
  title: string
  uploaded?: boolean
  fileName?: string
}
const props = defineProps<{
  items?: AttachmentBox[]
}>()

const emit = defineEmits<{
  (e: 'upload', title: string): void
  (e: 'view', title: string): void
}>()

const items: AttachmentBox[] =
  props.items ??
  [
    { title: 'عقد العمل', uploaded: true, fileName: 'contract.pdf' },
    { title: 'الهوية الوطنية', uploaded: true, fileName: 'id.jpg' },
    { title: 'السيرة الذاتية', uploaded: false },
    { title: 'الشهادات الدراسية', uploaded: false },
  ]

function onUpload(t: string) {
  emit('upload', t)
}
function onView(t: string) {
  emit('view', t)
}
</script>

<template>
  <section class="">
    <h3 class="mb-2">الوثائق و المرفقات</h3>

    <div class="grid gap-4 md:grid-cols-2">
      <div
        v-for="(b, i) in items"
        :key="i"
        class="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-4 shadow-sm"
      >
        <div class="flex flex-col items-center justify-center gap-2">
          <div class="flex flex-col items-center justify-center gap-1">
            <div class="text-sm text-#40444C">الوثيقة</div>
        
            <div class="">{{ b.title }}</div>
          </div>

          <div class="flex w-full items-center gap-2">
              <BaseButton variant="pastel" class="gap-2 w-full" color="success" rounded="sm"  @click="onUpload(b.title)">
                 <Icon name="i-ph:eye-duotone" class="size-5" />
                 عرض
             </BaseButton>
            <BaseButton variant="pastel" class="gap-2 w-full" color="primary" rounded="sm"  @click="onUpload(b.title)">
                <Icon name="i-ph:cloud-arrow-up-duotone" class="size-5" />
                تحميل
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
