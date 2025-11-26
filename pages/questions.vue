<script lang="ts" setup>
import {
    AuditStatus,
    type Question,
    type QuestionFilters,
} from '~/views/question-bank/types/question'

import {
    difficultyOptions,
    questionsTableHeaders,
} from '~/views/question-bank/index'

import { useQuestionBankStore } from '~/views/question-bank/store/index'

import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { useAuthStore } from '~/views/auth/store/auth'
import RejectDialog from '~/views/question-bank/components/RejectDialog.vue'
import ViewQuestion from '~/views/question-bank/components/ViewQuestion.vue'
import {
    questionTypeOptions,
} from '~/views/question-bank/types/index'
import { QuestionBankService } from '~/views/question-bank/service'

definePageMeta({
    title: 'questions-page',
    description: 'to-create-groups-of-questions',
})

const questionBankStore = useQuestionBankStore()
const appTableStore = useAppTableStore()
const questions = computed(() => questionBankStore.questions || [])
const filters = computed<QuestionFilters>({
    get() {
        return questionBankStore.questionFilters
    },
    set(value: QuestionFilters) {
        questionBankStore.questionFilters = value
    },
})
const getQuestions = async () => {
    appTableStore.setLoading(true)
    await questionBankStore.getQuestions(filters.value)
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
    questionBankStore.selectedQuestion = {
        ...item,
        isContentShown: true,
    }
    questionBankStore.isViewDialogOpen = true
}

const openReject = (item: Question) => {
    questionBankStore.selectedQuestion = item
    questionBankStore.isRejectionDialogOpen = true
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

var questionBankService = new QuestionBankService()
const deleteSelectedQuestions = async () => {
    appTableStore.setLoading(true)
    await questionBankService.deleteQuestions(selectedQuestions.value.map((q) => q.id!) as string[])
    selectedQuestions.value = []
    getQuestions()
    appTableStore.setLoading(false)
}
</script>

<template>
    <div>
        <AppCrud v-model:current-page="filters.pageNumber" pagination :total-pages="questionBankStore.totalPages"
            hide-create>
            <template #filters>
                <BaseInput v-model="filters.title" :placeholder="$t('search')" />
                <AppAutoCompleteField v-model="filters.questionBankId" fetch-on-search search-key="name"
                    :placeholder="$t('questions-bank')" get-url="/question-bank/lookup" without-data item-label="title"
                    item-value="id" />
                <AppAutoCompleteField v-model="filters.type" :items="questionTypeOptions($t)"
                    :placeholder="$t('select-a-question-type')" item-label="label" item-value="value" />
                <AppAutoCompleteField v-model="filters.difficulty" :items="difficultyOptions($t)"
                    :placeholder="$t('select-a-difficulty')" item-label="label" item-value="value" />
            </template>
            <BaseButton v-if="selectedQuestions.length > 0 && hasPrivilege('ums:ems:question:delete')" color="primary"
                variant="pastel" @click="deleteSelectedQuestions">
                <Icon class="me-2" name="ph-trash" />
                {{ $t('delete-selected-questions') }}
            </BaseButton>
            <AppTable title="Questions" :headers="questionsTableHeaders($t)" :items="questions">
                <template #data-index="data">
                    <div class="flex items-center gap-2">
                        <BaseCheckbox :model-value="selectedQuestions.includes(data.item)"
                            @update:model-value="selectQuestion(data.item)" />
                        {{ (data.index + 1) + (filters.pageNumber - 1) * filters.pageSize }}
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
                            item.auditStatus != AuditStatus.Approved && hasPrivilege('ums:ems:question:approve')
                        " :data-nui-tooltip="$t('Approved')" color="success" variant="pastel" size="sm"
                            @click="questionBankStore.approveQuestion(item.id)">
                            <Icon name="ph-check" />
                            {{ $t('Approve') }}
                        </BaseButton>

                        <BaseButton v-if="
                            item.auditStatus != AuditStatus.Rejected && hasPrivilege('ums:ems:question:reject')
                        " :data-nui-tooltip="$t('Rejected')" color="danger" variant="pastel" size="sm"
                            @click="openReject(item)">
                            <Icon name="ph-x" />
                            {{ $t('Reject') }}
                        </BaseButton>
                        <AuditLogBtn :entity-id="item.id" />

                    </div>
                </template>
                <template #data-usedTimes="">
                    {{ Math.floor(Math.random() * 100) }}
                </template>
                <template #data-type="{ item }">
                    <span class="text-primary-500">{{
                        questionTypeOptions($t).find((v) => v.value == item.type)!.label
                        }}</span>
                </template>
                <template #data-difficulty="{ item }">
                    <span class="text-primary-500">{{
                        difficultyOptions($t).find((v) => v.value == item.difficulty)!.label
                        }}</span>
                </template>
                <template #data-auditStatus="{ item }">
                    <BaseTag variant="pastel" :color="item.auditStatus != AuditStatus.Pending
                            ? item.auditStatus == AuditStatus.Rejected
                                ? 'danger'
                                : 'success'
                            : 'warning'
                        " so>
                        {{ $t(AuditStatus[item.auditStatus ?? 1]) }}
                    </BaseTag>
                </template>
                <template #data-auditDate="{ item }">
                    {{ item.auditDate ? new Date(item.auditDate).toLocaleDateString() : '-' }}
                </template>
            </AppTable>
        </AppCrud>
    </div>

    <ViewQuestion />
    <RejectDialog @update="getQuestions()" />
</template>
<style></style>
