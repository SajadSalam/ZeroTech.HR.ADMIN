<script lang="ts" setup>
import {
  useAttendanceRateReport,
  useLiveExamCount,
  useCheatingFraudDetectionLogs,
  useStudentOnlineStatus,
  useExamTimeChart,
  useCompletedExamsChart,
  useExamSuccessRateChart,
} from '~/views/admin-dashboard/composables/chart.config'

import DashboardHeader from '~/views/admin-dashboard/components/DashboardHeader.vue'
import StatisticsCards from '~/views/admin-dashboard/components/StatisticsCards.vue'

definePageMeta({
  title: 'admin_dashboard',
  description: 'admin_dashboard_description',
})

const attendanceRateReportChart = reactive(useAttendanceRateReport())
const liveExamCount = reactive(useLiveExamCount())
const cheatingFraudDetectionLogsChart = reactive(useCheatingFraudDetectionLogs())
const studentOnlineStatus = reactive(useStudentOnlineStatus())
const examTimeChart = reactive(useExamTimeChart())
const completedExamsChart = reactive(useCompletedExamsChart())
const examSuccessRateChart = reactive(useExamSuccessRateChart())

const statCardData: { label: string; value: string }[] = [
  { label: 'total_number_of_employees', value: '62K' },
  { label: 'total_number_of_students', value: '62K' },
  { label: 'total_number_of_examinations_established', value: '62K' },
  { label: 'exams_rejected_by_the_committee', value: '62K' },
  { label: 'the_number_of_exams_that_have_not_been_conducted', value: '62K' },
  { label: 'the_number_of_exams_conducted', value: '62K' },
]

const dashboarHeaderData = {
  title: 'total_exam_statistics',
  subTitle: 'dashboard_director_of_the_system',
  buttonText: 'export_reports',
}
</script>

<template>
  <div>
    <DashboardHeader
      :title="dashboarHeaderData.title"
      :sub-title="dashboarHeaderData.subTitle"
      :button-text="dashboarHeaderData.buttonText"
    />

    <div class="full mb-6 mt-6">
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
            <span>{{ $t('average_exam_scores') }}</span>
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
            <span>{{ $t('exam_attendance_breakdown') }}</span>
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
          <AddonApexcharts v-bind="liveExamCount" />
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
            <span>{{ $t('user_activity_over_time') }}</span>
          </BaseHeading>
        </div>
        <div class="flex space-x-4">
          <!-- Created Cheating Fraud Detection Logs Chart -->
          <div class="w-full">
            <AddonApexcharts v-bind="cheatingFraudDetectionLogsChart" />
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
            <span>{{ $t('server-load-over-time') }}</span>
          </BaseHeading>
        </div>
        <div class="flex space-x-4">
          <div class="w-full">
            <!-- Created Student Online Status Chart -->
            <AddonApexcharts v-bind="studentOnlineStatus" />
          </div>
        </div>
      </BaseCard>
    </div>

    <div class="mb-6 mt-6 flex gap-4">
      <BaseCard class="lg:w-3/8 relative p-6">
        <div class="mb-6">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>{{ $t('time_for_the_exams') }}</span>
          </BaseHeading>
        </div>
        <div class="flex space-x-4">
          <div class="w-full">
            <AddonApexcharts v-bind="examTimeChart" />
          </div>
        </div>
      </BaseCard>

      <BaseCard class="lg:w-2/8 relative p-6">
        <div class="mb-10 flex items-center justify-between">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>{{ $t('goal_overview') }}</span>
          </BaseHeading>
        </div>
        <div class="mb-6">
          <AddonApexcharts v-bind="completedExamsChart" />
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

      <BaseCard class="lg:w-3/8 relative p-6">
        <div class="flex items-center justify-center">
          <div class="relative lg:w-1/2">
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              lead="tight"
              class="text-muted-800 dark:text-white"
            >
              <span>{{ $t('success_rate_in_exams') }}</span>
            </BaseHeading>

            <BaseParagraph size="sm" class="mb-6 text-muted-500">
              <span>{{ $t('at_the_college_level') }}</span>
            </BaseParagraph>
            <div
              class="mb-2 flex items-center gap-2 rounded-md bg-muted-100/80 px-5 py-10 dark:bg-muted-700"
            >
              <BaseParagraph size="md" class="mb-2">
                <span class="text-muted-800">{{ $t('number_of_students_who_took_the_exam') }}</span>
                <span class="block font-semibold text-muted-800">200 {{ $t('students') }}</span>
              </BaseParagraph>
            </div>
            <div
              class="flex items-center gap-2 rounded-md bg-muted-100/80 px-5 py-10 dark:bg-muted-700"
            >
              <BaseParagraph size="md" class="mb-2">
                <span class="text-muted-800">{{ $t('number_of_students_who_passed_it') }}</span>
                <span class="block font-semibold text-muted-800">157 {{ $t('students') }}</span>
              </BaseParagraph>
            </div>
          </div>
          <div class="relative p-6 lg:w-1/2">
            <AddonApexcharts v-bind="examSuccessRateChart" />
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
