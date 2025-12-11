<script setup lang="ts">
import type { ErrorObject } from '@vuelidate/core'

const props = defineProps<{
  label?: string
  placeholder?: string
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  errors?: ErrorObject[]
  rows?: number
}>()

const model = defineModel()

const error = computed(() => {
  return props.errors?.length ? props.errors.map((e) => e.$message).join(', ') : ''
})
</script>
<template>
  <div>
    <BaseTextarea
      v-model="model"
      :size="props.size ?? 'md'"
      :label="props.label ? props.label + (props.label && props.required ? '*' : '') : ''"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :rows="props.rows ?? 3"
      :error="error"
      class="bg-accent border-secondary"
    />
  </div>
</template>
