<script lang="ts" setup>
import {
  useAPIResponseTimesReport,
  useUserActionsBreaksDownReport,
  useAuditLogsOverTimeReport,
  useServerLoadReport,
} from '~/views/system-insights/composables/chart.config'

import StatCard from '~/components/StatCard.vue'

import { fakeData } from '~/views/system-insights/index'
import type { SystemInsightStateData } from '~/views/system-insights/types'
definePageMeta({
  title: 'system_insights',
  description: 'system_insights_report_description',
})

const aPIResponseTimesChart = reactive(useAPIResponseTimesReport())
const userActionsBreaksDownChart = reactive(useUserActionsBreaksDownReport())
const auditLogsOverTimeChart = reactive(useAuditLogsOverTimeReport())
const serverLoadChart = reactive(useServerLoadReport())

const statCardData = ref<SystemInsightStateData[]>([...fakeData])
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col justify-between md:flex-row md:items-center">
      <div
        class="flex max-w-[425px] flex-col items-center gap-4 md:flex-row lg:max-w-full ltablet:max-w-full"
      >
        <div>
          <BaseHeading as="h2" size="2xl" weight="light" lead="tight" class="dark:text-white">
            <span>{{ $t('system_insights') }}</span>
          </BaseHeading>
          <BaseParagraph>
            <span class="text-muted-500">{{ $t('dashboard_director_of_the_system') }}</span>
          </BaseParagraph>
        </div>
      </div>
      <div class="mt-4 flex items-center justify-center gap-2 md:mt-0 md:justify-start">
        <BaseButton color="primary">
          <span>{{ $t('export_reports') }}</span>
        </BaseButton>
      </div>
    </div>
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
            <span>{{ $t('api_response_times') }}</span>
          </BaseHeading>
        </div>
        <div class="flex space-x-4">
          <div class="w-full">
            <AddonApexcharts v-bind="aPIResponseTimesChart" />
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
            <span>{{ $t('user_actions_breakdown') }}</span>
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
          <AddonApexcharts v-bind="userActionsBreaksDownChart" />
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
            <span>{{ $t('audit_logs_over_time') }}</span>
          </BaseHeading>
        </div>
        <div class="flex space-x-4">
          <div class="w-full">
            <AddonApexcharts v-bind="auditLogsOverTimeChart" />
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
            <span>{{ $t('server_load') }}</span>
          </BaseHeading>
        </div>
        <div class="flex space-x-4">
          <div class="w-full">
            <AddonApexcharts v-bind="serverLoadChart" />
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
