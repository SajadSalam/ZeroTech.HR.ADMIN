<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'
import { Validator } from '~/services/validator'
import { createValidator } from '~/services/validationWithI18n'
import { useCategoryStore } from '../store'
import type { Category } from '../types'
import { useI18n } from 'vue-i18n'

const categoryStore = useCategoryStore()
const { t } = useI18n()

const validator = new Validator<Category>(
  {
    name: '',
  },
  {
    name: {
      required: createValidator(t, 'category_name', 'required'),
    },
  }
)

const body = validator.validation

const isLoading = computed(() => {
  return categoryStore.isLoading
})

const createCategory = async () => {
  const isValid = await body.value.$validate()

  if (!isValid) return
  await categoryStore.createCategory(validator.extractBody())
  validator.resetBody()
  categoryStore.isCreateDialogOpen = false
}
watch(
  () => categoryStore.isCreateDialogOpen,
  (val: boolean) => {
    if (val) {
      validator.resetBody()
    }
  }
)
</script>
<template>
  <AppDialog
    v-model="categoryStore.isCreateDialogOpen"
    :title="$t('create_new_category')"
    size="md"
    overflow-y="visible"
  >
    <div class="rounded-3xl p-3">
      <div class="flex flex-col gap-4">
        <AppInputField
          v-model="body.name.$model"
          :errors="body.name.$errors"
          size="md"
          :label="$t('category_name')"
        />
      </div>
    </div>
    <template #actions>
      <BaseButton
        color="primary"
        class="gap-1"
        :disabled="isLoading"
        :loading="isLoading"
        @click="createCategory"
      >
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        {{ $t('create_new_category') }}
      </BaseButton>
    </template>
  </AppDialog>
</template>
