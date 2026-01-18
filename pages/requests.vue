<script setup lang="ts">
import AppCrud from '~/components/app-crud/AppCrud.vue'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppTable from '~/components/app-table/AppTable.vue'
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import { statusOptions, tableHeader } from '~/views/requests'
import CancelRequest from '~/views/requests/components/CancelRequest.vue'
import RequestCreate from '~/views/requests/components/RequestCreate.vue'
import RequestDetailsDialog from '~/views/requests/components/RequestDetailsDialog.vue'
import { useRequestStore } from '~/views/requests/store'
import type { RequestDto, RequestFilters } from '~/views/requests/types'
import { RequestStatus } from '~/views/requests/types'

definePageMeta({
  title: 'إدارة الطلبات',
  description: 'إدارة طلبات الموظفين والموافقات',
})

const requestStore = useRequestStore()
const appTableStore = useAppTableStore()

const isLoading = computed(() => requestStore.isLoading)
const requests = computed(() => requestStore.requests || [])
const filters = computed<RequestFilters>({
  get() {
    return requestStore.filters
  },
  set(value) {
    requestStore.filters = value
  },
})

const getRequests = async () => {
  appTableStore.setLoading(true)
  await requestStore.getRequests()
  appTableStore.setLoading(false)
}

const handleCancel = (item: RequestDto) => {
  // Only allow cancelling if request is in cancellable state
  if (item.status === RequestStatus.Submitted || 
      item.status === RequestStatus.InProgress || 
      item.status === RequestStatus.ApprovedPartially) {
    requestStore.openCancelDialog(item)
  }
}

// Load data on mount
onMounted(() => {
  getRequests()
})

// Watch filters for changes
watch(filters, () => { getRequests() }, { deep: true })
</script>

<template>
  <div>
    <AppCrud
      add-button-text="إنشاء طلب جديد"
      :add-btn-action="() => requestStore.openCreateDialog()"
      :pagination="true"
      :total-pages="requestStore.totalPages"
      title="إدارة الطلبات"
      @update:current-page="filters.pageNumber = $event"
    >
      <AppTable
        title="قائمة الطلبات"
        :headers="tableHeader()"
        :items="requests"
        :is-loading="isLoading"
      >
        <!-- Status column with colored badges -->
        <template #data-status="{ item }">
          <span class="px-2 py-1 rounded-full text-xs font-medium"
                :class="`bg-${requestStore.getStatusColor(item.status)}-100 text-${requestStore.getStatusColor(item.status)}-800`">
            {{ requestStore.getStatusText(item.status) }}
          </span>
        </template>

        <!-- Employee column with full name -->
        <template #data-employee="{ item }">
          <div>
            <div class="font-medium">{{ item.employee?.fullName }}</div>
            <div class="text-sm text-gray-500">{{ item.employee?.employeeNumber }}</div>
          </div>
        </template>

        <!-- Request type column -->
        <template #data-requestType="{ item }">
          <div>
            <div class="font-medium">{{ item.requestType.name }}</div>
            <div class="text-sm text-gray-500">{{ item.requestType.description }}</div>
          </div>
        </template>

        <!-- Duration with balance info -->
        <template #data-durationDays="{ item }">
          <div>
            <span class="font-medium">{{ item.durationDays || 'غير محدد' }} يوم</span>
            <div v-if="item.affectsBalance" class="text-xs text-blue-600">
              يؤثر على الرصيد
            </div>
          </div>
        </template>

        <!-- Custom actions -->
        <template #data-actions="{ item }">
          <div class="flex items-center gap-2">
      <!-- View Details -->
            <!-- Cancel -->
            <button
              @click="handleCancel(item)"
              class="p-1 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded"
              title="إلغاء الطلب"
            >
              <Icon name="ph:x-circle-duotone" class="size-4" />
            </button>
          </div>
        </template>
      </AppTable>
    </AppCrud>

    <!-- Dialogs -->
    <RequestCreate />
    <CancelRequest />
    <RequestDetailsDialog />
  </div>
</template>
