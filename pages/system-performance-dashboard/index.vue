<script lang="ts" setup>
import {
  useServerLoadChart,
  useApiResponseTimesChart,
} from '~/views/system-performance-dashboard/composables/chart.config'

definePageMeta({
  title: 'system-performance-dashboard',
  description: 'system-performance-dashboard-description',
})

const serverLoadChart = reactive(useServerLoadChart())
const apiResponseTimesChart = reactive(useApiResponseTimesChart())
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
          <span>{{ $t('server-load') }}</span>
        </BaseHeading>
      </div>
      <div class="flex space-x-4">
        <div class="w-full">
          <AddonApexcharts v-bind="serverLoadChart" />
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
          <span>{{ $t('api-response-times') }}</span>
        </BaseHeading>
      </div>
      <div class="flex space-x-4">
        <div class="w-full">
          <AddonApexcharts v-bind="apiResponseTimesChart" />
        </div>
      </div>
    </BaseCard>
  </div>
</template>
