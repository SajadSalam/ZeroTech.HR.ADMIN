<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { useEmployeeBalanceStore } from '../store'
import type { DeductBalanceDto } from '../types'

const balanceStore = useEmployeeBalanceStore()

const validator = new Validator<DeductBalanceDto>(
    {
        amount: 0.01,
        reason: '',
        notes: '',
    },
    {
        amount: {
            required: requiredValidator('الرصيد'),
        },
        reason: {
            required: requiredValidator('السبب'),
        },
    }
)

const body = validator.validation
const isLoading = computed(() => balanceStore.isLoading)

const deductBalance = async () => {
    const isValid = await body.value.$validate()
    if (!isValid) return

    if (!balanceStore.selectedBalance) return

    try {
        await balanceStore.deductBalance(
            balanceStore.selectedBalance.balanceType,
            validator.extractBody()
        )
        validator.resetBody()
        balanceStore.isDeductDialogOpen = false
    } catch (error) {
        console.error('Error deducting balance:', error)
    }
}

watch(
    () => balanceStore.isDeductDialogOpen,
    (val: boolean) => {
        if (val) validator.resetBody()
    }
)
</script>

<template>
    <AppDialog
        v-model="balanceStore.isDeductDialogOpen"
        title="خصم من الرصيد"
        size="lg"
        overflow-y="visible"
    >
        <div v-if="balanceStore.selectedBalance" class="space-y-4">
            <div class="rounded-lg bg-gray-50 p-4">
                <div class="text-sm text-gray-600 mb-2">
                    نوع الرصيد: {{ balanceStore.selectedBalance.balanceType }}
                </div>
                <div class="text-sm text-gray-600">
                    الرصيد المتاح:
                    {{ balanceStore.selectedBalance.availableBalance }}
                </div>
            </div>

            <AppInputField
                v-model.number="body.amount.$model"
                        label="الرصيد"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="أدخل الرصيد المراد خصمه"
                :error-message="
                    body.amount.$errors.map((e) => e.$message).join(', ')
                "
            />

            <AppInputField
                v-model="body.reason.$model"
                label="السبب"
                placeholder="أدخل سبب الخصم"
                :error-message="
                    body.reason.$errors.map((e) => e.$message).join(', ')
                "
            />

            <AppTextAreaField
                v-model="body.notes.$model"
                label="ملاحظات"
                placeholder="أدخل ملاحظات إضافية"
                :error-message="
                    body.notes.$errors.map((e) => e.$message).join(', ')
                "
            />
        </div>

        <template #actions>
            <BaseButton
                color="danger"
                class="gap-1"
                :loading="isLoading"
                @click="deductBalance"
            >
                <Icon name="ph:minus-circle-duotone" class="size-5" />
                خصم
            </BaseButton>
        </template>
    </AppDialog>
</template>

