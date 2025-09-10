<script lang="ts" setup>
import { ref } from 'vue'
import AppFileUploaderButton from '../../../components/app-field/AppFileUploaderButton.vue'

interface Props {
  modelValue: File | null
  placeholder?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  label?: string
  disabled?: boolean
  accept?: string
  error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  size: 'md',
  disabled: false,
  accept: '*',
})

const emit = defineEmits<{
  'update:modelValue': [value: File | null]
}>()

const fileModel = computed({
  get: () => props.modelValue,
  set: (value: File | null) => emit('update:modelValue', value),
})

const isUploading = ref(false)
</script>

<template>
  <div class="space-y-2">
    <p v-if="label" class="text-sm">
      {{ label }}
    </p>
    <div class="flex w-full items-center gap-2">
      <AppFileUploaderButton
        v-model="fileModel"
        :accept="accept"
        :disabled="disabled || isUploading"
      >
        <BaseButtonIcon :disabled="disabled || isUploading" variant="outline">
          <Icon
            :name="isUploading ? 'tabler:loader' : 'tabler:photo'"
            class="text-primary-500"
            :class="{ 'animate-spin': isUploading }"
            size="18"
          />
        </BaseButtonIcon>
      </AppFileUploaderButton>
    </div>

    <div v-if="fileModel" class="flex items-center gap-2">
      <p>
        {{ $t('selected-file') }}:
        <span class="font-bold">{{ fileModel.name }}</span>
      </p>
      <Icon
        name="tabler:trash"
        class="cursor-pointer text-red-500"
        size="18"
        @click="fileModel = null"
      />
    </div>

    <p v-if="error" class="text-sm text-red-500">
      {{ error }}
    </p>
  </div>
</template>
