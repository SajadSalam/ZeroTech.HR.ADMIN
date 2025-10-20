<script setup lang="ts">
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import AppTable from '~/components/app-table/AppTable.vue'
import { tableHeader } from '~/views/requests'
import { useRequestStore } from '~/views/requests/store'
import type { RequestDto } from '~/views/requests/types'
import type { BaseFilters } from '~/utils/types/ApiResponses'
import CreateRequestDialog from '~/views/requests/components/CreateRequestDialog.vue'
import RequestDetailsDialog from '~/views/requests/components/RequestDetailsDialog.vue'
import ApproveRequestDialog from '~/views/requests/components/ApproveRequestDialog.vue'
import CancelRequestDialog from '~/views/requests/components/CancelRequestDialog.vue'

definePageMeta({
    title: 'الطلبات',
    description: 'إدارة الطلبات في النظام',
})

const requestStore = useRequestStore()
const appTableStore = useAppTableStore()
const approveDialogRef = ref<InstanceType<typeof ApproveRequestDialog> | null>(
    null
)
const cancelDialogRef = ref<InstanceType<typeof CancelRequestDialog> | null>(
    null
)

const isLoading = computed(() => requestStore.isLoading)
const requests = computed(() => requestStore.requests || [])
const filters = computed<BaseFilters>({
    get() {
        return requestStore.filters
    },
    set(value: BaseFilters) {
        requestStore.filters = value
    },
})

const getRequests = async () => {
    appTableStore.setLoading(true)
    await requestStore.getRequests()
    appTableStore.setLoading(false)
}

const viewRequestDetails = (item: RequestDto) => {
    requestStore.setSelectedRequest(item)
    requestStore.isEditDialogOpen = true
}

const openApproveDialog = (item: RequestDto) => {
    // Assuming we use the first approval or current step's approval ID
    // You might need to adjust this based on your business logic
    const approvalId = item.requestApprovals?.[0]?.id || item.id
    approveDialogRef.value?.openDialog(approvalId)
}

const openCancelDialog = (item: RequestDto) => {
    cancelDialogRef.value?.openDialog(item.id)
}

getRequests()
watch(
    filters,
    () => {
        getRequests()
    },
    { deep: true }
)

const statusOptions = [
    { label: 'قيد الانتظار', value: '0' },
    { label: 'قيد المراجعة', value: '1' },
    { label: 'مقبول', value: '2' },
    { label: 'مرفوض', value: '3' },
    { label: 'ملغي', value: '4' },
]
</script>

<template>
    <div>
        <AppCrud
            add-button-text="إضافة طلب جديد"
            :add-btn-action="() => (requestStore.isCreateDialogOpen = true)"
            :pagination="true"
            :total-pages="requestStore.totalPages"
            title="الطلبات"
            @update:current-page="filters.pageNumber = $event"
        >
            <AppTable
                title="قائمة الطلبات"
                :headers="tableHeader()"
                :items="requests"
                :is-loading="isLoading"
            >
                <template #data-startDate="{ item }">
                    {{ item.startDate?.split('T')[0] }}
                </template>
                <template #data-endDate="{ item }">
                    {{ item.endDate?.split('T')[0] }}
                </template>
                <template #data-submittedAt="{ item }">
                    {{ item.submittedAt?.split('T')[0] }}
                </template>
                <template #data-progressPercentage="{ item }">
                    <div class="flex items-center gap-2">
                        <div class="w-20 bg-gray-200 rounded-full h-2">
                            <div
                                class="bg-primary-500 h-2 rounded-full"
                                :style="`width: ${item.progressPercentage}%`"
                            />
                        </div>
                        <span class="text-sm"
                            >{{ item.progressPercentage }}%</span
                        >
                    </div>
                </template>
                <template #data-statusDisplay="{ item }">
                    <span
                        class="px-2 py-1 rounded-full text-xs font-medium"
                        :class="{
                            'bg-yellow-100 text-yellow-800': item.status === 0,
                            'bg-blue-100 text-blue-800': item.status === 1,
                            'bg-green-100 text-green-800': item.status === 2,
                            'bg-red-100 text-red-800': item.status === 3,
                            'bg-gray-100 text-gray-800': item.status === 4,
                        }"
                    >
                        {{ item.statusDisplay }}
                    </span>
                </template>
                <template #data-actions="{ item }">
                    <div class="flex justify-center items-center gap-2">
                        <Icon
                            @click="viewRequestDetails(item)"
                            name="ph:eye-duotone"
                            class="size-5 text-primary-500 cursor-pointer hover:text-primary-600"
                            title="عرض التفاصيل"
                        />
                        <Icon
                            v-if="!item.isFinal && item.status !== 4"
                            @click="openApproveDialog(item)"
                            name="ph:check-circle-duotone"
                            class="size-5 text-green-500 cursor-pointer hover:text-green-600"
                            title="الموافقة"
                        />
                        <Icon
                            v-if="item.canBeCancelled"
                            @click="openCancelDialog(item)"
                            name="ph:x-circle-duotone"
                            class="size-5 text-red-500 cursor-pointer hover:text-red-600"
                            title="إلغاء الطلب"
                        />
                    </div>
                </template>
            </AppTable>
        </AppCrud>
        <CreateRequestDialog />
        <RequestDetailsDialog />
        <ApproveRequestDialog ref="approveDialogRef" />
        <CancelRequestDialog ref="cancelDialogRef" />
    </div>
</template>

