<script setup lang="ts">
import type { ErrorObject } from '@vuelidate/core'
import { WORKING_DAYS, WORKING_DAYS_LABELS, calculateWorkingDaysFromArray } from '../types'

interface Props {
  modelValue?: number
  label?: string
  errors?: ErrorObject[]
  disabled?: boolean
  required?: boolean
  shiftIndex?: number
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const selectedDays = ref<number[]>([])

const error = computed(() => {
  return props.errors?.length ? props.errors.map((e) => e.$message).join(', ') : ''
})

const workingDaysOptions = [
  { value: WORKING_DAYS.SUNDAY, label: WORKING_DAYS_LABELS[WORKING_DAYS.SUNDAY] },
  { value: WORKING_DAYS.MONDAY, label: WORKING_DAYS_LABELS[WORKING_DAYS.MONDAY] },
  { value: WORKING_DAYS.TUESDAY, label: WORKING_DAYS_LABELS[WORKING_DAYS.TUESDAY] },
  { value: WORKING_DAYS.WEDNESDAY, label: WORKING_DAYS_LABELS[WORKING_DAYS.WEDNESDAY] },
  { value: WORKING_DAYS.THURSDAY, label: WORKING_DAYS_LABELS[WORKING_DAYS.THURSDAY] },
  { value: WORKING_DAYS.FRIDAY, label: WORKING_DAYS_LABELS[WORKING_DAYS.FRIDAY] },
  { value: WORKING_DAYS.SATURDAY, label: WORKING_DAYS_LABELS[WORKING_DAYS.SATURDAY] },
]

// Initialize selected days from modelValue
const initializeSelectedDays = (value?: number) => {
  if (!value) {
    selectedDays.value = []
    return
  }
  
  const days: number[] = []
  workingDaysOptions.forEach(option => {
    if (value & option.value) {
      days.push(option.value)
    }
  })
  selectedDays.value = days
}

// Watch for modelValue changes
watch(() => props.modelValue, (newValue) => {
  initializeSelectedDays(newValue)
}, { immediate: true })

// Watch for selectedDays changes and emit
watch(selectedDays, (newDays) => {
  const bitFlags = calculateWorkingDaysFromArray(newDays)
  emit('update:modelValue', bitFlags)
}, { deep: true })

const toggleDay = (dayValue: number) => {
  if (props.disabled) return
  
  const index = selectedDays.value.indexOf(dayValue)
  if (index > -1) {
    selectedDays.value.splice(index, 1)
  } else {
    selectedDays.value.push(dayValue)
  }
}

const isDaySelected = (dayValue: number) => {
  return selectedDays.value.includes(dayValue)
}

const selectAllWeekdays = () => {
  if (props.disabled) return
  selectedDays.value = [
    WORKING_DAYS.MONDAY,
    WORKING_DAYS.TUESDAY,
    WORKING_DAYS.WEDNESDAY,
    WORKING_DAYS.THURSDAY,
    WORKING_DAYS.FRIDAY,
  ]
}

const selectAllDays = () => {
  if (props.disabled) return
  selectedDays.value = workingDaysOptions.map(option => option.value)
}

const clearAll = () => {
  if (props.disabled) return
  selectedDays.value = []
}
</script>

<template>
  <div class="space-y-3">
    <!-- Label -->
    <div v-if="label" class="flex items-center gap-2">
      <label class="text-sm font-medium text-muted-700 dark:text-muted-300">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
    </div>

    <!-- Quick Actions -->
    <div class="flex flex-wrap gap-2">
      <BaseButton
        size="sm"
        color="primary"
        variant="pastel"
        :disabled="disabled"
        @click="selectAllWeekdays"
      >
        أيام العمل
      </BaseButton>
      <BaseButton
        size="sm"
        color="info"
        variant="pastel"
        :disabled="disabled"
        @click="selectAllDays"
      >
        كل الأيام
      </BaseButton>
      <BaseButton
        size="sm"
        color="muted"
        variant="pastel"
        :disabled="disabled"
        @click="clearAll"
      >
        مسح الكل
      </BaseButton>
    </div>

    <!-- Days Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
      <div
        v-for="(option, index) in workingDaysOptions"
        :key="`${shiftIndex}-${option.value}`"
        class="relative"
      >
        <input
          :id="`day-${shiftIndex}-${option.value}`"
          type="checkbox"
          :checked="isDaySelected(option.value)"
          :disabled="disabled"
          class="peer sr-only"
          @change="toggleDay(option.value, index)"
        >
        <label
          :for="`day-${shiftIndex}-${option.value}`"
          class="flex cursor-pointer items-center justify-center rounded-lg border-2 border-muted-300 bg-white p-3 text-sm font-medium text-muted-700 transition-all hover:border-primary-500 hover:bg-primary-500 hover:text-primary-500 hover:bg-op-10 peer-checked:border-primary-500 peer-checked:bg-primary-100 peer-checked:text-primary-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 dark:border-muted-600 dark:bg-muted-800 dark:text-muted-300 dark:hover:border-primary-400 dark:hover:bg-primary-900/20 dark:peer-checked:border-primary-400 dark:peer-checked:bg-primary-900/30 dark:peer-checked:text-primary-300"
          :class="{
            'bg-primary-500 text-primary-500 !font-bold !bg-opacity-20': isDaySelected(option.value),
          }"
        >
          <span class="text-center">{{ option.label }}</span>
        </label>
      </div>
    </div>

    <!-- Selected Days Summary -->
    <div v-if="selectedDays.length > 0" class="text-sm text-muted-600 dark:text-muted-400">
      الأيام المحددة: {{ selectedDays.length }} أيام
    </div>

    <!-- Error Message -->
    <div v-if="error" class="text-sm text-red-500">
      {{ error }}
    </div>
  </div>
</template>
