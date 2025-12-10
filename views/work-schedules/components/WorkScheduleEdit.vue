<script setup lang="ts">
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { useWorkScheduleStore } from '../store'
import type { Shift, WorkScheduleUpdateDto } from '../types'
import ShiftForm from './ShiftForm.vue'

const workScheduleStore = useWorkScheduleStore()

const validator = new Validator<WorkScheduleUpdateDto>(
  {
    id: 0,
    name: '',
    description: '',
    isFlexible: false,
    flexibleHoursRequired: null,
    isGeneralTemplate: true,
    specificUserId: null,
    shifts: [],
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
    specificUserId: {
      required: (value: any, data: any) => {
        if (!data.isGeneralTemplate && !value) {
          return 'يجب اختيار المستخدم للجدول الخاص'
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

// Watch for template type changes
watch(() => body.value.isGeneralTemplate.$model, (isGeneralTemplate) => {
  if (isGeneralTemplate) {
    body.value.specificUserId.$model = null
  }
})

const addShift = () => {
  const newShift: Shift & { id?: number } = {
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

const updateShift = (index: number, shift: Shift & { id?: number }) => {
  body.value.shifts.$model[index] = shift
}

const updateWorkSchedule = async () => {
  const isValid = await body.value.$validate()
  if (!isValid) return

  try {
    const bodyData = validator.extractBody()
    // Ensure boolean values are properly set
    bodyData.isFlexible = body.value.isFlexible.$model === true
    bodyData.isGeneralTemplate = body.value.isGeneralTemplate.$model === true
    
    await workScheduleStore.updateWorkSchedule(bodyData)
    validator.resetBody()
    workScheduleStore.isEditDialogOpen = false
  } catch (error) {
    console.error('Error updating work schedule:', error)
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

// Load selected work schedule data when dialog opens
watch(() => workScheduleStore.isEditDialogOpen, (val: boolean) => {
  if (val && workScheduleStore.selectedWorkSchedule) {
    const schedule = workScheduleStore.selectedWorkSchedule
    
    // Map shifts to include id for updates
    const shiftsWithId = schedule.shifts.map(shift => ({
      id: shift.id,
      name: shift.name,
      startTime: shift.startTime,
      endTime: shift.endTime,
      workingDays: shift.workingDays,
      breakDurationMinutes: shift.breakDurationMinutes,
    }))

    validator.fillBody({
      id: schedule.id,
      name: schedule.name,
      description: schedule.description || '',
      isFlexible: schedule.isFlexible,
      flexibleHoursRequired: schedule.flexibleHoursRequired,
      isGeneralTemplate: schedule.isGeneralTemplate,
      specificUserId: schedule.specificUserId,
      shifts: shiftsWithId,
    })
  }
})
</script>

<template>
  <AppDialog
    v-model="workScheduleStore.isEditDialogOpen"
    title="تعديل جدول العمل"
    size="xl"
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

          <div class="space-y-2">
            <label class="text-sm font-medium text-muted-700 dark:text-muted-300">
              نوع الجدول
            </label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2">
                <input
                  v-model="body.isGeneralTemplate.$model"
                  type="radio"
                  :value="true"
                  class="text-primary-500"
                >
                <span class="text-sm">قالب عام</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  v-model="body.isGeneralTemplate.$model"
                  type="radio"
                  :value="false"
                  class="text-primary-500"
                >
                <span class="text-sm">خاص بمستخدم</span>
              </label>
            </div>
          </div>
        </div>

        <AppTextAreaField
          v-model="body.description.$model"
          label="الوصف"
          placeholder="وصف جدول العمل..."
          :errors="body.description.$errors"
        />

        <!-- User Selection (if not general template) -->
        <div v-if="!body.isGeneralTemplate.$model">
          <AppAutoCompleteField
            v-model="body.specificUserId.$model"
            label="المستخدم المخصص"
            placeholder="اختر المستخدم..."
            get-url="/user"
            item-label="fullName"
            item-value="id"
            fetch-on-search
            search-key="fullName"
            :errors="body.specificUserId.$errors"
          />
        </div>

        <!-- Flexibility Settings -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <input
              id="isFlexible"
              v-model="body.isFlexible.$model"
              type="checkbox"
              class="size-4 rounded border-muted-300 text-primary-500 focus:ring-primary-500"
            >
            <label for="isFlexible" class="text-sm font-medium text-muted-700 dark:text-muted-300">
              جدول عمل مرن
            </label>
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
            :key="shift.id || index"
            :model-value="shift"
            :index="index"
            :show-remove-button="body.shifts.$model.length > 1"
            @update:model-value="updateShift(index, $event)"
            @remove="removeShift(index)"
          />
        </div>

        <div v-if="body.shifts.$errors.length" class="text-sm text-red-500">
          {{ body.shifts.$errors.map(e => e.$message).join(', ') }}
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
          @click="updateWorkSchedule"
        >
          <Icon name="ph:pencil-duotone" class="size-5" />
          تحديث جدول العمل
        </BaseButton>
      </div>
    </template>
  </AppDialog>
</template>
