<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'
import { Validator } from '~/services/validator'
import { createValidator } from '~/services/validationWithI18n'
import { useSubjectStore } from '../store'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { UserRoles } from '~/utils/constants/enum'
import type { Subject } from '../types'
import { useI18n } from 'vue-i18n'

const subjectStore = useSubjectStore()
const { t } = useI18n()

const selectedSubject = computed(() => subjectStore.selectedSubject)
const validator = new Validator<Subject>(
  {
    titleAr: selectedSubject.value?.titleAr as string,
    code: selectedSubject.value?.code as string,
    titleEn: selectedSubject.value?.titleEn as string,
  },
  {
    titleAr: {
      required: createValidator(t, 'subject-name', 'required'),
    },
  }
)

const body = validator.validation

const isLoading = computed(() => {
  return subjectStore.isLoading
})

const updateSubject = async () => {
  const isValid = await body.value.$validate()
  if (!isValid) return
  await subjectStore.updateSubject(validator.extractBody())
  validator.resetBody()
  subjectStore.isEditDialogOpen = false
}

watch(
  () => subjectStore.isEditDialogOpen,
  (value) => {
    if (!value) {
      validator.resetBody()
    } else {
      validator.fillBody({
        titleAr: selectedSubject.value?.titleAr as string,
        code: selectedSubject.value?.code as string,
        titleEn: selectedSubject.value?.titleEn as string,
      })
    }
  }
)
</script>
<template>
  <AppDialog
    v-model="subjectStore.isEditDialogOpen"
    :title="$t('edit-subject')"
    size="xl"
    overflow-y="visible"
  >
    <div class="rounded-3xl p-3">
      <div class="flex flex-col gap-4">
        <AppInputField
          v-model="body.titleAr.$model"
          :errors="body.titleAr.$errors"
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
          v-model="body.titleEn.$model"
          :errors="body.titleEn.$errors"
          size="md"
          :label="$t('subject_english_name')"
        />
      </div>
    </div>
    <template #actions>
      <BaseButton color="primary" class="gap-1" :loading="isLoading" @click="updateSubject">
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        {{ $t('save') }}
      </BaseButton>
    </template>
  </AppDialog>
</template>
