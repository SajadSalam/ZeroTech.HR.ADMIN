<script lang="ts" setup>
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { formatDate } from '~/services/formatters'
import { useAuthStore } from '~/views/auth/store/auth'
import AssignDialog from '~/views/question-bank/components/AssignDialog.vue'
import CardView from '~/views/question-bank/components/CardView.vue'
import CreateQuestionBank from '~/views/question-bank/components/CreateQuestionBank.vue'
import EditQuestionBank from '~/views/question-bank/components/EditQuestionBank.vue'
import { tableHeader } from '~/views/question-bank/index'
import { useQuestionBankStore } from '~/views/question-bank/store/index'
import { AssignType } from '~/views/question-bank/types/assign'
import {
    type QuestionBankDto,
    type QuestionBankFilters,
} from '~/views/question-bank/types/index'
definePageMeta({
    title: 'question-bank-schedule',
})

const questionBankStore = useQuestionBankStore()
const appTableStore = useAppTableStore()
const isLoading = computed(() => questionBankStore.isLoading)
const questionBanks = computed(() => questionBankStore.questionBanks || [])
const filters = computed<QuestionBankFilters>({
    get() {
        return questionBankStore.filters
    },
    set(value: QuestionBankFilters) {
        questionBankStore.filters = value
    },
})
const getQuestionBanks = async () => {
    appTableStore.setLoading(true)
    await questionBankStore.getQuestionBanks(filters.value)
    appTableStore.setLoading(false)
}
getQuestionBanks()
watch(
    filters,
    () => {
        getQuestionBanks()
    },
    { deep: true }
)


const openEdit = (item: QuestionBankDto) => {
    questionBankStore.selectedQuestionBank = item
    questionBankStore.selectedQuestionBankId = item.id
    questionBankStore.isEditDialogOpen = true
}
enum ViewType {
    Card = 'card',
    Table = 'table',
}

const viewType = ref<ViewType>(ViewType.Table)
const toggleViewType = () => {
    viewType.value = viewType.value === ViewType.Table ? ViewType.Card : ViewType.Table
}
const { hasPrivilege } = useAuthStore()
const openAssignCreator = (item: QuestionBankDto) => {
    questionBankStore.isAssignDialogOpen = true
    questionBankStore.assignType = AssignType.Creator
    questionBankStore.selectedQuestionBank = item
}
const openAssignAuditor = (item: QuestionBankDto) => {
    questionBankStore.isAssignDialogOpen = true
    questionBankStore.assignType = AssignType.Auditor
    questionBankStore.selectedQuestionBank = item
}
</script>

<template>
    <div>
        <AppCrud v-model:current-page="filters.pageNumber" pagination :total-pages="questionBankStore.totalPages"
            :add-btn-action="() => (questionBankStore.isCreateDialogOpen = true)"
            :hide-create="!hasPrivilege('ums:ems:question-bank:create')" :add-button-text="$t('create-question-bank')">
            <template #headerActions>
                <BaseButton color="none" variant="outline" @click="toggleViewType">
                    <Icon :name="viewType === ViewType.Table ? 'ph-grid-four-duotone' : 'ph-list-duotone'" size="18" />
                    {{ $t(viewType === ViewType.Table ? 'card-view' : 'table-view') }}
                </BaseButton>
            </template>
            <template #filters>
                <AppTextField  v-model="filters.search" :placeholder="$t('search')" />
                <AppAutoCompleteField v-model="filters.subjectId" fetch-on-search search-key="name"
                    :placeholder="$t('subject')" get-url="/subjects/lookup" without-data item-label="title"
                    item-value="id" />
                <AppAutoCompleteField v-model="filters.topics" fetch-on-search search-key="name"
                    :placeholder="$t('topics')" get-url="/topics/lookup" without-data item-label="title" item-value="id"
                    multiple />
            </template>
            <AppTable :is-loading="isLoading" v-if="viewType === ViewType.Table" :title="$t('questions-bank')"
                :headers="tableHeader($t)" :items="questionBanks">
                <template #data-id="data">
                    <span>{{ data.index + 1 }}</span>
                </template>
                <template #data-creator="{ item }">
                    <BaseButton  color="primary"
                        variant="outline" @click="openAssignCreator(item)">
                        <Icon name="ph-eye" class="me-1" />
                        {{ $t('creators') }}
                    </BaseButton>
                </template>
                 <template #data-auditor="{ item }">
                    <BaseButton color="primary"
                        variant="outline" @click="openAssignAuditor(item)">
                        <Icon name="ph-eye" class="me-1" />
                        {{ $t('auditors') }}
                    </BaseButton>
                </template>
                <template #data-actions="{ item }">
                    <div class="flex items-center justify-center gap-2">
                        <BaseButton v-if="hasPrivilege('ums:ems:question-bank:view')"
                            :data-nui-tooltip="$t('edit-questions')" :to="`/question-bank/questions/${item.id}`"
                            size="sm" color="primary">
                            <Icon name="ph:upload-duotone" class="me-1" size="18" />
                            {{ $t('edit-questions') }}
                        </BaseButton>
                        <AppCrudActions v-if="
                            hasPrivilege('ums:ems:question-bank:update') ||
                            hasPrivilege('ums:ems:question-bank:delete')
                        " :item="item" :delete-service="questionBankStore.deleteQuestionBank" :edit-button-action="() => {
                openEdit(item)
            }
                " :hide-delete="!hasPrivilege('ums:ems:question-bank:delete')"
                            :hide-update="!hasPrivilege('ums:ems:question-bank:update')" />
                        <AuditLogBtn :entity-id="item.id" />

                    </div>
                </template>
                <template #data-creationPeriod="{ item }">
                    <span v-if="item.startEditingDatetimeUtc != null && item.endEditingDatetimeUtc != null">
                        {{ formatDate(item.startEditingDatetimeUtc ?? '') }} - {{ formatDate(item.endEditingDatetimeUtc ?? '') }}
                    </span>
                    <span v-else> - </span>
                </template>
            </AppTable>
            <div v-else class="grid gap-2 md:grid-cols-3">
                <CardView v-for="questionBank in questionBanks" :key="questionBank.id" :question-bank="questionBank"
                    @update:open-edit="openEdit">
                    <template #actions>
                        <AuditLogBtn :entity-id="questionBank.id" />
                    </template>
                </CardView>
            </div>
        </AppCrud>
    </div>
    <CreateQuestionBank v-if="hasPrivilege('ums:ems:question-bank:create')" />
    <EditQuestionBank v-if="hasPrivilege('ums:ems:question-bank:update')" />
    <AssignDialog  />
</template>
<style></style>
