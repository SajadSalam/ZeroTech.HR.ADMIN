<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { tableHeader } from '~/views/questions'
import ImportQuestions from '~/views/questions/components/ImportQuestions.vue'
import QuestionCreate from '~/views/questions/components/QuestionCreate.vue'
import QuestionEdit from '~/views/questions/components/QuestionEdit.vue'
import { useQuestionStore } from '~/views/questions/store'
import { useAuthStore } from '~/views/auth/store/auth'
definePageMeta({
    title: 'questions',
    description: 'manage-questions',
    icon: 'heroicons:question-mark-circle',
})
const { t } = useI18n()
const questionStore = useQuestionStore()
const authStore = useAuthStore()
const headers = computed(() => tableHeader(t))

const handleEdit = (item: any) => {
    questionStore.selectedQuestion = item
    questionStore.selectedQuestionId = item.documentId
    questionStore.isEditDialogOpen = true
}

onMounted(() => {
    questionStore.getQuestions()
})

watchDeep(questionStore.filters, () => {
    questionStore.getQuestions()
})

const downloadTemplate = () => {
    console.log('downloadTemplate')
    // download "sample-questions-template.xlsx" from public folder
    const url = '/sample-questions-template.xlsx'
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample-questions-template.xlsx'
    a.click()
}
</script>

<template>
    <AppCrud
    :hide-create="!authStore.hasPermission(['api::question.question.create'])"
    
    pagination v-model:current-page="questionStore.filters.pageNumber" :total-pages="questionStore.totalPages"
        :title="$t('questions')" :add-btn-action="() => questionStore.isCreateDialogOpen = true">
        <template #headerActions>
            <BaseButton color="primary" variant="outline" @click="downloadTemplate"
            
            >
                <Icon name="tabler-file-download" size="20" />
                {{ $t('download-template') }}
            </BaseButton>
            <BaseButton
            v-if="authStore.hasPermission(['api::question.question.addByExcel'])"
            color="primary" @click="questionStore.isImportDialogOpen = true">
                <Icon name="tabler-file-upload" size="20" />
                {{ $t('import-questions') }}
            </BaseButton>
        </template>
        <AppTable :headers="headers" :items="questionStore.questions" :loading="questionStore.isLoading">
            <template #data-title="{ item }">
                <div class="max-w-xs truncate" :title="item.title || ''">
                    {{ item.title }}
                </div>
            </template>

            <template #data-options="{ item }">
                <div class="space-y-1">
                    <div v-for="(option, index) in item.options" :key="index" class="text-sm">
                        <span :class="{ 'font-medium text-green-600': option.isTrueAnswer }">
                            {{ index + 1 }}. {{ option.title }}
                            <span v-if="option.isTrueAnswer" class="text-xs text-green-500">({{ $t('correct-answer')
                            }})</span>
                        </span>
                    </div>
                </div>
            </template>

            <template #data-actions="{ item }">
                <AppCrudComponentsAppCrudActions
                :hide-delete="!authStore.hasPermission(['api::question.question.delete'])"
                :hide-update="!authStore.hasPermission(['api::question.question.update'])"

                :item="item" :edit-button-action="() => handleEdit(item)"
                    :delete-service="questionStore.deleteQuestion" />
            </template>
        </AppTable>
    </AppCrud>

    <QuestionCreate />
    <QuestionEdit />
    <ImportQuestions />
</template>