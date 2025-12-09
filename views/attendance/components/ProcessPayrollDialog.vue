<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { useAttendanceStore } from '../store'

interface ProcessPayrollDto {
    payrollEndDate: string
    employeeIds: number[]
    processedAt: string
}

const attendanceStore = useAttendanceStore()

const props = defineProps<{
    modelValue: boolean
    employeeIds: number[]
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'done'): void
}>()

const isOpen = computed({
    get: () => props.modelValue,
    set: (value: boolean) => {
        emit('update:modelValue', value)
        if (!value) {
            validator.resetBody()
        }
    },
})

const validator = new Validator<ProcessPayrollDto>(
    {
        payrollEndDate: '',
        employeeIds: [],
        processedAt: '',
    },
    {
        payrollEndDate: {
            required: requiredValidator('تاريخ نهاية الرواتب'),
        },
        employeeIds: {
            required: (value: number[]) => {
                if (!value || value.length === 0) {
                    return 'يجب اختيار موظف واحد على الأقل'
                }
                return true
            },
        },
        processedAt: {
            required: requiredValidator('تاريخ المعالجة'),
        },
    }
)

const body = validator.validation
const isLoading = computed(() => attendanceStore.isLoading)

watch(() => props.modelValue, (val: boolean) => {
    if (val) {
        // Set default dates
        const now = new Date()
        body.value.processedAt.$model = now.toISOString().split('T')[0]
        body.value.payrollEndDate.$model = now.toISOString().split('T')[0]
        // Set employeeIds from props
        body.value.employeeIds.$model = props.employeeIds
    }
})

watch(() => props.employeeIds, (ids: number[]) => {
    if (isOpen.value) {
        body.value.employeeIds.$model = ids
    }
})

const processPayroll = async () => {
    const isValid = await body.value.$validate()
    if (!isValid) return

    try {
        await attendanceStore.processPayroll({
            payrollEndDate: new Date(body.value.payrollEndDate.$model).toISOString(),
            employeeIds: body.value.employeeIds.$model,
            processedAt: new Date(body.value.processedAt.$model).toISOString(),
        })
        validator.resetBody()
        isOpen.value = false
        emit('done')
    } catch (error) {
        console.error('Error processing payroll:', error)
    }
}
</script>

<template>
    <AppDialog
        v-model="isOpen"
        title="معالجة الحضور للرواتب"
        size="xl"
        overflow-y="visible"
    >
        <div class="space-y-4">
            <AppInputField
                v-model="body.payrollEndDate.$model"
                :errors="body.payrollEndDate.$errors"
                size="md"
                label="تاريخ نهاية الرواتب"
                type="date"
                required
            />

            <AppInputField
                v-model="body.processedAt.$model"
                :errors="body.processedAt.$errors"
                size="md"
                label="تاريخ المعالجة"
                type="date"
                required
            />

            <div class="p-4 bg-muted-100 dark:bg-muted-800 rounded-lg">
                <p class="text-sm text-muted-600 dark:text-muted-400 mb-2">
                    عدد الموظفين المحددين:
                </p>
                <p class="text-lg font-semibold text-muted-800 dark:text-white">
                    {{ employeeIds.length }}
                </p>
            </div>
        </div>

        <template #actions>
            <BaseButton color="gray" @click="isOpen = false">
                إلغاء
            </BaseButton>
            <BaseButton color="primary" class="gap-1" :loading="isLoading" @click="processPayroll">
                <Icon name="ph:check-duotone" class="size-5" />
                معالجة
            </BaseButton>
        </template>
    </AppDialog>
</template>

