<script lang="ts" setup>
import {
  useExamCenterSeatUsageChart,
  useRealTimeSeatAllocationChart,
} from '~/views/exam-center-utilization-reports/composables/chart.config'

definePageMeta({
  title: 'exam-center-utilization-reports',
  description: 'exam-center-utilization-reports-description',
})

const examCenterSeatUsageChart = reactive(useExamCenterSeatUsageChart())
const realTimeSeatAllocationChart = reactive(useRealTimeSeatAllocationChart())
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
          <span>{{ $t('exam-center-seat-usage') }}</span>
        </BaseHeading>
      </div>
      <div class="flex space-x-4">
        <div class="w-full">
          <AddonApexcharts v-bind="examCenterSeatUsageChart" />
        </div>
      </div>
    </BaseCard>

    <BaseCard class="relative mb-6 mt-6 p-6">
      <div class="mb-6">
        <BaseHeading
          as="h3"
          size="md"
          weight="semibold"
          lead="tight"
          class="text-muted-800 dark:text-white"
        >
          <span>{{ $t('real-time-seat-allocation') }}</span>
        </BaseHeading>
      </div>
      <div class="flex space-x-4">
        <div class="w-full">
          <AddonApexcharts v-bind="realTimeSeatAllocationChart" />
        </div>
      </div>
    </BaseCard>
  </div>
</template>
