<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppToaster } from '~/services/toaster/toaster'
import type { QuestionType } from '~/views/question-bank/types/question'
import { importQuestionTypeOptions } from '~/views/question-bank/types/index'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppUploadFile from '~/views/question-bank/components/AppUploadFile.vue'
import { useQuestionBankStore } from '~/views/question-bank/store'

const questionBankStore = useQuestionBankStore()
const { t } = useI18n()
const toaster = useAppToaster()

const props = defineProps<{
  questionBankId: string
  topicId: string
  isEditingAllowed: boolean
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'questions-imported'): void
}>()

const selectedQuestionType = ref<QuestionType | null>(null)
const uploadFile = ref<File | null>(null)
const isUploading = ref(false)
const uploadError = ref<string | null>(null)

const handleError = (error: Error) => {
  uploadError.value = error.message
  toaster.show('danger', error.message)
}

const validateExcelFile = (file: File): boolean => {
  const validTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]
  return validTypes.includes(file.type)
}

const importQuestions = async () => {
  if (!uploadFile.value || !selectedQuestionType.value || !props.isEditingAllowed) {
    toaster.show('danger', t('please-select-file-and-question-type'))
    return
  }

  try {
    isUploading.value = true
    /*  
        if (!validateExcelFile(uploadFile.value)) {
            toaster.show('danger', t('invalid-file-type'))
            return
        } */
    await questionBankStore.importQuestions(
      props.questionBankId,
      uploadFile.value,
      selectedQuestionType.value
    )

    toaster.show('success', t('questions-imported-successfully'))
    emit('questions-imported')
    closeModal()
  } catch (error: any) {
    handleError(error)
  } finally {
    isUploading.value = false
  }
}

const closeModal = () => {
  questionBankStore.importDialogOpen = false
  emit('update:show', false)
  uploadFile.value = null
  selectedQuestionType.value = null
  uploadError.value = null
}
</script>

<template>
  <AppDialog
    v-model="questionBankStore.importDialogOpen"
    :title="$t('import-questions')"
    size="lg"
    overflow-y="visible"
  >
    <div class="space-y-4 p-6">
      <AppAutoCompleteField
        v-model="selectedQuestionType"
        :items="importQuestionTypeOptions($t)"
        :label="$t('select-a-question-type')"
        :placeholder="$t('select-a-question-type')"
        item-label="label"
        item-value="value"
      />

      <AppUploadFile
        v-model="uploadFile"
        :label="$t('upload-file')"
        :accept="'.xlsx,.xls'"
        :error="uploadError"
        :disabled="!selectedQuestionType"
      />
    </div>

    <template #footer>
      <div class="flex w-full items-center justify-end gap-2 p-2 md:p-4">
        <BaseButton variant="outline" @click="closeModal">
          {{ $t('cancel') }}
        </BaseButton>
        <BaseButton
          color="primary"
          :loading="isUploading"
          :disabled="!uploadFile || !selectedQuestionType"
          @click="importQuestions"
        >
          <Icon name="tabler-upload" size="16" class="mr-1" />
          {{ $t('import') }}
        </BaseButton>
      </div>
    </template>
  </AppDialog>
</template>
