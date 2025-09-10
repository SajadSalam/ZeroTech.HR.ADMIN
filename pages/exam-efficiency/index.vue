<script lang="ts" setup>
import {
  useAttendanceRateReport,
  useStudentParticipationReport,
  useExamCenterSeatUsageReport,
  useRealTimeSeatAllocationReport,
  useQuestionSuccessRateReport,
  useMostDifficultQuestionsReport,
} from '~/views/exam-efficiency/composables/chart.config'

import StatCard from '~/components/StatCard.vue'

import { examEfficiencyStatCardData, examEfficiencyHeaderData } from '~/views/exam-efficiency/index'
import type {
  ExamEfficiencyHeader,
  ExamEfficiencyStatCard,
} from '~/views/exam-efficiency/types/index'
definePageMeta({
  title: 'exam_efficiency',
  description: 'exam_efficiency_report_description',
})

const attendanceRateReportChart = reactive(useAttendanceRateReport())
const studentParticipationChart = reactive(useStudentParticipationReport())
const examCenterSeatUsageChart = reactive(useExamCenterSeatUsageReport())
const realTimeSeatAllocationChart = reactive(useRealTimeSeatAllocationReport())
const questionSuccessRateChart = reactive(useQuestionSuccessRateReport())
const mostDifficultQuestionsChart = reactive(useMostDifficultQuestionsReport())

const statCardData = ref<ExamEfficiencyStatCard[]>([...examEfficiencyStatCardData])
const dashboardHeaderData = ref<ExamEfficiencyHeader>({ ...examEfficiencyHeaderData })
</script>

<template>
  <div>
    <DashboardHeader
      :title="dashboardHeaderData.title"
      :sub-title="dashboardHeaderData.subTitle"
      :button-text="dashboardHeaderData.buttonText"
    />
    <div class="full mb-6 mt-6">
      <div class="grid grid-cols-3 gap-4">
        <StatCard
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
            <span>{{ $t('attendance_rate') }}</span>
          </BaseHeading>
        </div>
        <div class="flex space-x-4">
          <div class="w-full">
            <AddonApexcharts v-bind="attendanceRateReportChart" />
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
            <span>{{ $t('student_participation') }}</span>
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
            <BaseParagraph size="xs" class="mb-1 text-muted-400">{{ $t('absent') }}</BaseParagraph>
            <BaseHeading as="h5" size="md">144</BaseHeading>
          </div>
          <div>
            <BaseParagraph size="xs" class="mb-1 text-muted-400">{{ $t('present') }}</BaseParagraph>
            <BaseHeading as="h5" size="md">1055</BaseHeading>
          </div>
        </div>
        <div class="mt-auto sm:px-4">
          <AddonApexcharts v-bind="studentParticipationChart" />
        </div>
      </BaseCard>
    </div>
    <div class="mb-6 mt-6 flex gap-6">
      <BaseCard class="relative p-6 lg:w-1/2">
        <div class="mb-6">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>{{ $t('exam_center_seat_usage') }}</span>
          </BaseHeading>
        </div>
        <div class="flex space-x-4">
          <!-- Created Cheating Fraud Detection Logs Chart -->
          <div class="w-full">
            <AddonApexcharts v-bind="examCenterSeatUsageChart" />
          </div>
        </div>
      </BaseCard>
      <BaseCard class="relative p-6 lg:w-1/2">
        <div class="mb-6">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>{{ $t('real_time_seat_allocation') }}</span>
          </BaseHeading>
        </div>
        <div class="flex space-x-4">
          <div class="w-full">
            <AddonApexcharts v-bind="realTimeSeatAllocationChart" />
          </div>
        </div>
      </BaseCard>
    </div>
    <div class="mb-6 mt-6 flex gap-4">
      <BaseCard class="relative p-6 lg:w-1/2">
        <div class="mb-6">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>{{ $t('question_success_rate') }}</span>
          </BaseHeading>
        </div>
        <div class="flex space-x-4">
          <div class="w-full">
            <!-- Created Exam Progress Overview Chart -->
            <AddonApexcharts v-bind="questionSuccessRateChart" />
          </div>
        </div>
      </BaseCard>
      <BaseCard class="relative p-6 lg:w-1/2">
        <div class="mb-6">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>{{ $t('most_difficult_questions') }}</span>
          </BaseHeading>
        </div>
        <div class="flex space-x-4">
          <div class="w-full">
            <AddonApexcharts v-bind="mostDifficultQuestionsChart" />
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
