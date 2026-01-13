<script setup lang="ts">
import { computed } from 'vue'
import { useRequestStore } from '../store'
import RequestDetails from './RequestDetails.vue'

const requestStore = useRequestStore()

const request = computed(() => requestStore.selectedRequest)
const isOpen = computed({
  get: () => requestStore.isDetailsDialogOpen,
  set: (value: boolean) => {
    if (!value) {
      requestStore.closeAllDialogs()
    }
  }
})
</script>

<template>
  <AppDialog
    v-model="isOpen"
    :title="request ? `طلب رقم #${request.id}` : 'تفاصيل الطلب'"
    size="4xl"
    overflow-y="auto"
    max-height="90vh"
  >
    <div v-if="request" class="max-h-[80vh] overflow-y-auto">
      <RequestDetails :request="request" />
    </div>
    
    <div v-else class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p class="text-gray-600">جاري تحميل تفاصيل الطلب...</p>
      </div>
    </div>

    <template #actions>
      <BaseButton 
        color="gray" 
        @click="isOpen = false"
      >
        إغلاق
      </BaseButton>
    </template>
  </AppDialog>
</template>
