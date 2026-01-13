<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CancelRequest from '~/views/requests/components/CancelRequest.vue'
import RequestDetails from '~/views/requests/components/RequestDetails.vue'
import { useRequestStore } from '~/views/requests/store'
import { RequestStatus } from '~/views/requests/types'

const route = useRoute()
const router = useRouter()
const requestStore = useRequestStore()

const requestId = computed(() => Number(route.params.id))
const request = computed(() => requestStore.selectedRequest)
const isLoading = computed(() => requestStore.isLoading)

// Load request data
onMounted(async () => {
  if (requestId.value) {
    try {
      await requestStore.getRequestById(requestId.value)
    } catch (error) {
      console.error('Error loading request:', error)
      // Redirect to requests list if request not found
      router.push('/requests')
    }
  }
})

// Check permissions
const canCancel = computed(() => {
  if (!request.value) return false
  return request.value.status === RequestStatus.Submitted || 
         request.value.status === RequestStatus.InProgress || 
         request.value.status === RequestStatus.ApprovedPartially
})

const canEdit = computed(() => {
  if (!request.value) return false
  return request.value.status === RequestStatus.Submitted || 
         request.value.status === RequestStatus.InProgress
})

const handleEdit = () => {
  if (request.value) {
    requestStore.openEditDialog(request.value)
  }
}

const handleCancel = () => {
  if (request.value) {
    requestStore.openCancelDialog(request.value)
  }
}

definePageMeta({
  title: 'تفاصيل الطلب',
  description: 'عرض تفاصيل الطلب ومسار الموافقات',
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <button
          @click="$router.push('/requests')"
          class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icon name="ph:arrow-right-duotone" class="size-5" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ request ? `طلب رقم #${request.id}` : 'تفاصيل الطلب' }}
          </h1>
          <p class="text-gray-600 mt-1">عرض تفاصيل الطلب ومسار الموافقات</p>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="request" class="flex items-center gap-2">
        <BaseButton
          v-if="canEdit"
          color="primary"
          variant="outline"
          @click="handleEdit"
        >
          <Icon name="ph:pencil-duotone" class="size-4 ml-1" />
          تعديل
        </BaseButton>

        <BaseButton
          v-if="canCancel"
          color="orange"
          variant="outline"
          @click="handleCancel"
        >
          <Icon name="ph:x-circle-duotone" class="size-4 ml-1" />
          إلغاء الطلب
        </BaseButton>

        <BaseButton
          color="gray"
          variant="outline"
          @click="window.print()"
        >
          <Icon name="ph:printer-duotone" class="size-4 ml-1" />
          طباعة
        </BaseButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p class="text-gray-600">جاري تحميل تفاصيل الطلب...</p>
      </div>
    </div>

    <!-- Request Not Found -->
    <div v-else-if="!request" class="text-center py-12">
      <Icon name="ph:file-x-duotone" class="size-16 text-gray-400 mx-auto mb-4" />
      <h2 class="text-xl font-semibold text-gray-900 mb-2">الطلب غير موجود</h2>
      <p class="text-gray-600 mb-4">لم يتم العثور على الطلب المطلوب</p>
      <BaseButton @click="$router.push('/requests')">
        العودة إلى قائمة الطلبات
      </BaseButton>
    </div>

    <!-- Request Details -->
    <RequestDetails v-else :request="request" />

    <!-- Dialogs -->
    <CancelRequest />
  </div>
</template>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
