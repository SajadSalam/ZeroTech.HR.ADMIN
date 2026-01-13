<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { useEmployeeBalanceStore } from '../store'
import type { AddBalanceDto } from '../types'

const balanceStore = useEmployeeBalanceStore()

const validator = new Validator<AddBalanceDto>(
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

const addBalance = async () => {
    const isValid = await body.value.$validate()
    if (!isValid) return

    if (!balanceStore.selectedBalance) return

    try {
        await balanceStore.addBalance(
            balanceStore.selectedBalance.balanceType,
            validator.extractBody()
        )
        validator.resetBody()
        balanceStore.isAddDialogOpen = false
    } catch (error) {
        console.error('Error adding balance:', error)
    }
}

watch(
    () => balanceStore.isAddDialogOpen,
    (val: boolean) => {
        if (val) validator.resetBody()
    }
)
</script>

<template>
    <AppDialog
        v-model="balanceStore.isAddDialogOpen"
        title="إضافة إلى الرصيد"
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
                placeholder="أدخل الرصيد المراد إضافته"
                :error-message="
                    body.amount.$errors.map((e) => e.$message).join(', ')
                "
            />

            <AppInputField
                v-model="body.reason.$model"
                label="السبب"
                placeholder="أدخل سبب الإضافة"
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
                color="success"
                class="gap-1"
                :loading="isLoading"
                @click="addBalance"
            >
                <Icon name="ph:plus-circle-duotone" class="size-5" />
                إضافة
            </BaseButton>
        </template>
    </AppDialog>
</template>

