<script lang="ts" setup>
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import {
  useAuditLogsOverTimeChart,
  useUserActionsBreakdownChart,
} from '~/views/audit-logs-user-activity/composables/chart.config'
import { useAuditLogsUserActivityStore } from '~/views/audit-logs-user-activity/store'
import type { AuditLogsUserActivityFilters } from '~/views/audit-logs-user-activity/types'
import { tableHeader } from '~/views/audit-logs-user-activity'

definePageMeta({
  title: 'audit-logs-user-activity',
  description: 'audit-logs-user-activity-description',
})

const appTableStore = useAppTableStore()
const auditLogsUserActivityStore = useAuditLogsUserActivityStore()
const auditLogsOverTimeChart = reactive(useAuditLogsOverTimeChart())
const userActionsBreakdownChart = reactive(useUserActionsBreakdownChart())

const filters = computed<AuditLogsUserActivityFilters>({
  get() {
    return auditLogsUserActivityStore.filters
  },
  set(value: AuditLogsUserActivityFilters) {
    auditLogsUserActivityStore.filters = value
  },
})
const getAuditLogsUserActivity = async () => {
  appTableStore.setLoading(true)
  await auditLogsUserActivityStore.getAuditLogsUserActivities(filters.value)
  appTableStore.setLoading(false)
}
getAuditLogsUserActivity()
watch(
  filters,
  () => {
    getAuditLogsUserActivity()
  },
  { deep: true }
)
</script>

<template>
  <div>
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
            <span>{{ $t('audit-logs-over-time') }}</span>
          </BaseHeading>
        </div>
        <div class="flex space-x-4">
          <!-- Created Exam Chart -->
          <div class="w-full">
            <AddonApexcharts v-bind="auditLogsOverTimeChart" />
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
            <span>{{ $t('user-actions-breakdown') }}</span>
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
          <AddonApexcharts v-bind="userActionsBreakdownChart" />
        </div>
      </BaseCard>
    </div>

    <AppCrud pagination :total-pages="auditLogsUserActivityStore.totalPages" hide-create>
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
        title="auditLogsUserActivityStore"
        :headers="tableHeader($t)"
        :items="auditLogsUserActivityStore.auditLogsUserActivities"
        :is-loading="appTableStore.isLoading"
      >
        <template #data-actions="data">
          <div class="flex items-center justify-center gap-2">
            <BaseButtonIcon
              :data-nui-tooltip="$t('view')"
              rounded="full"
              size="sm"
              color="primary"
              variant="outline"
            >
              <Icon name="ph:eye" size="18" />
            </BaseButtonIcon>
          </div>
        </template>
      </AppTable>
    </AppCrud>
  </div>
</template>
