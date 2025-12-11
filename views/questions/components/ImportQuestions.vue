<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { useToast } from '~/composables/toaster'
import AppUploadFile from '~/views/question-bank/components/AppUploadFile.vue'
import { useQuestionBankStore } from '~/views/question-bank/store'
import type { ImportQuestionResponse, ImportQuestionTypeOption } from '~/views/question-bank/types/import'
import { importQuestionTypeOptions } from '~/views/question-bank/types/import'

const questionBankStore = useQuestionBankStore()
const { t, locale } = useI18n()

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
const importResult = ref<ImportQuestionResponse | null>(null)

const isRtl = computed(() => locale.value === 'ar')

const handleError = (error: Error) => {
    uploadError.value = error.message
    useToast({
        message: error.message,
        isError: true,
    })
}

const handleFileError = (error: string) => {
    uploadError.value = error
    useToast({
        message: error,
        isError: true,
    })
}


const importQuestions = async () => {
    if (!uploadFile.value || !selectedQuestionType.value) {
        useToast({
            message: t('please-select-file-and-question-type'),
            isError: true,
        })
        return
    }

  

    try {
        isUploading.value = true
        importResult.value = null
        uploadError.value = null

        const result = await questionBankStore.importQuestions(
            props.questionBankId,
            uploadFile.value,
            selectedQuestionType.value
        )

        importResult.value = result

        if (result && result.hasErrors) {
            // Show warning toast for partial success or complete failure
            if (result.successCount > 0) {
                useToast({
                    message: t('questions-imported-with-errors', { 
                        success: result.successCount, 
                        errors: result.errorCount 
                    }),
                    isError: false,
                })
            } else {
                useToast({
                    message: t('all-questions-failed-to-import'),
                    isError: true,
                })
            }
        } else {
            // All questions imported successfully
            const message = result.message || t('questions-imported-successfully')
            useToast({
                message,
                isError: false,
            })
            emit('questions-imported')
            closeModal()
        }
    } catch (error: any) {
        console.error(error)
        handleError(error)
    } finally {
        isUploading.value = false
    }
}

const downloadTemplate = async () => {
    if (!selectedQuestionType.value) {
        useToast({
            message: t('please-select-question-type-first'),
            isError: true,
        })
        return
    }

    try {
        isDownloadingTemplate.value = true
        // Type assertion is safe here because we checked for null above
        await questionBankStore.downloadTemplate(
            props.questionBankId, 
            selectedQuestionType.value as ImportQuestionTypeOption
        )
        useToast({
            message: t('template-downloaded-successfully'),
            isError: false,
        })
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
    importResult.value = null
}

const clearError = () => {
    uploadError.value = null
    importResult.value = null
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
    <AppDialog v-model="questionBankStore.importDialogOpen" :title="$t('import-questions')" size="xl"
        overflow-y="auto">
        <div class="space-y-4 p-6">
            <AppAutoCompleteField 
                v-model:object-value="selectedQuestionType" 
                :items="importQuestionTypeOptions($t)"
                item-value="value"
                :label="$t('select-a-question-type')" 
                :placeholder="$t('select-a-question-type')" 
                item-label="label"
            />
            {{ selectedQuestionType }}
            <!-- Download Template Button -->
            <div v-if="selectedQuestionType" class="flex justify-end">
                <BaseButton variant="outline" color="muted" :loading="isDownloadingTemplate" @click="downloadTemplate">
                    <Icon name="tabler-download" size="16" class="mr-1" />
                    {{ $t('download-template') }}
                </BaseButton>
            </div>

            <AppUploadFile v-model="uploadFile" :label="$t('upload-file')" :accept="'.xlsx,.xls'" :error="uploadError"
                :disabled="!selectedQuestionType" :max-size="10" @file-error="handleFileError" />

            <!-- Import Results Section -->
            <div v-if="importResult" class="mt-6 space-y-4">
                <!-- Summary Card -->
                <div class="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h3 class="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {{ $t('import-summary') }}
                    </h3>
                    <div class="grid grid-cols-3 gap-4">
                        <div class="rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-900/20">
                            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {{ importResult.totalRows }}
                            </div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">
                                {{ $t('total-rows') }}
                            </div>
                        </div>
                        <div class="rounded-lg bg-green-50 p-3 text-center dark:bg-green-900/20">
                            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                                {{ importResult.successCount }}
                            </div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">
                                {{ $t('successful') }}
                            </div>
                        </div>
                        <div class="rounded-lg bg-red-50 p-3 text-center dark:bg-red-900/20">
                            <div class="text-2xl font-bold text-red-600 dark:text-red-400">
                                {{ importResult.errorCount }}
                            </div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">
                                {{ $t('failed') }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Errors List -->
                <div v-if="importResult.hasErrors && importResult.errors.length > 0" 
                     class="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                    <div class="border-b border-red-200 bg-red-100 px-4 py-3 dark:border-red-800 dark:bg-red-900/30">
                        <h4 class="font-semibold text-red-800 dark:text-red-300">
                            <Icon name="tabler-alert-circle" size="18" class="mb-0.5 inline" />
                            {{ $t('import-errors') }}
                        </h4>
                    </div>
                    <div class="max-h-96 overflow-y-auto p-4">
                        <div class="space-y-3">
                            <div v-for="(error, index) in importResult.errors" :key="index"
                                 class="rounded-lg border border-red-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-red-700 dark:bg-gray-800">
                                <div class="flex items-start gap-3">
                                    <div class="flex-shrink-0 rounded-full bg-red-100 px-2.5 py-1 text-sm font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-300">
                                        #{{ error.rowNumber }}
                                    </div>
                                    <div class="flex-1 space-y-2">
                                        <div class="font-medium text-gray-900 dark:text-gray-100">
                                            {{ error.questionTitle }}
                                        </div>
                                        <div class="flex items-center gap-2 text-sm">
                                            <span class="rounded-md bg-red-100 px-2 py-0.5 font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
                                                {{ error.field }}
                                            </span>
                                            <span class="text-gray-600 dark:text-gray-400">
                                                {{ isRtl ? error.errorMessageAr : error.errorMessage }}
                                            </span>
                                        </div>
                                        <div v-if="error.errorDetails" 
                                             class="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                                            {{ error.errorDetails }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex w-full items-center justify-end gap-2 p-2 md:p-4">
                <BaseButton variant="outline" @click="closeModal">
                    {{ importResult && importResult.hasErrors ? $t('close') : $t('cancel') }}
                </BaseButton>
                <BaseButton v-if="!importResult || !importResult.hasErrors" 
                            color="primary" 
                            :loading="isUploading" 
                            :disabled="!uploadFile || !selectedQuestionType"
                            @click="importQuestions">
                    <Icon name="tabler-upload" size="16" class="mr-1" />
                    {{ $t('import') }}
                </BaseButton>
                <BaseButton v-else 
                            color="primary" 
                            @click="importResult = null; uploadFile = null">
                    <Icon name="tabler-refresh" size="16" class="mr-1" />
                    {{ $t('try-again') }}
                </BaseButton>
            </div>
        </template>
    </AppDialog>
</template>
