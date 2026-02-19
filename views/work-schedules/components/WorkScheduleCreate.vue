<script setup lang="ts">
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { useWorkScheduleStore } from '../store'
import type { LateAttendanceRule, Shift, WorkScheduleCreateDto } from '../types'
import ShiftForm from './ShiftForm.vue'
import type { ApiError } from '~/utils/types/ApiResponses'

const workScheduleStore = useWorkScheduleStore()

const defaultShift: Shift = {
  name: 'الشفت الأساسية',
  startTime: '09:00',
  endTime: '17:00',
  workingDays: 62, // Monday to Friday
  breakDurationMinutes: 60,
}

const validator = new Validator<WorkScheduleCreateDto>(
  {
    name: '',
    description: '',
    isFlexible: false,
    flexibleHoursRequired: null,
    isGeneralTemplate: true,
    specificUserId: null,
    shifts: [{ ...defaultShift }],
    lateAttendanceRules: [],
  },
  {
    name: {
      required: requiredValidator('اسم جدول العمل مطلوب'),
    },
    shifts: {
      required: requiredValidator('يجب إضافة شفت واحدة على الأقل'),
    },
    flexibleHoursRequired: {
      required: (value: any, data: any) => {
        if (data.isFlexible && (!value || value <= 0)) {
          return 'عدد الساعات المرنة مطلوب عند تفعيل النظام المرن'
        }
        return true
      },
    },
  }
)

const body = validator.validation
const isLoading = computed(() => workScheduleStore.isLoading)

// Watch for flexibility changes
watch(() => body.value.isFlexible.$model, (isFlexible) => {
  if (!isFlexible) {
    body.value.flexibleHoursRequired.$model = null
  }
})

const addShift = () => {
  const newShift: Shift = {
    name: `الشفت ${body.value.shifts.$model.length + 1}`,
    startTime: '09:00',
    endTime: '17:00',
    workingDays: 62,
    breakDurationMinutes: 60,
  }
  body.value.shifts.$model.push(newShift)
}

const removeShift = (index: number) => {
  if (body.value.shifts.$model.length > 1) {
    body.value.shifts.$model.splice(index, 1)
  }
}

const updateShift = (index: number, shift: Shift) => {
  body.value.shifts.$model[index] = shift
}

const addLateAttendanceRule = () => {
  const newRule: LateAttendanceRule = {
    lateMinutesThreshold: 0,
    deductionAmount: 0,
  }
  body.value.lateAttendanceRules.$model.push(newRule)
}

const removeLateAttendanceRule = (index: number) => {
  body.value.lateAttendanceRules.$model.splice(index, 1)
}

const updateLateAttendanceRule = (index: number, field: keyof LateAttendanceRule, value: number) => {
  body.value.lateAttendanceRules.$model[index][field] = value
}

const createWorkSchedule = async () => {
  const isValid = await body.value.$validate()
  if (!isValid) return

  try {
    const bodyData = validator.extractBody()
    // Ensure boolean values are properly set
    bodyData.isFlexible = body.value.isFlexible.$model === true
    bodyData.isGeneralTemplate = body.value.isGeneralTemplate.$model === true
    await workScheduleStore.createWorkSchedule(bodyData)
    validator.resetBody()
    workScheduleStore.isCreateDialogOpen = false
  } catch (error) {
    useToast(
      {
        message: (error as ApiError).response?.data.title,
        isError: true
      }
    )
    validator.setExternalErrors((error as ApiError).response?.data?.errors ?? {})
    console.error('Error creating work schedule:', error)
  }
}

const validateSchedule = async () => {
  try {
    const bodyData = validator.extractBody()
    // Ensure boolean values are properly set
    bodyData.isFlexible = body.value.isFlexible.$model === true
    bodyData.isGeneralTemplate = body.value.isGeneralTemplate.$model === true
    
    const result = await workScheduleStore.validateWorkSchedule(bodyData)
    console.log('Validation result:', result)
    // You can show validation results to user here
  } catch (error) {
    console.error('Validation error:', error)
  }
}

watch(() => workScheduleStore.isCreateDialogOpen, (val: boolean) => {
  if (val) {
    validator.resetBody()
    // Reset to default values
    body.value.shifts.$model = [{ ...defaultShift }]
    body.value.lateAttendanceRules.$model = []
  }
})
</script>

