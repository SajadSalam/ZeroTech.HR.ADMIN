<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import ExamCurve from '~/views/exams/components/ExamCurve.vue'
import { useExamStore } from '~/views/exams/store'
import type { ExamDetailed } from '~/views/exams/types'
import { tableHeaders } from '~/views/students'
import type { Student, StudentFilters } from '~/views/students/types'
import { StudentStatus } from '~/views/students/types'

definePageMeta({
  title: 'student-page',
  description: 'manage-students',
})
const props = defineProps<{
  examId: string | number
}>()

const examStore = useExamStore()
const route = useRoute()
const examId = computed(() => route.params.id)
const exam = ref<ExamDetailed | null>(null)
const students = ref<Student[]>([])
const total = ref(0)
const filters = ref<StudentFilters>({
  pageSize: 50,
  pageNumber: 1,
  search: '',
  universityIDNumber: '',
})
const getStudents = async () => {
  const res = await examStore.getStudents(examId.value.toString(), filters.value)

  students.value = res?.students || []
  total.value = res?.pagesCount || 0
}
onMounted(async () => {
  exam.value = (await examStore.getById(examId.value.toString())) as ExamDetailed
  getStudents()
})
watch(
  filters,
  () => {
    getStudents()
  },
  { deep: true }
)
const i18n = useI18n()
const studentStatus = (student: Student) => {
  switch (student.status) {
    case StudentStatus.NOT_TAKEN:
      return i18n.t('not-taken')
    case StudentStatus.PASSED:
      return i18n.t('passed')
    case StudentStatus.FAILED:
      return i18n.t('failed')
    case StudentStatus.ABSENCE:
      return i18n.t('absence')
    default:
      return i18n.t('not-taken')
  }
}
const addCurveAction = async () => {
  examStore.isCurveDialogOpen = true
}
</script>

<template>
  <div v-if="exam != null" class="flex items-center justify-between rounded-lg bg-white p-5">
    <div>
      <h1 class="fonte-bold text-3xl">
        <span class="font-bold text-primary-500">
          {{ exam.title }}
        </span>

        <span class="ms-2 text-2xl text-muted-500">
          {{ $t('student-in-the-exam') }}
        </span>
      </h1>
      <p class="text-md text-gray mt-1">
        {{ $t('display-the-students-who-are-taking-the-exam') }}
      </p>
    </div>
  </div>
  <hr class="my-5" >
  <AppCrud v-model:current-page="filters.pageNumber" pagination :total-pages="total" hide-create>
    <template #headerActions>
      <BaseButton class="gap-1" color="primary" @click="addCurveAction">
        <Icon name="ph-plus-circle-duotone" size="20" />
        {{ $t('curve') }}
      </BaseButton>
    </template>
    <template #filters>
      <BaseInput v-model="filters.search" :placeholder="$t('search')" />
      <BaseInput v-model="filters.universityIDNumber" :placeholder="$t('university-id-number')" />
      <AppAutoCompleteField
        v-model="filters.organizationalStructureId"
        fetch-on-search
        search-key="search"
        :placeholder="$t('organizational-structure')"
        get-url="ums/organizational-structure/tree?parentId=1"
        item-label="fullNameAr"
        item-value="id"
      />
    </template>
    <AppTable
      title="Exams"
      :headers="tableHeaders($t)"
      :items="students"
      :is-loading="examStore.isLoading"
    >
      <template #data-gender="{ item }">
        {{ item.gender == 1 ? $t('male') : $t('female') }}
      </template>
      <template #data-grade="{ item }">
        <span class="font-bold">
          {{ item.grade }}
        </span>

        / {{ exam?.examTemplate.successGrade }}
      </template>
      <template #data-status="{ item }">
        <BaseTag variant="pastel" :color="item.status == 2 ? 'success' : 'danger'">
          {{ studentStatus(item) }}
        </BaseTag>
      </template>
    </AppTable>
  </AppCrud>
  <ExamCurve :exam-id="examId" />
</template>

<style></style>
