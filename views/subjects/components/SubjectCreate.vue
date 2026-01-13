<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'
import { Validator } from '~/services/validator'
import { requiredValidator } from '~/services/validation'
import { useSubjectStore } from '../store'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { UserRoles } from '~/utils/constants/enum'
import type { Subject } from '../types'

const subjectStore = useSubjectStore()

const validator = new Validator<Subject>(
  {
    name: '',
    code: '',
    englishName: '',
  },
  {
    name: {
      required: requiredValidator('Subject name'),
    },
  }
)

const body = validator.validation

const isLoading = computed(() => {
  return subjectStore.isLoading
})

const createSubject = async () => {
  const isValid = await body.value.$validate()

  if (!isValid) return
  await subjectStore.createSubject(validator.extractBody())
  validator.resetBody()
  subjectStore.isCreateDialogOpen = false
}
watch(
  () => subjectStore.isCreateDialogOpen,
  (val: boolean) => {
    if (val) {
      validator.resetBody()
    }
  }
)
</script>
<template>
  <AppDialog
    v-model="subjectStore.isCreateDialogOpen"
    :title="$t('create-new-subject')"
    size="md"
    overflow-y="visible"
  >
    <div class="rounded-3xl p-3">
      <div class="flex flex-col gap-4">
        <AppInputField
          v-model="body.name.$model"
          :errors="body.name.$errors"
          size="md"
          :label="$t('subject-name')"
        />
        <AppInputField
          v-model="body.code.$model"
          :errors="body.code.$errors"
          size="md"
          :label="$t('subject_code')"
        />
        <AppInputField
          v-model="body.englishName.$model"
          :errors="body.englishName.$errors"
          size="md"
          :label="$t('subject_english_name')"
        />
      </div>
    </div>
    <template #actions>
      <BaseButton
        color="primary"
        class="gap-1"
        :disabled="isLoading"
        :loading="isLoading"
        @click="createSubject"
      >
        <Icon name="ph:check-circle-duotone" class="size-5" />
        {{ $t('create-new-subject') }}
      </BaseButton>
    </template>
  </AppDialog>
</template>
