<script lang="ts" setup>
import {
    AuditStatus,
    type Question,
    type QuestionFilters,
} from '~/views/question-bank/types/question'

import CreateQuestionBank from '~/views/question-bank/components/CreateQuestionBank.vue'
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
</script>

<template>
  <div>
    <AppCrud
      v-model:current-page="filters.pageNumber"
      pagination
      :total-pages="questionBankStore.totalPages"
      hide-create
    >
      <template #filters>
        <BaseInput v-model="filters.title" :placeholder="$t('search')" />
        <AppAutoCompleteField
          v-model="filters.questionBankId"
          fetch-on-search
          search-key="name"
          :placeholder="$t('questions-bank')"
          get-url="/question-bank/lookup"
          without-data
          item-label="title"
          item-value="id"
        />
        <AppAutoCompleteField
          v-model="filters.type"
          :items="questionTypeOptions($t)"
          :placeholder="$t('select-a-question-type')"
          item-label="label"
          item-value="value"
        />
        <AppAutoCompleteField
          v-model="filters.difficulty"
          :items="difficultyOptions($t)"
          :placeholder="$t('select-a-difficulty')"
          item-label="label"
          item-value="value"
        />
        <AppAutoCompleteField
          v-model="filters.knowledgeLevelId"
          :placeholder="$t('select-a-knowledge')"
          get-url="/knowledgelevel/lookup"
          fetch-on-search
          search-key="name"
          without-data
          item-label="title"
          item-value="id"
        />
      </template>
      <AppTable title="Questions" :headers="questionsTableHeaders($t)" :items="questions">
        <template #data-index="data">
            {{ (data.index + 1) + (filters.pageNumber - 1) * filters.pageSize }}
        </template>
        <template #data-actions="{ item }">
          <div class="flex items-center justify-center gap-3">
            <BaseButtonIcon
              :data-nui-tooltip="$t('view')"
              variant="outline"
              rounded="full"
              color="primary"
              size="sm"
              @click="openView(item)"
            >
              <Icon name="ph-eye" size="18" />
            </BaseButtonIcon>
            <BaseButton
              v-if="
                item.auditStatus != AuditStatus.Approved && hasPrivilege('ums:ems:question:approve')
              "
              :data-nui-tooltip="$t('Approved')"
              color="success"
              variant="pastel"
              size="sm"
              @click="questionBankStore.approveQuestion(item.id)"
            >
              <Icon name="ph-check" />
              {{ $t('Approve') }}
            </BaseButton>

            <BaseButton
              v-if="
                item.auditStatus != AuditStatus.Rejected && hasPrivilege('ums:ems:question:reject')
              "
              :data-nui-tooltip="$t('Rejected')"
              color="danger"
              variant="pastel"
              size="sm"
              @click="openReject(item)"
            >
              <Icon name="ph-x" />
              {{ $t('Reject') }}
            </BaseButton>
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
        <template #data-knowledgeLevelId="{ item }">
          <span class="text-primary-500">{{
            item.knowledgeLevel?.name || '-'
          }}</span>
        </template>
        <template #data-auditStatus="{ item }">
          <BaseTag
            variant="pastel"
            :color="
              item.auditStatus != AuditStatus.Pending
                ? item.auditStatus == AuditStatus.Rejected
                  ? 'danger'
                  : 'success'
                : 'warning'
            "
            so
          >
            {{ $t(AuditStatus[item.auditStatus ?? 1]) }}
          </BaseTag>
        </template>
        <template #data-auditDate="{ item }">
          {{ item.auditDate ? new Date(item.auditDate).toLocaleDateString() : '-' }}
        </template>
      </AppTable>
    </AppCrud>
  </div>
  <CreateQuestionBank />
  <ViewQuestion />
  <RejectDialog @update="getQuestions()" />
</template>
<style></style>
