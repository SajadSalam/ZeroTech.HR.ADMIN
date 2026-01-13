<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAttendanceStore } from '../store'

const attendanceStore = useAttendanceStore()

const isLoading = computed(() => attendanceStore.isLoading)
const isOpen = computed({
    get: () => attendanceStore.isManualAttendanceDialogOpen,
    set: (value: boolean) => {
        if (!value) {
            attendanceStore.isManualAttendanceDialogOpen = false
            resetForm()
        }
    },
})

// Form state
const attendanceType = ref<'checkIn' | 'checkOut'>('checkIn')
const employeeId = ref<number | null>(null)
const dateTime = ref('')
const notes = ref('')

// Initialize dateTime with current date/time
const initializeDateTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    dateTime.value = `${year}-${month}-${day}T${hours}:${minutes}`
}

// Reset form
const resetForm = () => {
    attendanceType.value = 'checkIn'
    employeeId.value = null
    notes.value = ''
    initializeDateTime()
}

// Initialize dateTime on mount and when dialog opens
watch(isOpen, (newValue) => {
    if (newValue) {
        initializeDateTime()
    }
})

// Handle form submission
const handleSubmit = async () => {
    if (!employeeId.value || !dateTime.value) {
        return
    }

    try {
        const data = {
            employeeId: employeeId.value,
            notes: notes.value || undefined,
        }

        if (attendanceType.value === 'checkIn') {
            await attendanceStore.checkIn({
                ...data,
                checkInTime: new Date(dateTime.value).toISOString(),
            })
        } else {
            await attendanceStore.checkOut({
                ...data,
                checkOutTime: new Date(dateTime.value).toISOString(),
            })
        }

        isOpen.value = false
    } catch (error) {
        console.error('Error submitting manual attendance:', error)
    }
}

// Initialize on mount
initializeDateTime()
</script>

<template>
    <AppDialog v-model="isOpen" title="تسجيل حضور يدوياً" size="md">
        <div class="space-y-4">
            <!-- Attendance Type Selection -->
            <div>
                <label class="block text-sm font-medium text-muted-700 dark:text-muted-300 mb-2">
                    نوع التسجيل
                </label>
                <div class="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        :class="[
                            'flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all',
                            attendanceType === 'checkIn'
                                ? 'border-success-500 bg-success-500/10 text-success-600 dark:text-success-400'
                                : 'border-muted-300 dark:border-muted-700 text-muted-600 dark:text-muted-400 hover:border-muted-400 dark:hover:border-muted-600',
                        ]"
                        @click="attendanceType = 'checkIn'"
                    >
                        <Icon name="ph:sign-in-duotone" class="size-5" />
                        <span class="font-medium">تسجيل دخول</span>
                    </button>
                    <button
                        type="button"
                        :class="[
                            'flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all',
                            attendanceType === 'checkOut'
                                ? 'border-warning-500 bg-warning-500/10 text-warning-600 dark:text-warning-400'
                                : 'border-muted-300 dark:border-muted-700 text-muted-600 dark:text-muted-400 hover:border-muted-400 dark:hover:border-muted-600',
                        ]"
                        @click="attendanceType = 'checkOut'"
                    >
                        <Icon name="ph:sign-out-duotone" class="size-5" />
                        <span class="font-medium">تسجيل خروج</span>
                    </button>
                </div>
            </div>

            <!-- Employee Selection -->
            <div>
                <label class="block text-sm font-medium text-muted-700 dark:text-muted-300 mb-2">
                    الموظف <span class="text-danger-500">*</span>
                </label>
                <AppFieldAppAutoCompleteField
                    v-model="employeeId"
                    get-url="/Employee"
                    item-label="fullName"
                    item-subtitle="employeeNumber"
                    search-key="searchTerm"
                    fetch-on-search
                    item-value="id"
                    placeholder="اختر الموظف"
                    required
                />
            </div>

            <!-- Date and Time -->
            <div>
                <label class="block text-sm font-medium text-muted-700 dark:text-muted-300 mb-2">
                    {{ attendanceType === 'checkIn' ? 'وقت الدخول' : 'وقت الخروج' }}
                    <span class="text-danger-500">*</span>
                </label>
                <BaseInput
                    v-model="dateTime"
                    type="datetime-local"
                    required
                />
            </div>

            <!-- Notes -->
            <div>
                <label class="block text-sm font-medium text-muted-700 dark:text-muted-300 mb-2">
                    ملاحظات (اختياري)
                </label>
                <BaseTextarea
                    v-model="notes"
                    placeholder="أضف ملاحظات إضافية..."
                    rows="3"
                />
            </div>
        </div>

        <template #actions>
            <BaseButton color="gray" variant="outline" @click="isOpen = false">
                إلغاء
            </BaseButton>
            <BaseButton
                color="primary"
                :loading="isLoading"
                :disabled="!employeeId || !dateTime"
                @click="handleSubmit"
            >
                <Icon
                    :name="attendanceType === 'checkIn' ? 'ph:sign-in-duotone' : 'ph:sign-out-duotone'"
                    class="size-5"
                />
                {{ attendanceType === 'checkIn' ? 'تسجيل دخول' : 'تسجيل خروج' }}
            </BaseButton>
        </template>
    </AppDialog>
</template>
