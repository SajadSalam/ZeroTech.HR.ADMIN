<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface Props {
  size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  title?: string
  loading?: boolean
  overflowY?: 'auto' | 'visible' // New prop for overflow-y
}
const i18n = useI18n()
const title = computed(() => props.title ?? i18n.t('add'))
const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  title: 'Add',
  overflowY: 'auto', // Default value for overflowY
})
const isDialogOpen = defineModel({
  default: false,
})
const isLoading = computed(() => props.loading)
const slots = useSlots()
const hasSlot = (name: string) => !!slots[name]
</script>

<template>
  <TairoModal
    :open="isDialogOpen"
    :size="size"
    :overflow="props.overflowY"
    :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
    class="w-[100px] !bg-white dark:!bg-[#010518] dark:text-white"
    @close="isDialogOpen = true"
  >
    <template #header>
      <!-- Header -->
      <div class="flex w-full items-center justify-between p-4">
        <div v-if="!hasSlot('header')" class="flex items-center gap-2">
            <h3 class="font-heading text-2xl font-bold leading-6 text-muted-900 dark:text-white">
                 {{ title }}
            </h3>
        <slot name="header" />
        </div>

        <BaseButton
          rounded="full"
          color="danger"
          variant="outline"
          class="!p-2"
          @click="isDialogOpen = false"
        >
          <Icon name="material-symbols:close-rounded" class="size-5" />
        </BaseButton>
      </div>
    </template>

    <!-- Body -->

    <div class="max-h-[70vh] overflow-y-auto px-2 text-start md:px-3">
      <slot v-if="!isLoading" />
      <AppLoading v-else />
    </div>

    <template #footer>
      <!-- Footer -->

      <div class="flex w-full items-center justify-end gap-2 p-2 md:p-4">
        <slot name="actions" />
      </div>
      <slot name="footer" />
    </template>
  </TairoModal>
</template>
<style>
div[role="dialog"][data-headlessui-state="open"] {
    z-index: 60 !important;
}
</style>