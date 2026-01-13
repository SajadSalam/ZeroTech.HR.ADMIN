<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { useEmployeeBalanceStore } from '../store'
import { type CreateBalanceDto } from '../types'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { balanceTypes } from '..'

const balanceStore = useEmployeeBalanceStore()

const validator = new Validator<CreateBalanceDto>(
    {
        balanceType: '',
        allocatedBalance: 0,
        periodStartDate: '',
        periodEndDate: '',
        notes: '',
    },
    {
        balanceType: {
            required: requiredValidator('نوع الرصيد'),
        },
        allocatedBalance: {
            required: requiredValidator('الرصيد المخصص'),
        },
        periodStartDate: {
            required: requiredValidator('تاريخ بداية الفترة'),
        },
        periodEndDate: {
            required: requiredValidator('تاريخ نهاية الفترة'),
        },
    }
)

const body = validator.validation
const isLoading = computed(() => balanceStore.isLoading)

const createBalance = async () => {
    const isValid = await body.value.$validate()
    if (!isValid) return

    try {
        await balanceStore.createBalance(validator.extractBody())
        validator.resetBody()
        balanceStore.isCreateDialogOpen = false
    } catch (error) {
        console.error('Error creating balance:', error)
    }
}

watch(
    () => balanceStore.isCreateDialogOpen,
    (val: boolean) => {
        if (val) validator.resetBody()
    }
)
</script>

<template>
    <AppDialog
        v-model="balanceStore.isCreateDialogOpen"
        title="إنشاء رصيد جديد"
        size="xl"
        overflow-y="visible"
    >
        <div class="space-y-4">
            <AppAutoCompleteField
                v-model="body.balanceType.$model"
                label="نوع الرصيد"
                placeholder="أدخل نوع الرصيد"
                :items="balanceTypes"
                item-label="label"
                item-value="value"  
            />

            <AppInputField
                v-model.number="body.allocatedBalance.$model"
                label="الرصيد المخصص"
                type="number"
                placeholder="أدخل الرصيد المخصص"
                :error-message="
                    body.allocatedBalance.$errors
                        .map((e) => e.$message)
                        .join(', ')
                "
            />

            <AppInputField
                v-model="body.periodStartDate.$model"
                label="تاريخ بداية الفترة"
                type="date"
                :error-message="
                    body.periodStartDate.$errors
                        .map((e) => e.$message)
                        .join(', ')
                "
            />

            <AppInputField
                v-model="body.periodEndDate.$model"
                label="تاريخ نهاية الفترة"
                type="date"
                :error-message="
                    body.periodEndDate.$errors.map((e) => e.$message).join(', ')
                "
            />

            <AppTextAreaField
                v-model="body.notes.$model"
                label="ملاحظات"
                placeholder="أدخل ملاحظات"
                :error-message="
                    body.notes.$errors.map((e) => e.$message).join(', ')
                "
            />
        </div>

        <template #actions>
            <BaseButton
                color="primary"
                class="gap-1"
                :loading="isLoading"
                @click="createBalance"
            >
                <Icon name="ph:check-circle-duotone" class="size-5" />
                إنشاء
            </BaseButton>
        </template>
    </AppDialog>
</template>

