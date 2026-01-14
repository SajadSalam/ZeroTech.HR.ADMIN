<script setup lang="ts">
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { useRequestTypeStore } from '../store'
import type { RequestTypeUpdateDto } from '../types'
import type { ApiError } from '~/utils/types/ApiResponses'

const requestTypeStore = useRequestTypeStore()

const selectedRequestType = computed(() => requestTypeStore.selectedRequestType)

const validator = new Validator<RequestTypeUpdateDto>(
  {
    id: selectedRequestType.value?.id as number,
    name: selectedRequestType.value?.name as string,
    description: selectedRequestType.value?.description as string,
    code: selectedRequestType.value?.code as string,
    categoryId: selectedRequestType.value?.categoryId as number,
    isEnabled: selectedRequestType.value?.isEnabled as boolean,
    requiresApproval: selectedRequestType.value?.requiresApproval as boolean,
    allowsAttachments: selectedRequestType.value?.allowsAttachments as boolean,
    requiresAttachments: selectedRequestType.value?.requiresAttachments as boolean,
    maxAdvanceDays: selectedRequestType.value?.maxAdvanceDays as number | null,
    minAdvanceDays: selectedRequestType.value?.minAdvanceDays as number | null,
    maxDurationDays: selectedRequestType.value?.maxDurationDays as number | null,
    minDurationHours: selectedRequestType.value?.minDurationHours as number | null,
    affectsAttendance: selectedRequestType.value?.affectsAttendance as boolean,
    affectsPayroll: selectedRequestType.value?.affectsPayroll as boolean,
    isPaidTime: selectedRequestType.value?.isPaidTime as boolean,
    validationRules: selectedRequestType.value?.validationRules as string,
    customFields: selectedRequestType.value?.customFields as string,
    notificationSettings: selectedRequestType.value?.notificationSettings as string,
    displayOrder: selectedRequestType.value?.displayOrder as number | null,
    colorCode: selectedRequestType.value?.colorCode as string,
    iconClass: selectedRequestType.value?.iconClass as string,
  },
  {
    name: {
      required: requiredValidator('اسم نوع الطلب'),
    },
    code: {
      required: requiredValidator('رمز نوع الطلب'),
    },
    categoryId: {
      required: requiredValidator('الفئة'),
    },
  }
)

const body = validator.validation

const isLoading = computed(() => {
  return requestTypeStore.isLoading
})

const updateRequestType = async () => {
  const isValid = await body.value.$validate()
  if (!isValid) return
  try {
    await requestTypeStore.updateRequestType(validator.extractBody())
  } catch (error) {
    useToast(
      {
        message: (error as ApiError).response?.data.title,
        isError: true
      }
    )
    validator.setExternalErrors((error as ApiError).response?.data?.errors ?? {})
  }
  validator.resetBody()
  requestTypeStore.isEditDialogOpen = false
}

watch(
  () => requestTypeStore.isEditDialogOpen,
  (value) => {
    if (!value) {
      validator.resetBody()
    } else {
      validator.fillBody({
        id: selectedRequestType.value?.id as number,
        name: selectedRequestType.value?.name as string,
        description: selectedRequestType.value?.description as string,
        code: selectedRequestType.value?.code as string,
        categoryId: selectedRequestType.value?.categoryId as number,
        isEnabled: selectedRequestType.value?.isEnabled as boolean,
        requiresApproval: selectedRequestType.value?.requiresApproval as boolean,
        allowsAttachments: selectedRequestType.value?.allowsAttachments as boolean,
        requiresAttachments: selectedRequestType.value?.requiresAttachments as boolean,
        maxAdvanceDays: selectedRequestType.value?.maxAdvanceDays as number | null,
        minAdvanceDays: selectedRequestType.value?.minAdvanceDays as number | null,
        maxDurationDays: selectedRequestType.value?.maxDurationDays as number | null,
        minDurationHours: selectedRequestType.value?.minDurationHours as number | null,
        affectsAttendance: selectedRequestType.value?.affectsAttendance as boolean,
        affectsPayroll: selectedRequestType.value?.affectsPayroll as boolean,
        isPaidTime: selectedRequestType.value?.isPaidTime as boolean,
        validationRules: selectedRequestType.value?.validationRules as string,
        customFields: selectedRequestType.value?.customFields as string,
        notificationSettings: selectedRequestType.value?.notificationSettings as string,
        displayOrder: selectedRequestType.value?.displayOrder as number | null,
        colorCode: selectedRequestType.value?.colorCode as string,
        iconClass: selectedRequestType.value?.iconClass as string,
      })
    }
  }
)
</script>

