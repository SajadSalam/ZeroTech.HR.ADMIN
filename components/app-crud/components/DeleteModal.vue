<script setup lang="ts">
import { useAppCrudStore } from '../store/AppCrudStore'
const appCrudStore = useAppCrudStore()
const isDeleteModalOpen = computed({
  get: () => appCrudStore.isDeleteModalOpen,
  set: (value: boolean) => (appCrudStore.isDeleteModalOpen = value),
})

const isLoading = ref(false)

const deleteItem = async () => {
  try {
    isLoading.value = true

    if (appCrudStore.deleteService) await appCrudStore.deleteService(appCrudStore.itemId as string)
    else throw new Error('No delete service provided')
  } catch {
    // Handle error, e.g., show a notification
  } finally {
    isLoading.value = false
    isDeleteModalOpen.value = false
  }
}
</script>
<template>
  <AppDialog
    v-model="isDeleteModalOpen"
    size="lg"
    :title="$t('confirm-delete')"
    :loading="isLoading"
    color="none"
  >
    <div>
      <img src="~/assets/images/trash.gif" class="mx-auto h-[200px]" >
    </div>
    <div class="mt-4 w-full text-center text-xl font-bold text-danger-600">
      {{ $t('delete-confirmation') }}
    </div>
    <div class="mt-2 flex w-full items-center gap-2">
      <BaseButton :loading="isLoading" color="danger" class="flex-grow gap-1" @click="deleteItem">
        <Icon name="ph:trash" />
        {{ $t('delete') }}
      </BaseButton>
      <BaseButton
        :loading="isLoading"
        color="muted"
        variant="outline"
        class="flex-grow gap-1"
        @click="isDeleteModalOpen = false"
      >
        {{ $t('cancel') }}
      </BaseButton>
    </div>
  </AppDialog>
</template>
