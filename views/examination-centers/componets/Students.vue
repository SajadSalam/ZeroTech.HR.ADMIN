<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from '~/services/app-client/axios'
import type { BaseFilters } from '~/utils/types/ApiResponses'
import { useExaminationCenters } from '~/views/examination-centers/store'
import { tableHeaders } from '~/views/exams/index'
import type { StudentTicket, StudentTicketFilters } from '../types/ticket'
import { StudentTicketStatus } from '../types/ticket'

const examinationCenterStore = useExaminationCenters()
const isLoading = computed(() => examinationCenterStore.isLoading)
const students = ref<StudentTicket[]>([])
const filters = ref<StudentTicketFilters>({
    examId: '',
    status: null,
    studentId: '',
    studentName: '',
    pageNumber: 1,
    pageSize: 50,
})

const { id, examId } = useRoute().params

const total = ref(0)


async function getBookedStudents() {
    if (examId) {
        filters.value.examId = examId as string
    }
    if(id) {
        filters.value.examCenterId = id as string
    }
    const response = await examinationCenterStore.getBookedStudents(filters.value)
    students.value = response
    total.value = response.pagesCount
}
watchDeep(filters, () => {
    getBookedStudents()
})
const { t } = useI18n()
const headers = [
    {
        label: '#',
        key: 'ticketNumber',
    },
    {
        label: t('name'),
        key: 'studentName',
        icon: 'ph:user-duotone',
    },
    {
        label: t('email'),
        key: 'studentEmail',
        icon: 'ph:envelope-duotone',
    },
    {
        label: t('document-number'),
        key: 'documentNumber',
        icon: 'ph:identification-badge-duotone',
    },
    {
        label: t('status'),
        key: 'status',
        icon: 'ph:check-circle-duotone',
    },
    {
        label: t('exam-center'),
        key: 'examCenterName',
        icon: 'ph:building-duotone',
    },
    {
        label: t('exam-name'),
        key: 'examTitle',
        icon: 'ph:file-duotone',
    },
     {
        label: t('amount'),
        key: 'amount',
        icon: 'ph:money-duotone',
    },
    {
        label: t('exam-date'),
        key: 'examDate',
        icon: 'ph:calendar-duotone',
    },


   
]

getBookedStudents()
const statusOptions = [
    {
        label: t('unpaid'),
        value: StudentTicketStatus.UnPaid,
        color: 'warning',
    },
    {
        label: t('expired'),
        value: StudentTicketStatus.Expired,
        color: 'error',
    },
    
    {
        label: t('paid'),
        value: StudentTicketStatus.Paid,
        color: 'success',
    },
]
const statusLabel = (status: StudentTicketStatus) => {
    return statusOptions.find((option) => option.value === status)
}

</script>
<template>
    <AppCrud hide-create pagination :total-pages="total" v-model:page-number="filters.pageNumber">
        <template #filters>
            <AppFieldAppInputField v-model="filters.studentName" :placeholder="t('search')" />
            <AppFieldAppAutoCompleteField v-model="filters.status" :placeholder="t('status')" :items="statusOptions" item-label="label" item-value="value" />
        </template>
        <AppTable :loading="isLoading" title="Students" :items="students.data" :headers="headers" :total="total"
            :pageNumber="filters.pageNumber" :pageSize="filters.pageSize" @page-change="getBookedStudents">
            <template #data-actions="{ item }">
                <div class="flex items-center gap-3">

                </div>
            </template>
            <template #data-status="{ item }">
                <BaseTag :color="statusLabel(item.status)?.color">
                    {{ statusLabel(item.status)?.label }}
                </BaseTag>
            </template>
        </AppTable>
    </AppCrud>

</template>

<style>
.nui-button.nui-button-pastel.nui-button-success {
    border: 1px solid rgb(68 213 128)
}

.nui-button.nui-button-pastel.nui-button-primary {
    border: 1px solid #A9321E
}
</style>