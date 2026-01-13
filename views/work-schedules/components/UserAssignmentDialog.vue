<script setup lang="ts">
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { useWorkScheduleStore } from '../store'
import type { UserAssignment } from '../types'

const workScheduleStore = useWorkScheduleStore()

const validator = new Validator<{ assignments: UserAssignment[] }>(
  {
    assignments: [],
  },
  {
    assignments: {
      required: requiredValidator('يجب إضافة مستخدم واحد على الأقل'),
    },
  }
)

const body = validator.validation
const isLoading = computed(() => workScheduleStore.isLoading)

const defaultAssignment: UserAssignment = {
  userId: 0,
  effectiveDate: new Date().toISOString().split('T')[0],
  expiryDate: null,
  isPrimary: true,
  notes: '',
}

const addUserAssignment = () => {
  body.value.assignments.$model.push({ ...defaultAssignment })
}

const removeUserAssignment = (index: number) => {
  if (body.value.assignments.$model.length > 1) {
    body.value.assignments.$model.splice(index, 1)
  }
}

const updateAssignment = (index: number, field: keyof UserAssignment, value: any) => {
  body.value.assignments.$model[index] = {
    ...body.value.assignments.$model[index],
    [field]: value,
  }
}

const assignUsers = async () => {
  const isValid = await body.value.$validate()
  if (!isValid) return

  if (!workScheduleStore.selectedWorkScheduleId) return

  try {
    await workScheduleStore.assignUsers(
      workScheduleStore.selectedWorkScheduleId,
      body.value.assignments.$model
    )
    validator.resetBody()
    workScheduleStore.isUserAssignmentDialogOpen = false
  } catch (error) {
    console.error('Error assigning users:', error)
  }
}

// Reset form when dialog opens
watch(() => workScheduleStore.isUserAssignmentDialogOpen, (val: boolean) => {
  if (val) {
    validator.resetBody()
    body.value.assignments.$model = [{ ...defaultAssignment }]
  }
})

const getAssignmentErrors = (index: number, field: string) => {
  return body.value.assignments.$errors.filter(error => 
    error.$property === `assignments[${index}].${field}`
  )
}
</script>

