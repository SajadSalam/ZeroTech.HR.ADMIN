<script lang="ts" setup>
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { useAuthStore } from '~/views/auth/store/auth'
import CreateExamPage from '~/views/exams/components/CreateExamPage.vue'
import { tableHeaders } from '~/views/exams/index'
import { useExamStore } from '~/views/exams/store/index'
import { ExamType, availableDaysOptions, examTypesOptions, proficiencyExamGroupOptions, type ExamFilters } from '~/views/exams/types/index'

definePageMeta({
  title: 'create-exams',
  description: 'create-and-manage-exams',
})

const examStore = useExamStore()
const appTableStore = useAppTableStore()
const exams = computed(() => examStore.exams || [])
const isExamDialogOpen = ref(false);
const isUpdateDialogOpen = ref(false);
const examId = ref<string | number>('');



const filters = computed<ExamFilters>({
  get() {
    return examStore.filters
  },
  set(value: ExamFilters) {
    examStore.filters = value
  },
})
const getGroups = async () => {
  appTableStore.setLoading(true)
  await examStore.getExams(filters.value)
  appTableStore.setLoading(false)
}
getGroups()
watch(
  filters,
  () => {
    getGroups()
  },
  { deep: true }
)
const { hasPrivilege } = useAuthStore()
const openExamDetails = (exam: Record<string, any>) => {
  examId.value = exam.id
  isExamDialogOpen.value = true
}
</script>

<template>
  <div class="my-12 mx-4">
      <CreateExamPage />
  </div>
  
</template>
<style></style>
