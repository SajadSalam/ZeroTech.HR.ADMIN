<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppInputField from '~/components/app-field/AppInputField.vue'
import { createValidator } from '~/services/validationWithI18n'
import { Validator } from '~/services/validator'
import { useKnowledgelevelStore } from '../store'
import type { KnowledgelevelCreateDto } from '../types'

const knowledgelevelStore = useKnowledgelevelStore()
const { t } = useI18n()

const selectedKnowledgelevel = computed(() => knowledgelevelStore.selectedKnowledgelevel)
const validator = new Validator<KnowledgelevelCreateDto>(
  {
    name: selectedKnowledgelevel.value?.name as string,
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

const updateKnowledgelevel = async () => {
  const isValid = await body.value.$validate()
  if (!isValid) return
  await knowledgelevelStore.updateKnowledgelevel(validator.extractBody())
  validator.resetBody()
  knowledgelevelStore.isEditDialogOpen = false
}

watch(
  () => knowledgelevelStore.isEditDialogOpen,
  (value) => {
    if (!value) {
      validator.resetBody()
    } else {
      validator.fillBody({
        name: selectedKnowledgelevel.value?.name as string,
      })
    }
  }
)
</script>
<template>
  <AppDialog
    v-model="knowledgelevelStore.isEditDialogOpen"
    :title="$t('edit-knowledgelevel')"
    size="xl"
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
      <BaseButton color="primary" class="gap-1" :loading="isLoading" @click="updateKnowledgelevel">
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        {{ $t('save-changes') }}
      </BaseButton>
    </template>
  </AppDialog>
</template>
