<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'
import { Validator } from '~/services/validator'
import { usePayrollStore } from '../store'
import type { PayrollCalculationDto } from '../types'

const payrollStore = usePayrollStore()

const validator = new Validator<PayrollCalculationDto>(
  {
    batchId: 0,
    employeeIds: null,
    overtimeMultiplier: 1.5,
    lateDeductionFactor: 0.5,
    recalculateExisting: false,
  },
  {}
)

const body = validator.validation

const isLoading = computed(() => {
  return payrollStore.isLoading
})

const calculatePayrollBatch = async () => {
  if (!payrollStore.selectedBatch) return

  const calculationData = validator.extractBody()
  calculationData.batchId = payrollStore.selectedBatch.id

  await payrollStore.calculatePayrollBatch(payrollStore.selectedBatch.id, calculationData)
  payrollStore.isCalculateDialogOpen = false
}

watch(
  () => payrollStore.isCalculateDialogOpen,
  (val: boolean) => {
    if (val && payrollStore.selectedBatch) {
      validator.fillBody({
        batchId: payrollStore.selectedBatch.id,
        employeeIds: null,
        overtimeMultiplier: 1.5,
        lateDeductionFactor: 0.5,
        recalculateExisting: false,
      })
    }
  }
)
</script>

<template>
  <AppDialog
    v-model="payrollStore.isCalculateDialogOpen"
    title="حساب دفعة الراتب"
    size="xl"
    overflow-y="visible"
  >
    <div class="rounded-3xl p-3">
      <div class="flex flex-col gap-4">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-center gap-2 mb-2">
            <Icon name="ph:info-duotone" class="size-5 text-blue-600" />
            <h3 class="font-semibold text-blue-800">معلومات الحساب</h3>
          </div>
          <p class="text-blue-700 text-sm">
            سيتم حساب الرواتب بناءً على سجلات الحضور والغياب للفترة المحددة. 
            يمكنك تخصيص معاملات الحساب أدناه.
          </p>
        </div>


        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInputField
            v-model="body.overtimeMultiplier!.$model"
            :errors="body.overtimeMultiplier!.$errors"
            size="md"
            label="معامل الساعات الإضافية"
            type="number"
            step="0.1"
            :min="1.0"
            :max="3.0"
            placeholder="1.5"
          />
          <AppInputField
            v-model="body.lateDeductionFactor!.$model"
            :errors="body.lateDeductionFactor!.$errors"
            size="md"
            label="معامل خصم التأخير"
            type="number"
            step="0.1"
            :min="0.0"
            :max="1.0"
            placeholder="0.5"
          />
        </div>

        <div class="flex items-center gap-3">
          <BaseCheckbox
            v-model="body.recalculateExisting!.$model"
            color="primary"
          />
          <label class="text-sm font-medium text-gray-700">
            إعادة حساب الرواتب الموجودة
          </label>
        </div>

        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex items-center gap-2 mb-2">
            <Icon name="ph:warning-duotone" class="size-5 text-yellow-600" />
            <h3 class="font-semibold text-yellow-800">تنبيه</h3>
          </div>
          <p class="text-yellow-700 text-sm">
            عملية الحساب قد تستغرق عدة دقائق حسب عدد الموظفين. 
            تأكد من صحة البيانات قبل البدء.
          </p>
        </div>
      </div>
    </div>
    <template #actions>
      <BaseButton color="primary" class="gap-1" :loading="isLoading" @click="calculatePayrollBatch">
        <Icon name="ph:calculator-duotone" class="size-5" />
        بدء الحساب
      </BaseButton>
    </template>
  </AppDialog>
</template>
