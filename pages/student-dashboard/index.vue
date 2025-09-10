<script lang="ts" setup>
import {
  useExamPerformanceReport,
  useMostDifficultSubjectsReport,
} from '~/views/student-dashboard/composables/chart.config'

import DashboardHeader from '~/views/student-dashboard/components/DashboardHeader.vue'
import ExamCard from '~/views/student-dashboard/components/ExamCard.vue'
import ChartCard from '~/components/app-chart/ChartCard.vue'

import {
  studentDashboardHeaderData,
  todaysExamsData,
  notPerformedExamsData,
  performedExamsData,
} from '~/views/student-dashboard/index'
import type { StudentDashboardHeader, ExamsCard } from '~/views/student-dashboard/types/index'

definePageMeta({
  title: 'student_dashboard',
  description: 'student_dashboard_description',
})

const examPerformanceReport = reactive(useExamPerformanceReport())
const mostDifficultSubjectsReport = reactive(useMostDifficultSubjectsReport())

const dashboardHeaderData = ref<StudentDashboardHeader>({ ...studentDashboardHeaderData })
const todaysExams = ref<ExamsCard[]>([...todaysExamsData])
const notPerformedExams = ref<ExamsCard[]>([...notPerformedExamsData])
const performedExams = ref<ExamsCard[]>([...performedExamsData])
</script>

<template>
  <div>
    <DashboardHeader
      :title="dashboardHeaderData.title"
      :sub-title="dashboardHeaderData.subTitle"
      :button-text="dashboardHeaderData.buttonText"
    />

    <div class="flex gap-4">
      <ExamCard
        :avatar-text="todaysExams.length"
        title="todays_exams"
        status-class="block size-2 rounded-full bg-[#5030E5]"
        border-class="border-color-[#5030E5]"
        avatar-class="bg-indigo-400/20 text-indigo-400"
        :items="todaysExams"
      />
      <ExamCard
        :avatar-text="notPerformedExams.length"
        title="not_perform_it"
        status-class="block size-2 rounded-full bg-[#FFA500]"
        border-class="border-color-[#FFA500]"
        avatar-class="bg-indigo-400/20 text-indigo-400"
        :items="notPerformedExams"
      />
      <ExamCard
        :avatar-text="performedExams.length"
        title="performed"
        status-class="block size-2 rounded-full bg-[#8BC48A]"
        border-class="border-color-[#8BC48A]"
        avatar-class="bg-indigo-400/20 text-indigo-400"
        :items="performedExams"
      />
    </div>

    <div class="mb-6 mt-6 flex gap-6">
      <ChartCard title="exam_performance_report" :chart-config="examPerformanceReport" />

      <ChartCard
        title="most_difficult_subjects_report"
        :chart-config="mostDifficultSubjectsReport"
      />
    </div>
  </div>
</template>

<style>
.nui-progress.nui-progress-rounded-full {
  border-radius: 5px;
}
.nui-progress.nui-progress-rounded-full .nui-progress-bar {
  border-radius: 0px;
}
</style>
