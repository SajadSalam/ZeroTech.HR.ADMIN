<script lang="ts" setup>
import {
  useQuestionApprovalRejectionReport,
  useQuestionPerformanceReport,
} from '~/views/question-bank-admin-reports/composables/chart.config'

import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import { useQuestionBankReportStore } from '~/views/question-bank-admin-reports/store'
import type { QuestionBankReportFilters } from '~/views/question-bank-admin-reports/types'
import { tableHeader } from '~/views/question-bank-admin-reports'
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'

definePageMeta({
  title: 'student-reports',
  description: 'student-reports-description',
})

const appTableStore = useAppTableStore()

const questionBankReportStore = useQuestionBankReportStore()

const filters = computed<QuestionBankReportFilters>({
  get() {
    return questionBankReportStore.filters
  },
  set(value: QuestionBankReportFilters) {
    questionBankReportStore.filters = value
  },
})

const getQuestionBankReports = async () => {
  appTableStore.setLoading(true)
  await questionBankReportStore.getQuestionBankReports(filters.value)
  appTableStore.setLoading(false)
}
getQuestionBankReports()
watch(
  filters,
  () => {
    getQuestionBankReports()
  },
  { deep: true }
)

const questionApprovalRejectionChart = reactive(useQuestionApprovalRejectionReport())
const questionPerformanceChart = reactive(useQuestionPerformanceReport())
</script>

<template>
  <div>
    <div class="mb-6 mt-6 flex gap-4">
      <BaseCard class="relative mt-6 p-6 lg:w-2/3">
        <div class="mb-6">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>{{ $t('question-performance-analysis') }}</span>
          </BaseHeading>
        </div>
        <div class="flex space-x-4">
          <div class="w-full">
            <AddonApexcharts v-bind="questionPerformanceChart" />
          </div>
        </div>
      </BaseCard>
      <BaseCard class="relative mt-6 p-6 lg:w-1/3">
        <div class="mb-6">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>{{ $t('question-approval-rejection-report') }}</span>
          </BaseHeading>
        </div>
        <div class="mb-4 flex justify-between border-b border-muted-200 pb-4 dark:border-muted-800">
          <div>
            <BaseParagraph size="xs" class="mb-1 text-muted-400">{{
              $t('total-questions')
            }}</BaseParagraph>
            <BaseHeading as="h5" size="md">1199</BaseHeading>
          </div>
          <div>
            <BaseParagraph size="xs" class="mb-1 text-muted-400">{{
              $t('approved-questions')
            }}</BaseParagraph>
            <BaseHeading as="h5" size="md">144</BaseHeading>
          </div>
          <div>
            <BaseParagraph size="xs" class="mb-1 text-muted-400">{{
              $t('rejected-questions')
            }}</BaseParagraph>
            <BaseHeading as="h5" size="md">1055</BaseHeading>
          </div>
        </div>
        <div class="mt-auto sm:px-4">
          <AddonApexcharts v-bind="questionApprovalRejectionChart" />
        </div>
      </BaseCard>
    </div>
    <AppCrud pagination :total-pages="questionBankReportStore.totalPages" hide-create>
      <template #filters>
        <BaseInput :placeholder="$t('search')" />
        <div class="flex items-center gap-2 text-muted-500">
          {{ $t('filter') }}
          <Icon name="tabler-filter" size="18" />
        </div>
        <div class="flex items-center gap-2 text-muted-500">
          {{ $t('sort') }}
          <Icon name="tabler-sort-ascending" size="18" />
        </div>
      </template>
      <AppTable
        title="evaluatorPerformanceStore"
        :headers="tableHeader($t)"
        :items="questionBankReportStore.questionBankReports"
        :is-loading="appTableStore.isLoading"
      >
        <template #data-questionsCreator="{ item }">
          <BaseTag color="primary" variant="outline">
            <span class="flex items-center gap-1">
              <Icon name="tabler-eye" size="18" />
              {{ $t('view-creators') }}
            </span>
          </BaseTag>
        </template>

        <template #data-auditor="{ item }">
          <BaseTag color="primary" variant="outline">
            <span class="flex items-center gap-1">
              <Icon name="tabler-eye" size="18" />
              {{ $t('view-auditor') }}
            </span>
          </BaseTag>
        </template>
        <template #data-status="{ item }">
          <BaseTag :color="item.status == 'active' ? 'success' : 'danger'" variant="pastel">
            {{ item.status == 'active' ? $t('active') : $t('inactive') }}
          </BaseTag>
        </template>
      </AppTable>
    </AppCrud>
  </div>
</template>
