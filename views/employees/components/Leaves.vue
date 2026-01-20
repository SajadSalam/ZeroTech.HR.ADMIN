    <script setup lang="ts">
import AppTable from '~/components/app-table/AppTable.vue'
import { useAttendanceStore } from '~/views/attendance/store'
import type { AttendanceRecord } from '~/views/attendance/types'

const route = useRoute()
const attendanceStore = useAttendanceStore()

const employeeId = computed(() => Number(route.params.id))
const isLoading = computed(() => attendanceStore.isLoading)
const records = computed(() => attendanceStore.records)

const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
}

const formatTime = (timeString: string) => {
    if (!timeString) return '-'
    return new Date(timeString).toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
    })
}

const leavesData = computed(() => {
    return records.value.map((record: AttendanceRecord) => ({
        date: formatDate(record.attendanceDate),
        inTime: formatTime(record.checkInTime),
        outTime: formatTime(record.checkOutTime),
        status: record.isComplete ? 0 : record.isCheckedIn ? 2 : 1,
    }))
})

const tableHeader = [
    {
        key: 'date',
        label: 'التاريخ',
    },
    {
        key: 'inTime',
        label: 'وقت الدخول',
    },
    {
        key: 'outTime',
        label: 'وقت الخروج',
    },
    {
        key: 'status',
        label: 'الحالة',
    },
]

onMounted(async () => {
    if (employeeId.value) {
        attendanceStore.filters.employeeId = employeeId.value
        await attendanceStore.getRecords()
    }
})

onUnmounted(() => {
    attendanceStore.filters.employeeId = null
})
</script>

<template>
    <div class="">سجل الحضور و الانصراف</div>
    <AppTable title="سجل الحضور والانصراف" :headers="tableHeader" :items="leavesData" :is-loading="isLoading">
        <template #data-status="{ item }">
            <BaseTag :color="item.status === 0 ? 'success' : item.status === 2 ? 'warning' : 'danger'" variant="pastel">
                {{ item.status === 0 ? 'حضور' : item.status === 2 ? 'دخول فقط' : 'غير موجود' }}
            </BaseTag>
        </template>
    </AppTable>
</template>