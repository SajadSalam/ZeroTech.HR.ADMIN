<script setup lang="ts">
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import AppTable from '~/components/app-table/AppTable.vue'
import { tableHeader } from '~/views/attendance'
import { useAttendanceStore } from '~/views/attendance/store'
import type { AttendanceRecord, AttendanceFilters } from '~/views/attendance/types'
import EmployeeStatusDialog from '~/views/attendance/components/EmployeeStatusDialog.vue'
import ProcessPayrollDialog from '~/views/attendance/components/ProcessPayrollDialog.vue'

definePageMeta({
    title: 'سجلات الحضور',
    description: 'إدارة وعرض سجلات الحضور والانصراف',
})

const attendanceStore = useAttendanceStore()
const appTableStore = useAppTableStore()

const isLoading = computed(() => attendanceStore.isLoading)
const records = computed(() => attendanceStore.records || [])
const statistics = computed(() => attendanceStore.statistics)
const filters = computed<AttendanceFilters>({
    get() {
        return attendanceStore.filters
    },
    set(value: AttendanceFilters) {
        attendanceStore.filters = value
    },
})

const getRecords = async () => {
    appTableStore.setLoading(true)
    await attendanceStore.getRecords()
    appTableStore.setLoading(false)
}

const getStatistics = async () => {
    await attendanceStore.getStatistics()
}

const loadData = async () => {
    await Promise.all([getRecords(), getStatistics()])
}

const handleExportRecordsCSV = async () => {
    try {
        await attendanceStore.exportRecordsCSV()
    } catch (error) {
        console.error('Error exporting records CSV:', error)
    }
}

const handleExportSummaryCSV = async () => {
    try {
        await attendanceStore.exportSummaryCSV()
    } catch (error) {
        console.error('Error exporting summary CSV:', error)
    }
}

const handleExportMonthlyPayroll = async () => {
    try {
        await attendanceStore.exportMonthlyPayroll()
    } catch (error) {
        console.error('Error exporting monthly payroll:', error)
    }
}

const handleExportRecordsExcel = async () => {
    try {
        await attendanceStore.exportRecordsExcel()
    } catch (error) {
        console.error('Error exporting records Excel:', error)
    }
}

const viewEmployeeStatus = (record: AttendanceRecord) => {
    attendanceStore.getEmployeeStatus(record.employeeId)
}

const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US')
}

const formatTime = (timeString: string) => {
    if (!timeString) return '-'
    return new Date(timeString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    })
}

const statisticsConfig = [
    {
        key: 'daysPresent',
        label: 'أيام الحضور',
        icon: 'ph:calendar-check-duotone',
        color: 'primary',
    },
    {
        key: 'daysAbsent',
        label: 'أيام الغياب',
        icon: 'ph:calendar-x-duotone',
        color: 'danger',
    },
    {
        key: 'totalWorkDays',
        label: 'إجمالي أيام العمل',
        icon: 'ph:calendar-blank-duotone',
        color: 'info',
    },
    {
        key: 'attendancePercentage',
        label: 'نسبة الحضور',
        icon: 'ph:percent-duotone',
        color: 'warning',
        formatter: (value: number) => `${value?.toFixed(1) || 0}%`,
    },
    {
        key: 'totalHoursWorked',
        label: 'إجمالي ساعات العمل',
        icon: 'ph:clock-duotone',
        color: 'success',
        formatter: (value: number) => value?.toFixed(2) || 0,
    },
    {
        key: 'totalOvertimeHours',
        label: 'ساعات إضافية',
        icon: 'ph:clock-clockwise-duotone',
        color: 'purple',
        formatter: (value: number) => value?.toFixed(2) || 0,
    },
    {
        key: 'averageHoursPerDay',
        label: 'متوسط الساعات اليومية',
        icon: 'ph:clock-countdown-duotone',
        color: 'teal',
        formatter: (value: number) => value?.toFixed(2) || 0,
    },
    {
        key: 'lateCount',
        label: 'عدد التأخيرات',
        icon: 'ph:clock-afternoon-duotone',
        color: 'orange',
    },
    {
        key: 'earlyDepartureCount',
        label: 'عدد الخروج المبكر',
        icon: 'ph:clock-arrow-up-duotone',
        color: 'rose',
    },
]

const getStatValue = (stat: typeof statisticsConfig[0]) => {
    const value = statistics.value?.[stat.key as keyof typeof statistics.value] as number
    if (stat.formatter) {
        return stat.formatter(value)
    }
    return value || 0
}

const getStatIconClass = (color: string) => {
    const colorMap: Record<string, string> = {
        primary: 'text-primary-500',
        danger: 'text-danger-500',
        info: 'text-info-500',
        warning: 'text-warning-500',
        success: 'text-success-500',
        purple: 'text-purple-500',
        teal: 'text-teal-500',
        orange: 'text-orange-500',
        rose: 'text-rose-500',
    }
    return colorMap[color] || 'text-primary-500'
}

const getStatBgClass = (color: string) => {
    const colorMap: Record<string, string> = {
        primary: 'bg-primary-500/10',
        danger: 'bg-danger-500/10',
        info: 'bg-info-500/10',
        warning: 'bg-warning-500/10',
        success: 'bg-success-500/10',
        purple: 'bg-purple-500/10',
        teal: 'bg-teal-500/10',
        orange: 'bg-orange-500/10',
        rose: 'bg-rose-500/10',
    }
    return colorMap[color] || 'bg-primary-500/10'
}
const selectedItemsID = ref<string[]>([])
const isProcessPayrollDialogOpen = ref(false)

