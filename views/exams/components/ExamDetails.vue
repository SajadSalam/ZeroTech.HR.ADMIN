<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from "vue-i18n";
import {
    AbsentStudentChart,
    FailStudentChart,
    PassedStudentChart,
    StudentChart,
} from '~/views/exams/composables/chart.config';
const { t } = useI18n();

import { useExamStore } from '../store/index';
import type { ExamDetail, ExamType } from '../types/index';
import { examTypesOptions } from '../types/index';
import ExamChart from './ExamChart.vue';
import ExamDetailCard from './ExamDetailCard.vue';
const props = defineProps<{
  modelValue: boolean
  examId: string | number
}>()

const absentStudentReportChart = reactive(AbsentStudentChart())
const failStudentReportChart = reactive(FailStudentChart())
const passedStudentReportChart = reactive(PassedStudentChart())
const studentReportChart = reactive(StudentChart())

const emit = defineEmits(['update:modelValue'])
const examObject = ref<ExamDetail | null>(null)

const examId = computed(() => {
  return props.examId
})
const examStore = useExamStore()


const examDetails = computed(() =>
  examObject.value
    ? [
        { label: 'title', value: examObject.value.title },
        { label: 'blueprint', value: examObject.value.examTemplate?.name },
        { label: 'duration_by_Minutes', value: examObject.value.duration },
        {
          label: 'allowed_time_for_entrance',
          value: examObject.value.enterTimeAllowed,
        },
        {
          label: 'starting_date',
          value: examObject.value.startDate?.split('T')[0] || '',
        },
        {
          label: 'ending_date',
          value: examObject.value.endDate?.split('T')[0] || '',
        },
        { label: 'start_time', value: examObject.value.startTime },
        { label: 'end_time', value: examObject.value.endTime },
        {
          label: 'exam_hall',
          value: examObject.value.examCenter?.name || '',
        },
        {
          label: 'exam_type',
          value: examTypeLabel.value || '',
        },
      ]
    : []
)

const examTypeLabel = computed(() => {
  return examTypesOptions(t).find(
    (type: { label: string; value: ExamType }) => type.value === examObject.value!.examType
  )?.label
})

const groups = computed(() => {
  return (examObject.value?.examGroups || []).map((group) => ({
    id: group.group.id,
    name: group.group.name,
  }))
}) as ComputedRef<{ id: string; name: string }[]>

onMounted(async () => {
  if (props.modelValue) {
    examObject.value = (await examStore.getById(examId.value.toString())) as ExamDetail
  }
});

watch(
  () => props.modelValue,
  async (newVal: boolean) => {
    if (newVal) {
      examObject.value = (await examStore.getById(examId.value.toString())) as ExamDetail
    }
  }
);
</script>

<template>
  <AppDialog
    :model-value="modelValue"
    :title="$t('exam_details')"
    overflow-y="visible"
    @update:model-value="emit('update:modelValue', $event)"
    size="3xl"
  >
    <div class="grid grid-cols-12 gap-6">
      <ExamChart
        title="student_count"
        count="1220"
        icon="ph:users-three-duotone"
        :chart-options="studentReportChart"
      />
      <ExamChart
        title="passed"
        count="1456"
        icon="ph:thumbs-up-duotone"
        :chart-options="passedStudentReportChart"
      />

      <ExamChart
        title="absent"
        count="200"
        icon="ph:question-duotone"
        :chart-options="absentStudentReportChart"
      />
      <ExamChart
        title="fail"
        count="300"
        icon="ph:x-square-duotone"
        :chart-options="failStudentReportChart"
      />

      <div class="relative col-span-12">
        <BaseCard class="p-6">
          <div class="grid grid-cols-12 gap-3">
            <template v-for="(detail, index) in examDetails" :key="index">
              <div
                class="col-span-12 sm:col-span-3 ptablet:col-span-6"
                :class="{ 'mt-5': index > 3 }"
              >
                <ExamDetailCard :label="detail.label" :value="detail.value" />
              </div>
            </template>

            <div class="col-span-12 mt-5 sm:col-span-3 ptablet:col-span-6">
              <div class="flex w-fit items-center gap-4 p-4 shadow-sm">
                <Icon name="ph:thumbs-up-duotone" class="size-7 text-primary-500" />
                <div>
                  <BaseHeading
                    tag="h2"
                    weight="medium"
                    class="text-sm text-muted-600 dark:text-muted-100"
                  >
                    {{ $t("groups") }}
                  </BaseHeading>
                  <BaseParagraph
                    size="xl"
                    lead="none"
                    class="text-800 text-sm font-semibold dark:text-white"
                  >
                    <div class="flex items-center justify-center flex-wrap gap-2">
                      <div v-if="groups.length > 0">
                        <span
                          v-for="g in groups"
                          :key="g.id"
                          class="bg-gray-200 px-2 py-1 rounded-full text-sm"
                        >
                          {{ g.name }}
                        </span>
                      </div>
                    </div>
                  </BaseParagraph>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </AppDialog>
</template>
