<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { usePayrollStore } from '../store'
import type { PayrollBatchCreateDto } from '../types'

const payrollStore = usePayrollStore()

const validator = new Validator<PayrollBatchCreateDto>(
  {
    title: '',
    periodStartDate: '',
    periodEndDate: '',
    notes: '',
  },
  {
    title: {
      required: requiredValidator('عنوان دفعة الراتب'),
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

const isLoading = computed(() => {
  return payrollStore.isLoading
})

const createPayrollBatch = async () => {
  const isValid = await body.value.$validate()

  if (!isValid) return
  
  // Validate that end date is after start date
  const startDate = new Date(body.value.periodStartDate.$model)
  const endDate = new Date(body.value.periodEndDate.$model)
  
  if (endDate <= startDate) {
    // You might want to add a proper validation error here
    return
  }

  await payrollStore.createPayrollBatch(validator.extractBody())
  validator.resetBody()
  payrollStore.isCreateDialogOpen = false
}

watch(
  () => payrollStore.isCreateDialogOpen,
  (val: boolean) => {
    if (val) {
      validator.resetBody()
    }
  }
)
</script>

<template>
  <AppDialog
    v-model="payrollStore.isCreateDialogOpen"
    title="إنشاء دفعة راتب جديدة"
    size="xl"
    overflow-y="visible"
  >
    <div class="rounded-3xl p-3">
      <div class="flex flex-col gap-4">
        <AppInputField
          v-model="body.title.$model"
          :errors="body.title.$errors"
          size="md"
          label="عنوان دفعة الراتب"
          placeholder="مثال: راتب أكتوبر 2025"
          required
        />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInputField
            v-model="body.periodStartDate.$model"
            :errors="body.periodStartDate.$errors"
            size="md"
            label="تاريخ بداية الفترة"
            type="date"
            required
          />
          <AppInputField
            v-model="body.periodEndDate.$model"
            :errors="body.periodEndDate.$errors"
            size="md"
            label="تاريخ نهاية الفترة"
            type="date"
            required
          />
        </div>
        
        <AppTextAreaField
          v-model="body.notes.$model"
          :errors="body.notes.$errors"
          size="md"
          label="ملاحظات"
          placeholder="ملاحظات إضافية حول دفعة الراتب"
          rows="3"
        />
      </div>
    </div>
    <template #actions>
      <BaseButton color="primary" class="gap-1" :loading="isLoading" @click="createPayrollBatch">
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        إنشاء دفعة راتب
      </BaseButton>
    </template>
  </AppDialog>
</template>
