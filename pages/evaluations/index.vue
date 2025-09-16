<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { formatDateTime } from '~/services/formatters'
import type { BaseFilters } from '~/utils/types/ApiResponses'
import { tableHeader } from '~/views/evaluations'
import { useEvaluationStore } from '~/views/evaluations/store'
import type { EvaluationFitlers } from '~/views/evaluations/types'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'

definePageMeta({
  title: 'evaluations',
  description: 'to-evaluate-questions',
})
const i18n = useI18n()

const evaluttionStore = useEvaluationStore()
const evaluations = computed(() => evaluttionStore.evaluations || [])
const appTableStore = useAppTableStore()
const isLoading = computed(() => evaluttionStore.isLoading)
const filters = computed<EvaluationFitlers>({
  get() {
    return evaluttionStore.filters
  },
  set(value: EvaluationFitlers) {
    evaluttionStore.filters = value
  },
})
const getEvaluations = async () => {
  appTableStore.setLoading(true)
  await evaluttionStore.getEvaluations(filters.value)
  appTableStore.setLoading(false)
}
getEvaluations()
watch(
  filters,
  () => {
    getEvaluations()
  },
  { deep: true }
)
const excelDownload = async () => {
  appTableStore.setLoading(true)
  await evaluttionStore.excelDownload(filters.value)
  appTableStore.setLoading(false)
}
watch(
  filters,
  () => {
    getEvaluations()
  },
  { deep: true }
)

const getNoDataMessage = computed(() => {
  const hasDateFilter = filters.value?.minDate || filters.value?.maxDate

  return {
    title: hasDateFilter ? 'no-data-found' : 'no-data-found',
    subtitle: hasDateFilter ? 'no_data_available_for_selected_period' : 'no-data-found-subtitle',
  }
})
</script>
<template>
  <div>
    <AppCrud
      v-model:current-page="filters.pageNumber"
      pagination
      :total-pages="evaluttionStore.totalPages"
      hide-create
    >
      <template #filters>
        <BaseInput v-model="filters.studentFullName" :placeholder="$t('search')" />
        <AppAutoCompleteField
          v-model="filters.examId"
          fetch-on-search
          search-key="title"
          :placeholder="$t('exam')"
          get-url="/exam"
          item-label="title"
          item-value="id"
        />
        <AppAutoCompleteField
          v-model="filters.groupId"
          fetch-on-search
          search-key="name"
          :placeholder="$t('groups')"
          get-url="/groups"
          item-label="name"
          item-value="id"
        />
        <BaseCheckbox v-model="filters.hasCurve" :label="$t('has_curve')" />
      </template>
      <template #headerActions>
        <BaseButtonIcon
          :loading="isLoading"
          :disabled="isLoading"
          :data-nui-tooltip="$t('Download')"
          rounded="full"
          color="none"
          @click="excelDownload"
        >
          <Icon name="carbon:document-download" size="23" />
        </BaseButtonIcon>
      </template>
      <template #additional-filters>
        <div class="flex gap-4">
          <AppFieldAppInputField v-model="filters.minDate" type="date" :label="$t('min_date')" />
          <AppFieldAppInputField v-model="filters.maxDate" type="date" :label="$t('max_date')" />
        </div>
      </template>
      <AppTable
        :title="$t('evaluations')"
        :headers="tableHeader($t)"
        :items="evaluations"
        :no-data-title="getNoDataMessage.title"
        :no-data-subtitle="getNoDataMessage.subtitle"
      >
        <template #data-subjects="{ item }">
          {{ item.exam.subjects.join(', ') }}
        </template>
        <template #data-creationDate="{ item }">
          {{ formatDateTime(item.creationDate) }}
        </template>
        <template #data-university="{ item }">
          {{ item.exam.orgnaizations.join(', ') }}
        </template>
        <template #data-actions="{ item }">
          <BaseButtonIcon
            :data-nui-tooltip="$t('view')"
            rounded="full"
            size="sm"
            color="primary"
            variant="outline"
            :to="`/evaluations/${item.exam.id}/${item.studentId}`"
          >
            <Icon name="ph:eye" size="18" />
          </BaseButtonIcon>
        </template>
      </AppTable>
    </AppCrud>
  </div>
</template>
<style></style>
