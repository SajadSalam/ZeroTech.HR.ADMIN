<script lang="ts" setup>
import {
  useStudentOnlineStatus,
  useExamProgressOverview,
  useLiveExamCount,
} from '~/views/real-time-exam-monitoring/composables/chart.config'

definePageMeta({
  title: 'real-time-exam-monitoring',
  description: 'real-time-exam-monitoring-description',
})

const studentOnlineStatus = reactive(useStudentOnlineStatus())
const examProgressOverview = reactive(useExamProgressOverview())
const liveExamCount = reactive(useLiveExamCount())
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
          <span>{{ $t('student-online-status') }}</span>
        </BaseHeading>
      </div>
      <div class="flex space-x-4">
        <div class="w-full">
          <!-- Created Student Online Status Chart -->
          <AddonApexcharts v-bind="studentOnlineStatus" />
        </div>
      </div>
    </BaseCard>

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
            <span>{{ $t('exam-progress-overview') }}</span>
          </BaseHeading>
        </div>
        <div class="flex space-x-4">
          <div class="w-full">
            <!-- Created Exam Progress Overview Chart -->
            <AddonApexcharts v-bind="examProgressOverview" />
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
            <span>{{ $t('live-exam-count') }}</span>
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
            <BaseParagraph size="xs" class="mb-1 text-muted-400">{{ $t('active') }}</BaseParagraph>
            <BaseHeading as="h5" size="md">144</BaseHeading>
          </div>
          <div>
            <BaseParagraph size="xs" class="mb-1 text-muted-400">{{
              $t('completed')
            }}</BaseParagraph>
            <BaseHeading as="h5" size="md">1055</BaseHeading>
          </div>
        </div>
        <div class="mt-auto sm:px-4">
          <AddonApexcharts v-bind="liveExamCount" />
        </div>
      </BaseCard>
    </div>
  </div>
</template>
