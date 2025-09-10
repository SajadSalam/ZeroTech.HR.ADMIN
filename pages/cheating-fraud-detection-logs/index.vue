<script lang="ts" setup>
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import {
  useCheatingFraudDetectionLogs,
  useDetectedCheatingCases,
} from '~/views/cheating-fraud-detection-logs/composables/chart.config'
import { useCheatingFraudDetectionLogsStore } from '~/views/cheating-fraud-detection-logs/store'
import type { CheatingFraudDetectionLogsFilters } from '~/views/cheating-fraud-detection-logs/types'
import { tableHeader } from '~/views/cheating-fraud-detection-logs'
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'

definePageMeta({
  title: 'cheating-fraud-detection-logs',
  description: 'cheating-fraud-detection-logs-description',
})

const appTableStore = useAppTableStore()
const cheatingFraudDetectionLogsStore = useCheatingFraudDetectionLogsStore()
const cheatingFraudDetectionLogsChart = reactive(useCheatingFraudDetectionLogs())
const detectedCheatingCases = reactive(useDetectedCheatingCases())

const filters = computed<CheatingFraudDetectionLogsFilters>({
  get() {
    return cheatingFraudDetectionLogsStore.filters
  },
  set(value: CheatingFraudDetectionLogsFilters) {
    cheatingFraudDetectionLogsStore.filters = value
  },
})
const getCheatingFraudDetectionLogs = async () => {
  appTableStore.setLoading(true)
  await cheatingFraudDetectionLogsStore.getCheatingFraudDetectionLogs(filters.value)
  appTableStore.setLoading(false)
}
getCheatingFraudDetectionLogs()
watch(
  filters,
  () => {
    getCheatingFraudDetectionLogs()
  },
  { deep: true }
)
</script>

<template>
  <div>
    <div class="mb-6 flex gap-4">
      <BaseCard class="relative p-6 lg:w-2/3">
        <div class="mb-6">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>{{ $t('fraud-detection-trend') }}</span>
          </BaseHeading>
        </div>
        <div class="flex space-x-4">
          <!-- Created Cheating Fraud Detection Logs Chart -->
          <div class="w-full">
            <AddonApexcharts v-bind="cheatingFraudDetectionLogsChart" />
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
            <span>{{ $t('detected-cheating-cases') }}</span>
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
              $t('multiple-faces-detected')
            }}</BaseParagraph>
            <BaseHeading as="h5" size="md">144</BaseHeading>
          </div>
          <div>
            <BaseParagraph size="xs" class="mb-1 text-muted-400">{{
              $t('tab-switching')
            }}</BaseParagraph>
            <BaseHeading as="h5" size="md">1055</BaseHeading>
          </div>
        </div>
        <div class="mt-auto sm:px-4">
          <AddonApexcharts v-bind="detectedCheatingCases" />
        </div>
      </BaseCard>
    </div>

    <AppCrud pagination :total-pages="cheatingFraudDetectionLogsStore.totalPages" hide-create>
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
        title="cheatingFraudDetectionLogsStore"
        :headers="tableHeader($t)"
        :items="cheatingFraudDetectionLogsStore.cheatingFraudDetectionLogs"
        :is-loading="appTableStore.isLoading"
      >
        <template #data-actions="{ item }">
          <AppCrudActions :item="item" />
        </template>
        <template #data-status="{ item }">
          <BaseTag :color="item.status == 'flagged' ? 'danger' : 'info'" variant="pastel">
            <span v-if="item.status == 'flagged'" class="flex items-center gap-1">
              <Icon name="tabler-flag" size="18" /> {{ $t('flagged') }}
            </span>
            <span v-else-if="item.status == 'under-review'" class="flex items-center gap-1">
              <Icon name="tabler-eye" size="18" /> {{ $t('under-review') }}
            </span>
          </BaseTag>
        </template>
      </AppTable>
    </AppCrud>
  </div>
</template>
