<script lang="ts" setup>
import {
    AuditStatus,
    Difficulty,
    QuestionType,
    type Question,
} from '~/views/questions/types'

import {
    questionsTableHeaders,
} from '~/views/question-bank/index'


import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { useAuthStore } from '~/views/auth/store/auth'
import CancelDialog from '~/views/questions/components/CancelDialog.vue'
import RequestUpdateDialog from '~/views/questions/components/RequestUpdateDialog.vue'
// import ViewQuestion from '~/views/questions/components/ViewQuestion.vue'
import type { QuestionFilters } from '~/views/questions/service'
import { useQuestionStore } from '~/views/questions/store'
import {
    difficultyOptions,
    getDifficultyConfig,
    getQuestionTypeLabel,
    questionTypeOptions,
} from '~/views/questions/utils'



definePageMeta({
    title: 'questions-page',
    description: 'to-create-groups-of-questions',
})

const questionsStore = useQuestionStore()
const appTableStore = useAppTableStore()
const questions = computed(() => questionsStore.questions || [])
const filters = computed<QuestionFilters>({
    get() {
        return questionsStore.filters
    },
    set(value: QuestionFilters) {
        questionsStore.filters = value
    },
})

// Computed property for search input to handle null values
const searchInput = computed({
    get() {
        return filters.value.search || ''
    },
    set(value: string) {
        filters.value.search = value || null
    },
})
const getQuestions = async () => {
    appTableStore.setLoading(true)
    await questionsStore.getQuestions(filters.value)
    appTableStore.setLoading(false)
}
getQuestions()
watchDebounced(
    filters,
    () => {
        getQuestions()
    },
    { deep: true, debounce: 500 }
)
const openView = (item: Question) => {
    questionsStore.selectedQuestion = {
        ...item,
    }
    questionsStore.selectedQuestionId = item.id!
    questionsStore.isEditDialogOpen = true
}

const openCancel = (item: Question) => {
    questionsStore.selectedQuestionId = item.id!
    questionsStore.selectedQuestion = item
    questionsStore.isRejectionDialogOpen = true
}

const openRequestUpdate = (item: Question) => {
    questionsStore.selectedQuestionId = item.id!
    questionsStore.selectedQuestion = item
    questionsStore.isRequestUpdateDialogOpen = true
}

const { hasPrivilege } = useAuthStore()

const selectedQuestions = ref<Question[]>([])
const selectQuestion = (item: Question) => {
    if (selectedQuestions.value.some((q) => q.id === item.id)) {
        selectedQuestions.value = selectedQuestions.value.filter((q) => q.id !== item.id)
    } else {
        selectedQuestions.value.push(item)
    }
}
const toggleSelectAllQuestions = () => {
    if (selectedQuestions.value.length === questions.value.length) {
        selectedQuestions.value = []
    } else {
        selectedQuestions.value = questions.value
    }
}

// var questionsService = new QuestionService()
// const deleteSelectedQuestions = async () => {
//     appTableStore.setLoading(true)
//     await questionBankService.deleteQuestions(selectedQuestions.value.map((q) => q.id!) as string[])
//     selectedQuestions.value = []
//     getQuestions()
//     appTableStore.setLoading(false)
// }
</script>

