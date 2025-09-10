<script lang="ts" setup>
import {
  useExamPerformanceReport,
  useMostDifficultSubjectsChart,
} from '~/views/exam-manager-reports/composables/chart.config'

definePageMeta({
  title: 'exam-manager-reports',
  description: 'exam-manager-reports-description',
})

const evaluatorPerformanceLetterChart = reactive(useExamPerformanceReport())
const mostDifficultSubjectsChart = reactive(useMostDifficultSubjectsChart())
</script>

<template>
  <div>
    <BaseCard class="relative p-6">
      <div class="mb-6">
        <BaseHeading
          as="h3"
          size="md"
          weight="semibold"
          lead="tight"
          class="text-muted-800 dark:text-white"
        >
          <span>{{ $t('exam-schedule') }}</span>
        </BaseHeading>
      </div>
      <div class="flex space-x-4">
        <div class="w-full">
          <AddonApexcharts v-bind="evaluatorPerformanceLetterChart" />
        </div>
      </div>
    </BaseCard>
    <div class="mb-6 mt-2 flex gap-4">
      <BaseCard class="relative mt-6 p-6">
        <div class="mb-6">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>{{ $t('student-registration-report') }}</span>
          </BaseHeading>
        </div>
        <div class="flex space-x-4">
          <div class="w-full">
            <AddonApexcharts v-bind="mostDifficultSubjectsChart" />
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
