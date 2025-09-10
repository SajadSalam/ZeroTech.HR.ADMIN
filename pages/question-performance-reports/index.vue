<script lang="ts" setup>
import {
  useQuestionSuccessRateChart,
  useMostDifficultQuestionsChart,
} from '~/views/question-performance-reports/composables/chart.config'

definePageMeta({
  title: 'question-performance-reports',
  description: 'question-performance-reports-description',
})

const questionSuccessRateChart = reactive(useQuestionSuccessRateChart())
const mostDifficultQuestionsChart = reactive(useMostDifficultQuestionsChart())
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
          <span>{{ $t('question-success-rate') }}</span>
        </BaseHeading>
      </div>
      <div class="flex space-x-4">
        <div class="w-full">
          <AddonApexcharts v-bind="questionSuccessRateChart" />
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
          <span>{{ $t('most-difficult-questions') }}</span>
        </BaseHeading>
      </div>
      <div class="flex space-x-4">
        <div class="w-full">
          <AddonApexcharts v-bind="mostDifficultQuestionsChart" />
        </div>
      </div>
    </BaseCard>
  </div>
</template>