<template>
    <div>
        <AppCrud v-model:current-page="filters.page" pagination :total-pages="questionsStore.totalPages"
            hide-create>
            <template #filters>
                <BaseInput v-model="searchInput" :placeholder="$t('search')" />
                <AppAutoCompleteField v-model="filters.questionBankId" fetch-on-search search-key="name"
                    :placeholder="$t('questions-bank')" get-url="/question-banks/lookup"
                    without-data
                    item-label="title" item-value="id" />
                <AppAutoCompleteField v-model="filters.questionType" :items="questionTypeOptions($t)"
                    :placeholder="$t('select-a-question-type')" item-label="label" item-value="value" />
                <AppAutoCompleteField v-model="filters.difficulty" :items="difficultyOptions($t)"
                    :placeholder="$t('select-a-difficulty')" item-label="label" item-value="value" />
            </template>
            <!-- <BaseButton v-if="selectedQuestions.length > 0 && hasPrivilege('ums:ems:question:delete')" color="primary"
                variant="pastel" @click="deleteSelectedQuestions">
                <Icon class="me-2" name="ph-trash" />
                {{ $t('delete-selected-questions') }}
            </BaseButton> -->
            <AppTable title="Questions" :headers="questionsTableHeaders($t)" :items="questions">
                <template #data-index="{ item, index }">
                    <div class="flex items-center gap-2">
                        <BaseCheckbox :model-value="selectedQuestions.includes(item)"
                            @update:model-value="selectQuestion(item)" />
                        {{ (index + 1) + ((filters.page ?? 1) - 1) * (filters.pageSize ?? 50) }}
                    </div>
                </template>
                <template #header-index>
                    <div class="flex items-center gap-2">
                        #
                        <BaseCheckbox :model-value="selectedQuestions.length === questions.length"
                            @update:model-value="toggleSelectAllQuestions" />
                    </div>
                </template>
                <template #data-actions="{ item }">
                    <div class="flex items-center justify-center gap-3">
                        <BaseButtonIcon :data-nui-tooltip="$t('view')" variant="outline" rounded="full" color="primary"
                            size="sm" @click="openView(item)">
                            <Icon name="ph-eye" size="18" />
                        </BaseButtonIcon>
                        <BaseButton v-if="
                            item.status === AuditStatus.Pending 
                        " :data-nui-tooltip="$t('approve')" 
                        color="success" variant="pastel" size="sm"
                            @click="questionsStore.approveQuestion(item.id)" :loading="questionsStore.isLoading"
                            :disabled="questionsStore.isLoading">
                            <Icon name="ph-check" />
                            {{ $t('approve') }}
                        </BaseButton>

                        <BaseButton v-if="
                            item.status === AuditStatus.Pending 
                        " :data-nui-tooltip="$t('request-update')" color="warning" variant="pastel" size="sm"
                            @click="openRequestUpdate(item)" :loading="questionsStore.isLoading"
                            :disabled="questionsStore.isLoading">
                            <Icon name="ph-arrow-clockwise" />
                            {{ $t('request-update') }}
                        </BaseButton>

                        <BaseButton v-if="
                            item.status === AuditStatus.Pending 
                        " :data-nui-tooltip="$t('cancel')" color="danger" variant="pastel" size="sm"
                            @click="openCancel(item)" :loading="questionsStore.isLoading"
                            :disabled="questionsStore.isLoading">
                            <Icon name="ph-x" />
                            {{ $t('cancel') }}
                        </BaseButton>
                        <AuditLogBtn :entity-id="item.id" />

                    </div>
                </template>
                <template #data-usedTimes="">
                    {{ Math.floor(Math.random() * 100) }}
                </template>
                <template #data-title="{ item }">
                    <span>{{ item.titleAr || item.titleEn }}</span>
                </template>
                <template #data-type="{ item }">
                    <span class="text-primary-500">
                      
                    {{ getQuestionTypeLabel(item.questionType as QuestionType, $t) }}    
                    </span>
                </template>
                <template #data-difficulty="{ item }">
                    <span class="text-primary-500">{{
                        getDifficultyConfig(item.difficulty as Difficulty, $t).label
                        }}</span>
                </template>
                <template #data-creatorFullName="{ item }">
                    <span>{{ item.creator?.name || '-' }}</span>
                </template>
                <template #data-auditorFullName="{ item }">
                    <span>{{ item.auditor?.name || '-' }}</span>
                </template>
                <template #data-questionBankName="{ item }">
                    <span>{{ item.topic?.titleAr || item.topic?.titleEn || '-' }}</span>
                </template>
                <template #data-auditStatus="{ item }">
                    <BaseTag variant="pastel" :color="
                        item.status === AuditStatus.Pending
                            ? 'warning'
                            : item.status === AuditStatus.Approve
                            ? 'success'
                            : item.status === AuditStatus.RequestUpdate
                            ? 'info'
                            : 'danger'
                    ">
                        {{ $t(typeof item.status === 'string' ? item.status : AuditStatus[item.status ?? AuditStatus.Pending]) }}
                    </BaseTag>
                </template>
                <template #data-auditDate="{ item }">
                    {{ item.auditDate ? new Date(item.auditDate).toLocaleDateString() : '-' }}
                </template>
            </AppTable>
        </AppCrud>
    </div>

    <!-- <ViewQuestion /> -->
    <CancelDialog @update="getQuestions()" />
    <RequestUpdateDialog @update="getQuestions()" />
</template>
<style></style>