<template>
  <AppDialog
    v-model="requestTypeStore.isEditDialogOpen"
    title="تعديل نوع الطلب"
    size="xl"
    overflow-y="visible"
  >
    <div class="rounded-3xl p-3">
      <div class="flex flex-col gap-4">
        <!-- Basic Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInputField
            v-model="body.name.$model"
            :errors="body.name.$errors"
            size="md"
            label="اسم نوع الطلب"
            required
          />
          <AppInputField
            v-model="body.code.$model"
            :errors="body.code.$errors"
            size="md"
            label="رمز نوع الطلب"
            required
          />
        </div>
        
        <AppTextAreaField
          v-model="body.description.$model"
          :errors="body.description.$errors"
          size="md"
          label="الوصف"
          rows="3"
        />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppAutoCompleteField
            v-model="body.categoryId.$model"
            fetch-on-search
            search-key="name"
            :errors="body.categoryId.$errors"
            size="md"
            label="الفئة"
            get-url="/RequestCategory/enabled"
            item-label="name"
            item-value="id"
            required
          />
          <AppInputField
            v-model="body.displayOrder.$model"
            :errors="body.displayOrder.$errors"
            size="md"
            label="ترتيب العرض"
            type="number"
            min="1"
          />
        </div>

        <!-- Settings -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BaseCheckbox
            v-model="body.isEnabled.$model"
            label="مفعل"
          />
          <BaseCheckbox
            v-model="body.requiresApproval.$model"
            label="يتطلب موافقة"
          />
          <BaseCheckbox
            v-model="body.allowsAttachments.$model"
            label="يسمح بالمرفقات"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BaseCheckbox
            v-model="body.requiresAttachments.$model"
            label="يتطلب مرفقات"
          />
          <BaseCheckbox
            v-model="body.affectsAttendance.$model"
            label="يؤثر على الحضور"
          />
          <BaseCheckbox
            v-model="body.affectsPayroll.$model"
            label="يؤثر على الراتب"
          />
        </div>

        <BaseCheckbox
          v-model="body.isPaidTime.$model"
          label="وقت مدفوع"
        />

        <!-- Duration Settings -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInputField
            v-model="body.maxAdvanceDays.$model"
            :errors="body.maxAdvanceDays.$errors"
            size="md"
            label="أقصى عدد أيام مسبقة"
            type="number"
            min="0"
          />
          <AppInputField
            v-model="body.minAdvanceDays.$model"
            :errors="body.minAdvanceDays.$errors"
            size="md"
            label="أقل عدد أيام مسبقة"
            type="number"
            min="0"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInputField
            v-model="body.maxDurationDays.$model"
            :errors="body.maxDurationDays.$errors"
            size="md"
            label="أقصى مدة بالأيام"
            type="number"
            min="1"
          />
          <AppInputField
            v-model="body.minDurationHours.$model"
            :errors="body.minDurationHours.$errors"
            size="md"
            label="أقل مدة بالساعات"
            type="number"
            step="0.5"
            min="0.5"
          />
        </div>

        <!-- Visual Settings -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInputField
            v-model="body.colorCode.$model"
            :errors="body.colorCode.$errors"
            size="md"
            label="رمز اللون"
            type="color"
          />
          <AppInputField
            v-model="body.iconClass.$model"
            :errors="body.iconClass.$errors"
            size="md"
            label="فئة الأيقونة"
            placeholder="fas fa-calendar-alt"
          />
        </div>

        <!-- JSON Fields -->
        <AppTextAreaField
          v-model="body.validationRules.$model"
          :errors="body.validationRules.$errors"
          size="md"
          label="قواعد التحقق (JSON)"
          rows="3"
          placeholder='{"maxConsecutiveDays": 14}'
        />

        <AppTextAreaField
          v-model="body.customFields.$model"
          :errors="body.customFields.$errors"
          size="md"
          label="الحقول المخصصة (JSON)"
          rows="3"
          placeholder='[{"name":"reason","type":"text","required":true}]'
        />

        <AppTextAreaField
          v-model="body.notificationSettings.$model"
          :errors="body.notificationSettings.$errors"
          size="md"
          label="إعدادات الإشعارات (JSON)"
          rows="3"
          placeholder='{"notifyManager": true, "notifyHR": false}'
        />
      </div>
    </div>
    <template #actions>
      <BaseButton color="primary" class="gap-1" :loading="isLoading" @click="updateRequestType">
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        حفظ التغييرات
      </BaseButton>
    </template>
  </AppDialog>
</template>