<template>
  <AppDialog
    v-model="workScheduleStore.isUserAssignmentDialogOpen"
    title="تعيين المستخدمين لجدول العمل"
    size="xl"
    overflow-y="visible"
  >
    <div class="space-y-6">
      <!-- Schedule Info -->
      <div v-if="workScheduleStore.selectedWorkSchedule" class="rounded-lg bg-info-50 p-4 dark:bg-info-900/20">
        <h3 class="font-semibold text-info-800 dark:text-info-200">
          {{ workScheduleStore.selectedWorkSchedule.name }}
        </h3>
        <p v-if="workScheduleStore.selectedWorkSchedule.description" class="text-sm text-info-600 dark:text-info-300">
          {{ workScheduleStore.selectedWorkSchedule.description }}
        </p>
        <div class="mt-2 flex flex-wrap gap-2 text-sm">
          <span class="rounded bg-info-100 px-2 py-1 text-info-700 dark:bg-info-800 dark:text-info-200">
            {{ workScheduleStore.selectedWorkSchedule.isFlexible ? 'جدول مرن' : 'جدول ثابت' }}
          </span>
          <span class="rounded bg-info-100 px-2 py-1 text-info-700 dark:bg-info-800 dark:text-info-200">
            {{ workScheduleStore.selectedWorkSchedule.totalWeeklyHours }} ساعة أسبوعياً
          </span>
        </div>
      </div>

      <!-- User Assignments -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-muted-800 dark:text-muted-200">
            تعيينات المستخدمين
          </h3>
          <BaseButton
            size="sm"
            color="primary"
            variant="pastel"
            @click="addUserAssignment"
          >
            <Icon name="ph:plus" class="size-4" />
            إضافة مستخدم
          </BaseButton>
        </div>

        <div class="space-y-4">
          <div
            v-for="(assignment, index) in body.assignments.$model"
            :key="index"
            class="rounded-lg border border-muted-200 bg-muted-50 p-4 dark:border-muted-700 dark:bg-muted-800/50"
          >
            <!-- Header -->
            <div class="mb-4 flex items-center justify-between">
              <h4 class="font-semibold text-muted-800 dark:text-muted-200">
                المستخدم {{ index + 1 }}
              </h4>
              <BaseButton
                v-if="body.assignments.$model.length > 1"
                size="sm"
                color="danger"
                variant="pastel"
                @click="removeUserAssignment(index)"
              >
                <Icon name="ph:trash" class="size-4" />
                حذف
              </BaseButton>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- User Selection -->
              <div class="md:col-span-2">
                <AppAutoCompleteField
                  :model-value="assignment.userId"
                  label="المستخدم"
                  placeholder="اختر المستخدم..."
                  get-url="/user"
                  item-label="fullName"
                  item-value="id"
                  fetch-on-search
                  search-key="fullName"
                  :errors="getAssignmentErrors(index, 'userId')"
                  required
                  @update:model-value="updateAssignment(index, 'userId', $event)"
                />
              </div>

              <!-- Effective Date -->
              <AppInputField
                :model-value="assignment.effectiveDate"
                label="تاريخ البداية"
                type="date"
                :errors="getAssignmentErrors(index, 'effectiveDate')"
                required
                @update:model-value="updateAssignment(index, 'effectiveDate', $event)"
              />

              <!-- Expiry Date -->
              <AppInputField
                :model-value="assignment.expiryDate"
                label="تاريخ الانتهاء (اختياري)"
                type="date"
                :errors="getAssignmentErrors(index, 'expiryDate')"
                @update:model-value="updateAssignment(index, 'expiryDate', $event)"
              />

              <!-- Primary Schedule Toggle -->
              <div class="md:col-span-2">
                <div class="flex items-center gap-3">
                  <input
                    :id="`isPrimary-${index}`"
                    :checked="assignment.isPrimary"
                    type="checkbox"
                    class="size-4 rounded border-muted-300 text-primary-500 focus:ring-primary-500"
                    @change="updateAssignment(index, 'isPrimary', $event.target.checked)"
                  >
                  <label :for="`isPrimary-${index}`" class="text-sm font-medium text-muted-700 dark:text-muted-300">
                    جدول العمل الأساسي للمستخدم
                  </label>
                </div>
                <p class="mt-1 text-xs text-muted-500">
                  إذا كان هذا هو جدول العمل الأساسي للمستخدم، سيتم استخدامه كافتراضي في النظام
                </p>
              </div>

              <!-- Notes -->
              <div class="md:col-span-2">
                <AppTextAreaField
                  :model-value="assignment.notes"
                  label="ملاحظات (اختياري)"
                  placeholder="أي ملاحظات إضافية حول هذا التعيين..."
                  :errors="getAssignmentErrors(index, 'notes')"
                  @update:model-value="updateAssignment(index, 'notes', $event)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Validation Errors -->
        <div v-if="body.assignments.$errors.length" class="text-sm text-red-500">
          {{ body.assignments.$errors.map(e => e.$message).join(', ') }}
        </div>
      </div>

      <!-- Assignment Summary -->
      <div v-if="body.assignments.$model.length > 0" class="rounded-lg bg-success-50 p-4 dark:bg-success-900/20">
        <h4 class="font-semibold text-success-800 dark:text-success-200">
          ملخص التعيينات
        </h4>
        <p class="text-sm text-success-600 dark:text-success-300">
          سيتم تعيين {{ body.assignments.$model.length }} مستخدم لجدول العمل هذا
        </p>
        <div class="mt-2 text-sm text-success-600 dark:text-success-300">
          <div v-for="(assignment, index) in body.assignments.$model" :key="index">
            • المستخدم {{ index + 1 }}: من {{ assignment.effectiveDate }}
            {{ assignment.expiryDate ? ` إلى ${assignment.expiryDate}` : ' (بدون تاريخ انتهاء)' }}
            {{ assignment.isPrimary ? ' (أساسي)' : '' }}
          </div>
        </div>
      </div>
    </div>

    <template #actions>
      <BaseButton
        color="primary"
        :loading="isLoading"
        :disabled="body.assignments.$model.length === 0"
        @click="assignUsers"
      >
        <Icon name="ph:user-plus-duotone" class="size-5" />
        تعيين المستخدمين
      </BaseButton>
    </template>
  </AppDialog>
</template>