<template>
  <AppDialog
    v-model="workScheduleStore.isCreateDialogOpen"
    title="إنشاء جدول عمل جديد"
    size="3xl"
    overflow-y="visible"
  >
    <div class="space-y-6">
      <!-- Basic Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-muted-800 dark:text-muted-200">
          المعلومات الأساسية
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInputField
            v-model="body.name.$model"
            label="اسم جدول العمل"
            placeholder="مثال: دوام المكتب الرسمي"
            :errors="body.name.$errors"
            required
          />
        </div>

        <AppTextAreaField
          v-model="body.description.$model"
          label="الوصف"
          placeholder="وصف جدول العمل..."
          :errors="body.description.$errors"
        />

        <!-- Flexibility Settings -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <BaseCheckbox
              v-model="body.isFlexible.$model"
              label="جدول عمل مرن"
            />
          </div>

          <div v-if="body.isFlexible.$model">
            <AppInputField
              v-model="body.flexibleHoursRequired.$model"
              label="عدد الساعات المطلوبة أسبوعياً"
              placeholder="40"
              type="number"
              :min="0.1"
              :max="168"
              :errors="body.flexibleHoursRequired.$errors"
              required
            />
          </div>
        </div>
      </div>

      <!-- Shifts Section -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-muted-800 dark:text-muted-200">
            الشفتات
          </h3>
          <BaseButton
            size="sm"
            color="primary"
            variant="pastel"
            @click="addShift"
          >
            <Icon name="ph:plus" class="size-4" />
            إضافة شفت
          </BaseButton>
        </div>

        <div class="space-y-4">
          <ShiftForm
            v-for="(shift, index) in body.shifts.$model"
            :key="index"
            :model-value="shift"
            :index="index"
            :show-remove-button="body.shifts.$model.length > 1"
            @update:model-value="(updatedShift) => updateShift(index, updatedShift)"
            @remove="removeShift(index)"
          />
        </div>

        <div v-if="body.shifts.$errors.length" class="text-sm text-red-500">
          {{ body.shifts.$errors.map(e => e.$message).join(', ') }}
        </div>
      </div>

      <!-- Late Attendance Rules Section -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-muted-800 dark:text-muted-200">
            قواعد التأخير
          </h3>
          <BaseButton
            size="sm"
            color="primary"
            variant="pastel"
            @click="addLateAttendanceRule"
          >
            <Icon name="ph:plus" class="size-4" />
            إضافة قاعدة
          </BaseButton>
        </div>

        <div v-if="body.lateAttendanceRules.$model.length === 0" class="text-sm text-muted-500 dark:text-muted-400">
          لا توجد قواعد تأخير. يمكنك إضافة قواعد لخصم المبالغ حسب دقائق التأخير.
        </div>

        <div class="space-y-3">
          <div
            v-for="(rule, index) in body.lateAttendanceRules.$model"
            :key="index"
            class="flex items-end gap-4 p-4 bg-muted-50 dark:bg-muted-800/50 rounded-lg"
          >
            <div class="flex-1">
              <AppInputField
                :model-value="rule.lateMinutesThreshold"
                label="حد دقائق التأخير"
                placeholder="مثال: 1440"
                type="number"
                :min="0"
                @update:model-value="updateLateAttendanceRule(index, 'lateMinutesThreshold', Number($event))"
              />
            </div>
            <div class="flex-1">
              <AppInputField
                :model-value="rule.deductionAmount"
                label="مبلغ الخصم"
                placeholder="مثال: 1000000000"
                type="number"
                :min="0"
                @update:model-value="updateLateAttendanceRule(index, 'deductionAmount', Number($event))"
              />
            </div>
            <BaseButton
              size="sm"
              color="danger"
              variant="pastel"
              class="mb-1"
              @click="removeLateAttendanceRule(index)"
            >
              <Icon name="ph:trash" class="size-4" />
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <template #actions>
      <div class="flex gap-2">
        <BaseButton
          color="muted"
          variant="pastel"
          @click="validateSchedule"
        >
          <Icon name="ph:check-circle-duotone" class="size-5" />
          التحقق من الصحة
        </BaseButton>
        <BaseButton
          color="primary"
          :loading="isLoading"
          @click="createWorkSchedule"
        >
          <Icon name="ph:plus-duotone" class="size-5" />
          إنشاء جدول العمل
        </BaseButton>
      </div>
    </template>
  </AppDialog>
</template>
