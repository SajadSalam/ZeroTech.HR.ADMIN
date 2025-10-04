<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import axiosIns from '~/services/app-client/axios'
import { useAppToaster } from '~/services/toaster/toaster'
import { tableHeader } from '~/views/applicants'
import { DailyLineChart, GenderPieChart, HepiqBarChart } from '~/views/applicants/components/charts'
import { useApplicantStore } from '~/views/applicants/store'
import { useStatisticsStore } from '~/views/applicants/store/statistics'
import { useAuthStore } from '~/views/auth/store/auth'

definePageMeta({
    title: 'applicants',
    description: 'manage-applicants',
    icon: 'heroicons:user-group',
})
const { t } = useI18n()
const applicantStore = useApplicantStore()
const statisticsStore = useStatisticsStore()
const authStore = useAuthStore()
const headers = computed(() => tableHeader(t))

// State for confirmation dialogs
const isAcceptModalOpen = ref(false)
const isRejectModalOpen = ref(false)
const selectedApplicantId = ref<string | null>(null)
const isActionLoading = ref(false)
const reason = ref('')

// State for bulk operations
const isBulkAcceptModalOpen = ref(false)
const isBulkRejectModalOpen = ref(false)
const bulkReason = ref('')
const isBulkActionLoading = ref(false)
const bulkOperationResult = ref<any>(null)
const isResultModalOpen = ref(false)

onMounted(() => {
    applicantStore.getApplicants()
    statisticsStore.fetchAllStatistics()
})

watchDeep(applicantStore.filters, () => {
    applicantStore.getApplicants()
})

