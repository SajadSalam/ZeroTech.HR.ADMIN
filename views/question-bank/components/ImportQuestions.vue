<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { useAppToaster } from '~/services/toaster/toaster'
import AppUploadFile from '~/views/question-bank/components/AppUploadFile.vue'
import { useQuestionBankStore } from '~/views/question-bank/store'
import type { ImportQuestionTypeOption } from '~/views/question-bank/types'
import { importQuestionTypeOptions } from '~/views/question-bank/types/index'

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

const selectedQuestionType = ref<ImportQuestionTypeOption | null>(null)
const uploadFile = ref<File | null>(null)
const isUploading = ref(false)
const isDownloadingTemplate = ref(false)
const uploadError = ref<string | null>(null)

const handleError = (error: Error) => {
  uploadError.value = error.message
  toaster.show('danger', error.message)
}

const handleFileError = (error: string) => {
  uploadError.value = error
  toaster.show('danger', error)
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

        const selectedQuestionTypeOption = importQuestionTypeOptions(t).find(x=>x.value === selectedQuestionType.value) as ImportQuestionTypeOption
    await questionBankStore.importQuestions(
      props.questionBankId,
      uploadFile.value,
      selectedQuestionTypeOption
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

const downloadTemplate = async () => {
  if (!selectedQuestionType.value) {
    toaster.show('danger', t('please-select-question-type-first'))
    return
  }
  const selectedTemplate = importQuestionTypeOptions(t).find(x=>x.value === selectedQuestionType.value) as ImportQuestionTypeOption

  try {
    isDownloadingTemplate.value = true
    await questionBankStore.downloadTemplate(selectedTemplate as ImportQuestionTypeOption)
    toaster.show('success', t('template-downloaded-successfully'))
  } catch (error: any) {
    handleError(error)
  } finally {
    isDownloadingTemplate.value = false
  }
}

const closeModal = () => {
  questionBankStore.importDialogOpen = false
  emit('update:show', false)
  uploadFile.value = null
  selectedQuestionType.value = null
  uploadError.value = null
}

const clearError = () => {
  uploadError.value = null
}

// Clear error when question type changes
watch(selectedQuestionType, () => {
  clearError()
})

// Clear error when file changes
watch(uploadFile, () => {
  if (uploadFile.value) {
    clearError()
  }
})
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

      <!-- Download Template Button -->
      <div v-if="selectedQuestionType" class="flex justify-end">
        <BaseButton
          variant="outline"
          color="muted"
          :loading="isDownloadingTemplate"
          @click="downloadTemplate"
        >
          <Icon name="tabler-download" size="16" class="mr-1" />
          {{ $t('download-template') }}
        </BaseButton>
      </div>

      <AppUploadFile
        v-model="uploadFile"
        :label="$t('upload-file')"
        :accept="'.xlsx,.xls'"
        :error="uploadError"
        :disabled="!selectedQuestionType"
        :max-size="10"
        @file-error="handleFileError"
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
