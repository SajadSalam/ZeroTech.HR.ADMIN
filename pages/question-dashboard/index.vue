<script lang="ts" setup>
import {
  useQuestionPerformanceAnalysisChart,
  useQuestionApprovalAndRejectionReport,
  useNumberOfQuestionsAskedChart,
  useEvaluationSpeedTrendsChart,
} from '~/views/question-dashboard/composables/chart.config'

import DashboardHeader from '~/views/question-dashboard/components/DashboardHeader.vue'
import StatisticsCards from '~/views/question-dashboard/components/StatisticsCards.vue'
import {
  questionDashboardStatCardData,
  questionDashboardHeaderData,
} from '~/views/question-dashboard/index'
import type {
  QuestionDashboardHeader,
  QuestionDashboardStatCard,
} from '~/views/question-dashboard/types/index'

definePageMeta({
  title: 'question_dashboard',
  description: 'question_dashboard_description',
})

const questionPerformanceAnalysisChart = reactive(useQuestionPerformanceAnalysisChart())
const questionApprovalAndRejectionReport = reactive(useQuestionApprovalAndRejectionReport())
const numberOfQuestionsAskedChart = reactive(useNumberOfQuestionsAskedChart())
const evaluationSpeedTrendsChart = reactive(useEvaluationSpeedTrendsChart())

const statCardData = ref<QuestionDashboardStatCard[]>([...questionDashboardStatCardData])
const dashboardHeaderData = ref<QuestionDashboardHeader>({ ...questionDashboardHeaderData })
</script>

<template>
  <div>
    <DashboardHeader
      :title="dashboardHeaderData.title"
      :sub-title="dashboardHeaderData.subTitle"
      :button-text="dashboardHeaderData.buttonText"
    />

    <div class="mb-6 w-full">
      <div class="grid grid-cols-3 gap-4">
        <StatisticsCards
          v-for="item in statCardData"
          :key="item.label"
          :label="item.label"
          :value="item.value"
        />
      </div>
    </div>

    <div class="mb-6 mt-6 flex gap-4">
      <BaseCard class="relative p-6 lg:w-2/3">
        <div class="mb-6">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>{{ $t('question_performance_analysis') }}</span>
          </BaseHeading>
        </div>
        <div class="flex space-x-4">
          <div class="w-full">
            <AddonApexcharts v-bind="questionPerformanceAnalysisChart" />
          </div>
        </div>
      </BaseCard>
      <BaseCard class="relative p-6 lg:w-1/3">
        <div class="mb-6">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>{{ $t('question_approval_and_rejection_report') }}</span>
          </BaseHeading>
        </div>
        <div class="mb-4 flex justify-between border-b border-muted-200 pb-4 dark:border-muted-800">
          <div>
            <BaseParagraph size="xs" class="mb-1 text-muted-400">{{
              $t('total-exam')
            }}</BaseParagraph>
            <BaseHeading as="h5" size="md">1199</BaseHeading>
          </div>
          <div>
            <BaseParagraph size="xs" class="mb-1 text-muted-400">{{
              $t('absent_students')
            }}</BaseParagraph>
            <BaseHeading as="h5" size="md">144</BaseHeading>
          </div>
          <div>
            <BaseParagraph size="xs" class="mb-1 text-muted-400">{{
              $t('attendance_rate')
            }}</BaseParagraph>
            <BaseHeading as="h5" size="md">1055</BaseHeading>
          </div>
        </div>
        <div class="mt-auto sm:px-4">
          <AddonApexcharts v-bind="questionApprovalAndRejectionReport" />
        </div>
      </BaseCard>
    </div>

    <div class="mb-6 mt-6 flex gap-4">
      <BaseCard class="relative p-6 lg:w-1/3">
        <div class="mb-10 flex items-center justify-between">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>{{ $t('number_of_questions_asked') }}</span>
          </BaseHeading>
        </div>
        <div class="mb-6">
          <AddonApexcharts v-bind="numberOfQuestionsAskedChart" />
        </div>
        <div class="mt-auto">
          <div class="flex w-full border-muted-200 pt-4 text-center dark:border-muted-700">
            <div class="flex-1 px-2">
              <span class="font-sans text-sm text-muted-700">
                About 77 complete exams and 20 undergoing exams out of 120 exams
              </span>
            </div>
          </div>
        </div>
      </BaseCard>
      <BaseCard class="relative p-6 lg:w-2/3">
        <div class="mb-6">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>{{ $t('evaluation_speed_trends') }}</span>
          </BaseHeading>
        </div>
        <div class="flex space-x-4">
          <!-- Created Cheating Fraud Detection Logs Chart -->
          <div class="w-full">
            <AddonApexcharts v-bind="evaluationSpeedTrendsChart" />
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
