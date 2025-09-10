<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppInputField from '~/components/app-field/AppInputField.vue'
import { Validator } from '~/services/validator'
import { createValidator } from '~/services/validationWithI18n'
import { useKnowledgelevelStore } from '../store'
import type { KnowledgelevelCreateDto } from '../types'

const knowledgelevelStore = useKnowledgelevelStore()
const { t } = useI18n()

const validator = new Validator<KnowledgelevelCreateDto>(
  {
    name: '',
  },
  {
    name: {
      required: createValidator(t, 'knowledgelevel', 'required'),
    },
  }
)

const body = validator.validation

const isLoading = computed(() => {
  return knowledgelevelStore.isLoading
})

const createKnowledgelevel = async () => {
  const isValid = await body.value.$validate()

  if (!isValid) return
  await knowledgelevelStore.createKnowledgelevel(validator.extractBody())
  validator.resetBody()
  knowledgelevelStore.isCreateDialogOpen = false
}
watch(
  () => knowledgelevelStore.isCreateDialogOpen,
  (val: boolean) => {
    if (val) {
      validator.resetBody()
    }
  }
)
</script>
<template>
  <AppDialog
    v-model="knowledgelevelStore.isCreateDialogOpen"
    :title="$t('create-knowledgelevel')"
    size="md"
    overflow-y="visible"
  >
    <div class="rounded-3xl p-3">
      <div class="flex flex-col gap-4">
        <AppInputField
          v-model="body.name.$model"
          :errors="body.name.$errors"
          size="md"
          :label="$t('knowledgelevel')"
        />
        
      </div>
    </div>
    <template #actions>
      <BaseButton color="primary" class="gap-1" :loading="isLoading" @click="createKnowledgelevel">
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        {{ $t('save-changes') }}
      </BaseButton>
    </template>
  </AppDialog>
</template>
