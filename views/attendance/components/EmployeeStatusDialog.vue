<script setup lang="ts">
import { computed } from 'vue'
import { useAttendanceStore } from '../store'
import type { EmployeeAttendanceOverview } from '../types'

const attendanceStore = useAttendanceStore()

const status = computed(() => attendanceStore.employeeStatus)
const isLoading = computed(() => attendanceStore.isLoading)
const isOpen = computed({
    get: () => attendanceStore.isStatusDialogOpen,
    set: (value: boolean) => {
        if (!value) {
            attendanceStore.isStatusDialogOpen = false
            attendanceStore.employeeStatus = null
            attendanceStore.selectedEmployeeId = null
        }
    },
})

const formatTime = (timeString: string) => {
    if (!timeString) return '-'
    return new Date(timeString).toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
    })
}

const formatTimeSpan = (timeSpan: any) => {
    if (!timeSpan) return '-'
    const hours = Math.floor(timeSpan.totalHours || 0)
    const minutes = Math.floor((timeSpan.totalMinutes || 0) % 60)
    return `${hours}:${minutes.toString().padStart(2, '0')}`
}
</script>

<template>
    <AppDialog v-model="isOpen" title="حالة الموظف" size="xl" overflow-y="auto">
        <div v-if="status && !isLoading" class="space-y-4">
            <!-- Employee Info Card -->
            <BaseCard class="p-4">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
                        معلومات الموظف
                    </h3>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm text-muted-500 dark:text-muted-400">اسم الموظف</p>
                        <p class="font-medium text-muted-800 dark:text-white">{{ status.employeeName }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-muted-500 dark:text-muted-400">رقم الموظف</p>
                        <p class="font-medium text-muted-800 dark:text-white">{{ status.employeeId }}</p>
                    </div>
                </div>
            </BaseCard>

            <!-- Status Card -->
            <BaseCard class="p-4">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
                        الحالة الحالية
                    </h3>
                    <BaseTag :color="status.status === 1 ? 'success' : status.status === 2 ? 'warning' : 'muted'"
                        variant="pastel" size="sm">
                        {{ status.statusDescription }}
                    </BaseTag>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm text-muted-500 dark:text-muted-400">آخر وقت دخول</p>
                        <p class="font-medium text-muted-800 dark:text-white">
                            {{ formatTime(status.lastCheckInTime) }}
                        </p>
                    </div>
                    <div>
                        <p class="text-sm text-muted-500 dark:text-muted-400">وقت العمل الحالي</p>
                        <p class="font-medium text-muted-800 dark:text-white">
                            {{ formatTimeSpan(status.currentWorkingTime) }}
                        </p>
                    </div>
                </div>
            </BaseCard>

            <!-- Actions Card -->
            <BaseCard class="p-4">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
                        الإجراءات المتاحة
                    </h3>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm text-muted-500 dark:text-muted-400">يمكن الدخول</p>
                        <BaseTag :color="status.canCheckIn ? 'success' : 'muted'" variant="pastel" size="sm">
                            {{ status.canCheckIn ? 'نعم' : 'لا' }}
                        </BaseTag>
                    </div>
                    <div>
                        <p class="text-sm text-muted-500 dark:text-muted-400">يمكن الخروج</p>
                        <BaseTag :color="status.canCheckOut ? 'success' : 'muted'" variant="pastel" size="sm">
                            {{ status.canCheckOut ? 'نعم' : 'لا' }}
                        </BaseTag>
                    </div>
                </div>
            </BaseCard>

            <!-- Active Attendance Card -->
            <BaseCard v-if="status.activeAttendance" class="p-4">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
                        سجل الحضور النشط
                    </h3>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm text-muted-500 dark:text-muted-400">تاريخ الحضور</p>
                        <p class="font-medium text-muted-800 dark:text-white">
                            {{ new Date(status.activeAttendance.attendanceDate).toLocaleDateString('ar-SA') }}
                        </p>
                    </div>
                    <div>
                        <p class="text-sm text-muted-500 dark:text-muted-400">وقت الدخول</p>
                        <p class="font-medium text-muted-800 dark:text-white">
                            {{ formatTime(status.activeAttendance.checkInTime) }}
                        </p>
                    </div>
                    <div v-if="status.activeAttendance.checkOutTime">
                        <p class="text-sm text-muted-500 dark:text-muted-400">وقت الخروج</p>
                        <p class="font-medium text-muted-800 dark:text-white">
                            {{ formatTime(status.activeAttendance.checkOutTime) }}
                        </p>
                    </div>
                    <div>
                        <p class="text-sm text-muted-500 dark:text-muted-400">ساعات العمل</p>
                        <p class="font-medium text-muted-800 dark:text-white">
                            {{ status.activeAttendance.hoursWorked || 0 }} ساعة
                        </p>
                    </div>
                </div>
            </BaseCard>
        </div>

        <div v-else-if="isLoading" class="flex items-center justify-center py-12">
            <AppLoading />
        </div>

        <template #actions>
            <BaseButton color="gray" @click="isOpen = false">
                إغلاق
            </BaseButton>
        </template>
    </AppDialog>
</template>