const selectedEmployeeIds = computed(() => {
    const selectedIds = new Set<number>()
    records.value.forEach((record: AttendanceRecord) => {
        if (selectedItemsID.value.includes(record.id.toString())) {
            selectedIds.add(record.employeeId)
        }
    })
    return Array.from(selectedIds)
})

const handleProcessPayroll = () => {
    isProcessPayrollDialogOpen.value = true
}

const handlePayrollProcessed = () => {
    getRecords()
}

// Initialize data
loadData()
watch(filters, () => { loadData() }, { deep: true })

</script>

<template>
    <div>
        <!-- Statistics Cards -->
        <div v-if="statistics" class="mb-6">
            <!-- Employee Info Card -->
            <BaseCard class="p-4 mb-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="bg-info-500/10 rounded-full p-3">
                            <Icon name="ph:user-duotone" class="size-6 text-info-500" />
                        </div>
                        <div>
                            <p class="text-sm text-muted-500 dark:text-muted-400">الموظف</p>
                            <p class="text-lg font-semibold text-muted-800 dark:text-white">
                                {{ statistics.employeeName }}
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div>
                            <p class="text-sm text-muted-500 dark:text-muted-400">من تاريخ</p>
                            <p class="text-sm font-medium text-muted-800 dark:text-white">
                                {{ formatDate(statistics.startDate) }}
                            </p>
                        </div>
                        <div>
                            <p class="text-sm text-muted-500 dark:text-muted-400">إلى تاريخ</p>
                            <p class="text-sm font-medium text-muted-800 dark:text-white">
                                {{ formatDate(statistics.endDate) }}
                            </p>
                        </div>
                    </div>
                </div>
            </BaseCard>

            <!-- Statistics Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <BaseCard v-for="stat in statisticsConfig" :key="stat.key" class="p-4">
                    <div class="flex items-center gap-3">
                        <div :class="`${getStatBgClass(stat.color)} rounded-full p-3`">
                            <Icon :name="stat.icon" :class="`size-6 ${getStatIconClass(stat.color)}`" />
                        </div>
                        <div>
                            <p class="text-sm text-muted-500 dark:text-muted-400">{{ stat.label }}</p>
                            <p class="text-xl font-semibold text-muted-800 dark:text-white">
                                {{ getStatValue(stat) }}
                            </p>
                        </div>
                    </div>
                </BaseCard>
            </div>
        </div>

        <AppCrud hide-create title="سجلات الحضور">
            <template #filters>
                <BaseInput v-model="filters.startDate" type="date" placeholder="من تاريخ" required />
                <BaseInput v-model="filters.endDate" type="date" placeholder="إلى تاريخ" required />
                <AppAutoCompleteField v-model="filters.employeeId" get-url="/Employee" item-label="name" item-value="id"
                    placeholder="الموظف" required />
            </template>

            <template #headerActions>
                <BaseButton color="success" variant="outline" class="gap-2" :loading="isLoading"
                    @click="handleExportRecordsCSV">
                    <Icon name="ph:file-csv-duotone" class="size-5" />
                    تصدير CSV
                </BaseButton>
                <BaseButton color="info" variant="outline" class="gap-2" :loading="isLoading"
                    @click="handleExportSummaryCSV">
                    <Icon name="ph:file-csv-duotone" class="size-5" />
                    تصدير الملخص CSV
                </BaseButton>
                <BaseButton color="warning" variant="outline" class="gap-2" :loading="isLoading"
                    @click="handleExportMonthlyPayroll">
                    <Icon name="ph:currency-circle-dollar-duotone" class="size-5" />
                    تصدير الرواتب الشهرية
                </BaseButton>
                <BaseButton color="primary" variant="outline" class="gap-2" :loading="isLoading"
                    @click="handleExportRecordsExcel">
                    <Icon name="ph:file-x-duotone" class="size-5" />
                    تصدير Excel
                </BaseButton>
            </template>

            <AppTable v-model:selected-items-id="selectedItemsID" title="قائمة سجلات الحضور"
                :headers="tableHeader()" :items="records" :is-loading="isLoading">
                <template #data-attendanceDate="{ item }">
                    {{ formatDate(item.attendanceDate) }}
                </template>

                <template #data-checkInTime="{ item }">
                    {{ formatTime(item.checkInTime) }}
                </template>

                <template #data-checkOutTime="{ item }">
                    {{ formatTime(item.checkOutTime) }}
                </template>

                <template #data-hoursWorked="{ item }">
                    {{ item.hoursWorked?.toFixed(2) || 0 }} ساعة
                </template>

                <template #data-overtimeHours="{ item }">
                    {{ item.overtimeHours?.toFixed(2) || 0 }} ساعة
                </template>

                <template #data-isLateCheckIn="{ item }">
                    <BaseTag :color="item.isLateCheckIn ? 'danger' : 'success'" variant="pastel" size="sm">
                        {{ item.isLateCheckIn ? 'نعم' : 'لا' }}
                    </BaseTag>
                </template>

                <template #data-isEarlyCheckOut="{ item }">
                    <BaseTag :color="item.isEarlyCheckOut ? 'danger' : 'success'" variant="pastel" size="sm">
                        {{ item.isEarlyCheckOut ? 'نعم' : 'لا' }}
                    </BaseTag>
                </template>

                <template #data-actions="{ item }">
                    <BaseButton size="sm" variant="outline" color="info" class="gap-1"
                        @click="viewEmployeeStatus(item)">
                        <Icon name="ph:info-duotone" class="size-4" />
                        الحالة
                    </BaseButton>
                </template>
            </AppTable>
        </AppCrud>

        <EmployeeStatusDialog />
        <ProcessPayrollDialog v-model="isProcessPayrollDialogOpen" :employee-ids="selectedEmployeeIds"
            @done="handlePayrollProcessed" />
    </div>
</template>
