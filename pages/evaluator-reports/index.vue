<script lang="ts" setup>
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import { useEvaluationSpeedTrends } from '~/views/evaluator-reports/composables/chart.config'
import { useEvaluatorPerformanceStore } from '~/views/evaluator-reports/store'
import type { EvaluatorPerformanceFilters } from '~/views/evaluator-reports/types'
import { tableHeader } from '~/views/evaluator-reports'
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'

definePageMeta({
  title: 'evaluator-reports',
  description: 'evaluator-report-description',
})

const appTableStore = useAppTableStore()
const evaluatorPerformanceStore = useEvaluatorPerformanceStore()
const evaluatorPerformanceLetterChart = reactive(useEvaluationSpeedTrends())

const filters = computed<EvaluatorPerformanceFilters>({
  get() {
    return evaluatorPerformanceStore.filters
  },
  set(value: EvaluatorPerformanceFilters) {
    evaluatorPerformanceStore.filters = value
  },
})
const getEvaluatorPerformances = async () => {
  appTableStore.setLoading(true)
  await evaluatorPerformanceStore.getEvaluatorPerformances(filters.value)
  appTableStore.setLoading(false)
}
getEvaluatorPerformances()
watch(
  filters,
  () => {
    getEvaluatorPerformances()
  },
  { deep: true }
)
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
          <span>{{ $t('evaluation-speed-trends') }}</span>
        </BaseHeading>
      </div>
      <div class="flex space-x-4">
        <!-- Created Exam Chart -->
        <div class="w-full">
          <AddonApexcharts v-bind="evaluatorPerformanceLetterChart" />
        </div>
      </div>
    </BaseCard>

    <AppCrud pagination :total-pages="evaluatorPerformanceStore.totalPages" hide-create>
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
        title="evaluatorPerformanceStore"
        :headers="tableHeader($t)"
        :items="evaluatorPerformanceStore.evaluatorPerformances"
        :is-loading="appTableStore.isLoading"
      >
        <template #data-type="{ item }">
          <span :class="item.type == 'internal' ? 'text-success-500' : 'text-primary-500'">
            {{ item.type == 'internal' ? $t('internal') : $t('external') }}
          </span>
        </template>
        <template #data-status="{ item }">
          <BaseTag :color="item.status == 'active' ? 'success' : 'danger'" variant="pastel">
            {{ item.status == 'active' ? $t('active') : $t('inactive') }}
          </BaseTag>
        </template>
      </AppTable>
    </AppCrud>
  </div>
</template>