const exportResultsToExcel = async () => {
    // Only run in browser environment
    if (typeof window === 'undefined') return
    
    const res = await axiosIns.get('/applicants/export/excel', {
        responseType: 'blob'
    })
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const a = document.createElement('a')
    a.href = url
    const date = new Date().toISOString()
    a.download = `applicants-${date}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url) 
}

// Action handlers
const showAcceptModal = (documentId: string) => {
    selectedApplicantId.value = documentId
    isAcceptModalOpen.value = true
}

const showRejectModal = (documentId: string) => {
    selectedApplicantId.value = documentId
    isRejectModalOpen.value = true
}

const confirmAccept = async () => {
    if (!selectedApplicantId.value) return
    
    try {
        isActionLoading.value = true
        await applicantStore.acceptApplicant(selectedApplicantId.value)
        isAcceptModalOpen.value = false
        selectedApplicantId.value = null
    } catch (error) {
        // Error is handled by the axios interceptor
    } finally {
        isActionLoading.value = false
    }
}

const confirmReject = async () => {
    if (!selectedApplicantId.value) return
    
    try {
        isActionLoading.value = true
        await applicantStore.rejectApplicant(selectedApplicantId.value, reason.value)
        isRejectModalOpen.value = false
        selectedApplicantId.value = null
    } catch (error) {
        // Error is handled by the axios interceptor
    } finally {
        isActionLoading.value = false
    }
}

const getStatusText = (isAccepted: boolean | null) => {
    if (isAccepted === null) return t('pending')
    return isAccepted ? t('accepted') : t('rejected')
}

const getStatusColor = (isAccepted: boolean | null) => {
    if (isAccepted === null) return 'text-warning-600'
    return isAccepted ? 'text-success-600' : 'text-danger-600'
}

const selectedApplicants = ref<string[]>([])
const handleCheckboxChange = (documentId: string) => {
    if (selectedApplicants.value.includes(documentId)) {
        selectedApplicants.value = selectedApplicants.value.filter(id => id !== documentId)
    } else {
        selectedApplicants.value.push(documentId)
    }
}

const bulkAccept = () => {
    if (selectedApplicants.value.length === 0) {
        useAppToaster().show('warning', t('select-applicants-first'))
        return
    }
    isBulkAcceptModalOpen.value = true
}

const bulkReject = () => {
    if (selectedApplicants.value.length === 0) {
        useAppToaster().show('warning', t('select-applicants-first'))
        return
    }
    isBulkRejectModalOpen.value = true
}

const confirmBulkAccept = async () => {
    try {
        isBulkActionLoading.value = true
        const result = await applicantStore.bulkAcceptApplicants(selectedApplicants.value)
        
        bulkOperationResult.value = result
        isBulkAcceptModalOpen.value = false
        selectedApplicants.value = []
        isResultModalOpen.value = true
        
        if (result.success) {
            useAppToaster().show('success', result.message)
        }
    } catch (error: any) {
        useAppToaster().show('danger', error.response?.data?.message || t('operation-failed'))
    } finally {
        isBulkActionLoading.value = false
    }
}

const confirmBulkReject = async () => {
    try {
        isBulkActionLoading.value = true
        const result = await applicantStore.bulkRejectApplicants(selectedApplicants.value, bulkReason.value)
        
        bulkOperationResult.value = result
        isBulkRejectModalOpen.value = false
        selectedApplicants.value = []
        bulkReason.value = ''
        isResultModalOpen.value = true
        
        if (result.success) {
            useAppToaster().show('success', result.message)
        }
    } catch (error: any) {
        useAppToaster().show('danger', error.response?.data?.message || t('operation-failed'))
    } finally {
        isBulkActionLoading.value = false
    }
}

const selectAllApplicants = () => {
    const allIds = applicantStore.applicants.map(app => app.documentId).filter(Boolean) as string[]
    selectedApplicants.value = allIds
}

const clearSelection = () => {
    selectedApplicants.value = []
}
</script>

<template>
    <ClientOnly>
    <!-- Statistics Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <GenderPieChart v-if="authStore.hasPermission(['api::applicant.applicant.getGenderStatistics'])" />
        <HepiqBarChart v-if="authStore.hasPermission(['api::applicant.applicant.getHepiqStatistics'])" />
        <div class="lg:col-span-1">
            <DailyLineChart v-if="authStore.hasPermission(['api::applicant.applicant.getHepiqStatistics'])" />
        </div>
    </div>

    <!-- Summary Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 my-2">
        <div class="bg-white p-4 rounded-lg border border-gray-200">
            <div class="flex items-center gap-2">
                <Icon name="ph:user-circle-duotone" class=" text-primary text-4xl" />
                <div>
                    <div class="text-sm font-medium">
                        {{ $t('totalApplicants') }}
                    </div>
                    <div class="text-2xl font-bold">
                        {{ applicantStore.totalItems }}
                    </div>
                    </div>
                </div>
            </div>
            <!-- <div class="bg-white p-4 rounded-lg border border-gray-200">
            <div class="flex items-center gap-2">
                <Icon name="ph:user-circle-gear-duotone" class=" text-primary text-4xl" />
                <div>
                    <div class="text-sm font-medium">
                        {{ $t('pendingApplicants') }}
                    </div>
                    <div class="text-2xl font-bold">
                        {{ applicantStore.pendingApplicants }}
                    </div>
                    </div>
                </div>
            </div> -->
            <div class="bg-white p-4 rounded-lg border border-gray-200">
            <div class="flex items-center gap-2">
                <Icon name="ph:user-circle-minus-duotone" class=" text-primary text-4xl" />
                <div>
                    <div class="text-sm font-medium">
                        {{ $t('rejectedApplicants') }}
                    </div>
                    <div class="text-2xl font-bold">
                        {{ applicantStore.rejectedApplicants }}
                    </div>
                    </div>
                </div>
            </div>
            <div class="bg-white p-4 rounded-lg border border-gray-200">
            <div class="flex items-center gap-2">
                <Icon name="ph:user-circle-check-duotone" class=" text-primary text-4xl" />
                <div>
                    <div class="text-sm font-medium">
                        {{ $t('acceptedApplicants') }}
                    </div>
                    <div class="text-2xl font-bold">
                        {{ applicantStore.acceptedApplicants }}
                    </div>
                    </div>
                </div>
            </div>
            
            
        </div>
        <AppCrud hideCreate pagination v-model:current-page="applicantStore.filters.pageNumber"
            :total-pages="applicantStore.totalPages" :title="$t('applicants')">
                         <template #filters>
                  <template v-if="selectedApplicants.length > 0">
                     <div class="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                         <div class="text-sm font-medium text-blue-800">
                             {{ $t('selected') }}: {{ selectedApplicants.length }}
                         </div>
                         <div class="flex gap-2">
                             <BaseButton
                             v-if="authStore.hasPermission(['api::applicant.applicant.bulkAcceptApplicants'])"
                             size="sm" color="success" @click="bulkAccept">
                                 <Icon name="ph:check-duotone" class="me-1" />
                                 {{ t('accept') }}
                             </BaseButton>
                             <BaseButton
                             v-if="authStore.hasPermission(['api::applicant.applicant.bulkRejectApplicants'])"
                             size="sm" color="danger" @click="bulkReject">
                                 <Icon name="ph:x-duotone" class="me-1" />
                                 {{ t('reject') }}
                             </BaseButton>
                             <BaseButton size="sm" color="muted" variant="outline" @click="selectAllApplicants">
                                 <Icon name="ph:check-square-duotone" class="me-1" />
                                 {{ t('select-all') }}
                             </BaseButton>
                             <BaseButton size="sm" color="muted" variant="outline" @click="clearSelection">
                                 <Icon name="ph:x-square-duotone" class="me-1" />
                                 {{ t('clear-selection') }}
                             </BaseButton>
                         </div>
                     </div>
                 </template>
             </template>
            <template #headerActions>
                <BaseButton color="primary"
                v-if="authStore.hasPermission(['api::applicant.applicant.exportToExcel'])"
                @click="exportResultsToExcel">
                    <Icon name="ph:file-duotone" class=" me-2" />
                    {{ t('export-applicants-to-excel') }}
                </BaseButton>

               
            </template>

            <AppTable :headers="headers" :items="applicantStore.applicants" :loading="applicantStore.isLoading">
                <template #data-fullName="{ item }">
                     <div class="flex items-center gap-2">
                        <BaseCheckbox
                     @change="handleCheckboxChange(item.documentId)"
                     :value="item.documentId" 
                     :model-value="selectedApplicants.includes(item.documentId)"
                     class="text-black"
                     v-if="authStore.hasPermission(['api::applicant.applicant.bulkAcceptApplicants']) || authStore.hasPermission(['api::applicant.applicant.bulkRejectApplicants'])"
                      />
                      <span >
                        {{ `${item.fullName || ''}`.trim() }}
                      </span>
                     </div>
                 </template>


                <template #data-createdAt="{ item }">
                    <div class="max-w-xs truncate" :title="item.createdAt || ''">
                        {{ item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '' }}
                    </div>
                </template>

                <template #data-isAccepted="{ item }">
                    <div class="max-w-xs">
                        <span :class="getStatusColor(item.isAccepted)" class="font-medium">
                            {{ getStatusText(item.isAccepted) }}
                        </span>
                    </div>
                </template>

                <template #data-actions="{ item }">
                    <div class="flex items-center gap-2">
                        <BaseButton 
                            v-if="item.isAccepted !== true && authStore.hasPermission(['api::applicant.applicant.acceptApplicant'])" 
                            size="sm" 
                            color="success" 
                            @click="showAcceptModal(item.documentId)"
                            :disabled="applicantStore.isLoading"
                            
                        >
                            <Icon name="ph:check-duotone" class="me-1" />
                            {{ t('accept') }}
                        </BaseButton>
                        <BaseButton 
                            v-if="item.isAccepted !== false && authStore.hasPermission(['api::applicant.applicant.rejectApplicant'])" 
                            size="sm" 
                            color="danger" 
                            @click="showRejectModal(item.documentId)"
                            :disabled="applicantStore.isLoading"
                        >
                            <Icon name="ph:x-duotone" class="me-1" />
                            {{ t('reject') }}
                        </BaseButton>
                    </div>
                </template>
            </AppTable>
        </AppCrud>

        <!-- Accept Confirmation Dialog -->
        <AppDialog
            v-model="isAcceptModalOpen"
            size="lg"
            :title="t('accept-applicant')"
            :loading="isActionLoading"
        >
            <div class="text-center">
                <Icon name="ph:check-circle-duotone" class="mx-auto text-6xl text-success-500 mb-4" />
                <div class="text-xl font-medium mb-2">
                    {{ t('accept-confirmation') }}
                </div>
            </div>

            <template #actions>
                <BaseButton 
                    color="success" 
                    class="flex-grow" 
                    :loading="isActionLoading" 
                    @click="confirmAccept"
                >
                    <Icon name="ph:check-duotone" class="me-2" />
                    {{ t('accept') }}
                </BaseButton>
                <BaseButton
                    color="muted"
                    variant="outline"
                    class="flex-grow"
                    :disabled="isActionLoading"
                    @click="isAcceptModalOpen = false"
                >
                    {{ t('cancel') }}
                </BaseButton>
            </template>
        </AppDialog>

        <!-- Reject Confirmation Dialog -->
        <AppDialog
            v-model="isRejectModalOpen"
            size="lg"
            :title="t('reject-applicant')"
            :loading="isActionLoading"
        >
            <div class="text-center">
                <Icon name="ph:x-circle-duotone" class="mx-auto text-6xl text-danger-500 mb-4" />
                <div class="text-xl font-medium mb-2">
                    {{ t('reject-confirmation') }}
                </div>
                <div class="mt-4 text-start">
                    <BaseTextarea v-model="reason" :label="t('reason')" />
                </div>
            </div>

            <template #actions>
                <BaseButton 
                    color="danger" 
                    class="flex-grow" 
                    :loading="isActionLoading" 
                    @click="confirmReject"
                >
                    <Icon name="ph:x-duotone" class="me-2" />
                    {{ t('reject') }}
                </BaseButton>
                <BaseButton
                    color="muted"
                    variant="outline"
                    class="flex-grow"
                    :disabled="isActionLoading"
                    @click="isRejectModalOpen = false"
                >
                    {{ t('cancel') }}
                </BaseButton>
            </template>
        </AppDialog>

        <!-- Bulk Accept Confirmation Dialog -->
        <AppDialog
            v-model="isBulkAcceptModalOpen"
            size="lg"
            :title="t('bulk-accept-title')"
            :loading="isBulkActionLoading"
        >
            <div class="text-center">
                <Icon name="ph:check-circle-duotone" class="mx-auto text-6xl text-success-500 mb-4" />
                <div class="text-xl font-medium mb-2">
                    {{ t('bulk-accept-confirmation') }}
                </div>
                <div class="text-sm text-gray-600">
                    {{ t('selected') }}: {{ selectedApplicants.length }} {{ t('applicants').toLowerCase() }}
                </div>
            </div>

            <template #actions>
                <BaseButton 
                    color="success" 
                    class="flex-grow" 
                    :loading="isBulkActionLoading" 
                    @click="confirmBulkAccept"
                >
                    <Icon name="ph:check-duotone" class="me-2" />
                    {{ t('bulk-accept') }}
                </BaseButton>
                <BaseButton
                    color="muted"
                    variant="outline"
                    class="flex-grow"
                    :disabled="isBulkActionLoading"
                    @click="isBulkAcceptModalOpen = false"
                >
                    {{ t('cancel') }}
                </BaseButton>
            </template>
        </AppDialog>

        <!-- Bulk Reject Confirmation Dialog -->
        <AppDialog
            v-model="isBulkRejectModalOpen"
            size="lg"
            :title="t('bulk-reject-title')"
            :loading="isBulkActionLoading"
        >
            <div class="text-center">
                <Icon name="ph:x-circle-duotone" class="mx-auto text-6xl text-danger-500 mb-4" />
                <div class="text-xl font-medium mb-2">
                    {{ t('bulk-reject-confirmation') }}
                </div>
                <div class="text-sm text-gray-600 mb-4">
                    {{ t('selected') }}: {{ selectedApplicants.length }} {{ t('applicants').toLowerCase() }}
                </div>
                <div class="text-start">
                    <BaseTextarea v-model="bulkReason" :label="t('reason')" :placeholder="t('reason')" />
                </div>
            </div>

            <template #actions>
                <BaseButton 
                    color="danger" 
                    class="flex-grow" 
                    :loading="isBulkActionLoading" 
                    @click="confirmBulkReject"
                >
                    <Icon name="ph:x-duotone" class="me-2" />
                    {{ t('bulk-reject') }}
                </BaseButton>
                <BaseButton
                    color="muted"
                    variant="outline"
                    class="flex-grow"
                    :disabled="isBulkActionLoading"
                    @click="isBulkRejectModalOpen = false"
                >
                    {{ t('cancel') }}
                </BaseButton>
            </template>
        </AppDialog>

        <!-- Bulk Operation Results Dialog -->
        <AppDialog
            v-model="isResultModalOpen"
            size="lg"
            :title="t('bulk-operation-results')"
        >
            <div v-if="bulkOperationResult" class="space-y-4">
                <div class="text-center">
                    <Icon 
                        :name="bulkOperationResult.success ? 'ph:check-circle-duotone' : 'ph:warning-circle-duotone'" 
                        :class="bulkOperationResult.success ? 'text-success-500' : 'text-warning-500'"
                        class="mx-auto text-6xl mb-4" 
                    />
                    <div class="text-lg font-medium mb-2">
                        {{ bulkOperationResult.message }}
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-4 text-center">
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <div class="text-2xl font-bold text-blue-600">
                            {{ bulkOperationResult.data?.totalProcessed || 0 }}
                        </div>
                        <div class="text-sm text-blue-600">
                            {{ t('total-processed') }}
                        </div>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg">
                        <div class="text-2xl font-bold text-green-600">
                            {{ bulkOperationResult.data?.successful?.length || 0 }}
                        </div>
                        <div class="text-sm text-green-600">
                            {{ t('successful-operations') }}
                        </div>
                    </div>
                    <div class="bg-red-50 p-4 rounded-lg">
                        <div class="text-2xl font-bold text-red-600">
                            {{ bulkOperationResult.data?.failed?.length || 0 }}
                        </div>
                        <div class="text-sm text-red-600">
                            {{ t('failed-operations') }}
                        </div>
                    </div>
                </div>
            </div>

            <template #actions>
                <BaseButton
                    color="primary"
                    class="flex-grow"
                    @click="isResultModalOpen = false"
                >
                    {{ t('close') }}
                </BaseButton>
            </template>
        </AppDialog>
        </ClientOnly>
</template>