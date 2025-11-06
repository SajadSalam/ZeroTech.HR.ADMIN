<script setup lang="ts" generic="TModel">
import type { ErrorObject } from '@vuelidate/core'
// import VueDatePicker from '@vuepic/vue-datepicker'
// import '@vuepic/vue-datepicker/dist/main.css'
import FlatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

const props = defineProps<{
  label?: string
  placeholder?: string
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
  rounded?: 'sm' | 'md' | 'lg' | 'full'
  type?: 'text' | 'number' | 'email' | 'password' | 'date' | 'color' | 'time'
  errors?: ErrorObject[]
  monthPicker?: boolean
  icon?: string
  clearable?: boolean
  disabled?: boolean
  className?: string
}>()
type TimeModel = {
  hours: number | string
  minutes: number | string
  seconds?: number | string
}
const model = defineModel<TModel>()
const timeOrDateModel = ref<Date | TimeModel>(new Date())

const color = useColorMode()
const error = computed(() => {
  return props.errors?.length ? props.errors.map((e) => e.$message).join(', ') : ''
})
const showPassword = ref(false)
const type = computed(() => {
  return props.type === 'password' ? (showPassword.value ? 'text' : 'password') : props.type
})
</script>

<template>
  <div :class="className">
    <BaseInput
      v-if="props.type != 'date' && props.type !== 'time' && props.type != 'color'"
      v-model="model"
      :size="props.size ?? 'md'"
      :label="props.label ? props.label + (props.label && props.required ? '*' : '') : ''"
      :placeholder="props.placeholder"
      :type="type"
      :rounded="props.rounded ?? 'sm'"
      contrast="default"
      :error="error"
      :icon="props.icon ?? (props.type === 'password' ? 'ph:eye-duotone' : props.icon)"

      :disabled="props.disabled"
    >
        <template #icon>
            <Icon 
                v-if="props.type === 'password'"
                :name="showPassword ? 'ph:eye-duotone' : 'ph:eye-slash-duotone'" 
                class="cursor-pointer text-gray-500" 
                @click="showPassword = !showPassword"
            />
        </template>
    </BaseInput>

    <!-- Color Input -->
    <div v-if="props.type === 'color'" class="flex flex-col justify-between">
      <div>{{ props.label }}</div>
      <div class="!b flex gap-2 rounded-3xl bg-white px-3 py-1.5">
        <input v-model="model" type="color" :disabled="props.disabled" class="cursor-pointer" >
        <div class="">{{ model }}</div>
      </div>
    </div>

    <!-- Date Picker Input -->
    <template v-else-if="props.type === 'date'">
      <div class="flex flex-col justify-between">
        <span v-if="props.label" class="dp__label p-1">
          {{ props.label }}
        </span>

        <FlatPickr
          v-model="model"
          :config="{ enableTime: false, dateFormat: 'Y-m-d' }"
          class="w-full rounded-lg px-4 py-2 text-sm"
          :class="{
            'border-red-500': error,
            'border border-gray-300': !error,
          }"
          :disabled="props.disabled"
        />
        <span v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</span>
      </div>
    </template>
    <template v-else-if="props.type === 'time'">
      <div class="flex flex-col justify-between">
        <span v-if="props.label" class="dp__label">
          {{ props.label }}
        </span>
        <flat-pickr
          v-model="model"
          :config="{
            enableTime: true,
            noCalendar: true,
            dateFormat: 'H:i',
          }"
          class="w-full rounded-lg border px-4 py-2 text-sm"
          :disabled="props.disabled"
        />
        <span v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</span>
      </div>
    </template>
  </div>
</template>

<style>
.bg-transparent {
  background-color: transparent !important;
}

.nui-input-wrapper.nui-input-default .nui-input:where([class~='dark'], [class~='dark'] *) {
  background-color: #ffffff0f !important;
}
.dp__input {
  border-radius: 8px !important;
}
</style>
