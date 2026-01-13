<script setup lang="ts">
import type { ErrorObject } from '@vuelidate/core'
import AppInputField from '~/components/app-field/AppInputField.vue'
import type { Shift } from '../types'
import WorkingDaysSelector from './WorkingDaysSelector.vue'

interface Props {
  modelValue: Shift
  errors?: Record<string, ErrorObject[]>
  disabled?: boolean
  showRemoveButton?: boolean
  index?: number
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'remove'])

const shift = computed({
  get: () => props.modelValue,
  set: (value: Shift) => emit('update:modelValue', value),
})

const updateField = (field: keyof Shift, value: any) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value,
  })
}

const getFieldErrors = (field: string): ErrorObject[] => {
  return props.errors?.[field] || []
}

// Calculate shift duration in hours
const shiftDuration = computed(() => {
  if (!shift.value.startTime || !shift.value.endTime) return 0
  
  const [startHour, startMinute] = shift.value.startTime.split(':').map(Number)
  const [endHour, endMinute] = shift.value.endTime.split(':').map(Number)
  
  const startMinutes = startHour * 60 + startMinute
  const endMinutes = endHour * 60 + endMinute
  
  let duration = endMinutes - startMinutes
  if (duration < 0) duration += 24 * 60 // Handle overnight shifts
  
  const breakMinutes = shift.value.breakDurationMinutes || 0
  const workingMinutes = duration - breakMinutes
  
  return Math.max(0, workingMinutes / 60)
})

// Validate time logic
const timeValidationError = computed(() => {
  if (!shift.value.startTime || !shift.value.endTime) return ''
  
  const [startHour, startMinute] = shift.value.startTime.split(':').map(Number)
  const [endHour, endMinute] = shift.value.endTime.split(':').map(Number)
  
  const startMinutes = startHour * 60 + startMinute
  const endMinutes = endHour * 60 + endMinute
  
  if (startMinutes >= endMinutes) {
    return 'وقت البداية يجب أن يكون قبل وقت النهاية'
  }
  
  return ''
})

const removeShift = () => {
  emit('remove')
}
</script>

<template>
  <div class="space-y-4 rounded-lg border border-muted-200 bg-muted-50 p-4 dark:border-muted-700 dark:bg-muted-800/50">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h4 class="text-lg font-semibold text-muted-800 dark:text-muted-200">
        {{ shift.name || `الشفت ${(index || 0) + 1}` }}
      </h4>
      <BaseButton
        v-if="showRemoveButton"
        size="sm"
        color="danger"
        variant="pastel"
        :disabled="disabled"
        @click="removeShift"
      >
        <Icon name="ph:trash" class="size-4" />
        حذف الشفت
      </BaseButton>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Shift Name -->
      <div class="md:col-span-2">
        <AppInputField
          :model-value="shift.name"
          label="اسم الشفت"
          placeholder="مثال: الشفت الصباحية"
          :errors="getFieldErrors('name')"
          :disabled="disabled"
          required
          @update:model-value="updateField('name', $event)"
        />
      </div>

      <!-- Start Time -->
      <AppInputField
        :model-value="shift.startTime"
        label="وقت البداية"
        placeholder="09:00"
        type="time"
        :errors="getFieldErrors('startTime')"
        :disabled="disabled"
        required
        @update:model-value="updateField('startTime', $event)"
      />

      <!-- End Time -->
      <AppInputField
        :model-value="shift.endTime"
        label="وقت النهاية"
        placeholder="17:00"
        type="time"
        :errors="getFieldErrors('endTime')"
        :disabled="disabled"
        required
        @update:model-value="updateField('endTime', $event)"
      />

      <!-- Break Duration -->
      <div class="md:col-span-2">
        <AppInputField
          :model-value="shift.breakDurationMinutes"
          label="مدة الاستراحة (بالدقائق)"
          placeholder="60"
          type="number"
          :min="0"
          :max="1440"
          :errors="getFieldErrors('breakDurationMinutes')"
          :disabled="disabled"
          @update:model-value="updateField('breakDurationMinutes', $event ? Number($event) : undefined)"
        />
      </div>
    </div>

    <!-- Time Validation Error -->
    <div v-if="timeValidationError" class="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
      <Icon name="ph:warning-circle" class="inline size-4" />
      {{ timeValidationError }}
    </div>

    <!-- Shift Duration Info -->
    <div v-if="shiftDuration > 0 && !timeValidationError" class="rounded-lg bg-info-50 p-3 text-sm text-info-600 dark:bg-info-900/20 dark:text-info-400">
      <Icon name="ph:clock" class="inline size-4" />
      مدة الشفت: {{ shiftDuration.toFixed(1) }} ساعة
    </div>

    <!-- Working Days -->
    <div class="md:col-span-2">
      <WorkingDaysSelector
        :model-value="shift.workingDays"
        label="أيام العمل"
        :errors="getFieldErrors('workingDays')"
        :disabled="disabled"
        required
        :shiftIndex="index"
        @update:model-value="updateField('workingDays', $event)"
      />
    </div>
  </div>
</template>
