<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppToaster } from '../../../services/toaster/toaster'
import { useQuestionStore } from '../store'
import AppUploadFile from './AppUploadFile.vue'

const { t } = useI18n()
const toaster = useAppToaster()
const questionStore = useQuestionStore()


const emit = defineEmits<{
    (e: 'questions-imported'): void
}>()

const uploadFile = ref<File | null>(null)
const isUploading = ref(false)
const uploadError = ref<string | null>(null)

const handleError = (error: Error) => {
    uploadError.value = error.message
    if (error.response) {
        uploadError.value = error.response.data.message
    }
}


const importQuestions = async () => {

    try {
        isUploading.value = true
        await questionStore.importQuestions(
            uploadFile.value as unknown as string,
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
    questionStore.isImportDialogOpen = false
    uploadFile.value = null
    uploadError.value = null
}
</script>

<template>
    <AppDialog v-model="questionStore.isImportDialogOpen" :title="$t('import-questions')" size="lg"
        overflow-y="visible">
        <div class="space-y-4 p-6">
            <AppUploadFile v-model="uploadFile" :label="$t('upload-file')" :accept="'.xlsx,.xls'"
                :error="uploadError" />
        </div>

        <template #footer>
            <div class="flex w-full items-center justify-end gap-2 p-2 md:p-4">
                <BaseButton variant="outline" @click="closeModal">
                    {{ $t('cancel') }}
                </BaseButton>
                <BaseButton color="primary" :loading="isUploading" :disabled="!uploadFile" @click="importQuestions">
                    <Icon name="tabler-upload" size="16" class="mr-1" />
                    {{ $t('import') }}
                </BaseButton>
            </div>
        </template>
    </AppDialog>
</template>
