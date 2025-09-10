<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'
import { Validator } from '~/services/validator'
import { createValidator } from '~/services/validationWithI18n'
import { useCategoryStore } from '../store'
import type { Category } from '../types'
import { useI18n } from 'vue-i18n'

const categoryStore = useCategoryStore()
const { t } = useI18n()

const selectedCategory = computed(() => categoryStore.selectedCategory)
const validator = new Validator<Category>(
  {
    name: selectedCategory.value?.name as string,
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

const updateCategory = async () => {
  const isValid = await body.value.$validate()
  if (!isValid) return
  await categoryStore.updateCategory(validator.extractBody())
  validator.resetBody()
  categoryStore.isEditDialogOpen = false
}

watch(
  () => categoryStore.isEditDialogOpen,
  (value) => {
    if (!value) {
      validator.resetBody()
    } else {
      validator.fillBody({
        name: selectedCategory.value?.name as string,
      })
    }
  }
)
</script>
<template>
  <AppDialog
    v-model="categoryStore.isEditDialogOpen"
    :title="$t('edit_category')"
    size="xl"
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
      <BaseButton color="primary" class="gap-1" :loading="isLoading" @click="updateCategory">
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        {{ $t('save') }}
      </BaseButton>
    </template>
  </AppDialog>
</template>
