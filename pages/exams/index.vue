<script lang="ts" setup>
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { formatDateTime } from '~/services/formatters'
import { useAuthStore } from '~/views/auth/store/auth'
import ExtendDuration from '~/views/exams/components/ExtendDuration.vue'
import ReshuffleQuestions from '~/views/exams/components/ReshuffleQuestions.vue'
import UpdateSchedule from '~/views/exams/components/UpdateSchedule.vue'
import { tableHeaders } from '~/views/exams/index'
import { useExamStore } from '~/views/exams/store/index'
import { type ExamDto, type ExamFilters } from '~/views/exams/types/index'

definePageMeta({
  title: 'exams-page',
  description: 'create-and-manage-exams',
})

const examStore = useExamStore()
const appTableStore = useAppTableStore()
const exams = computed(() => examStore.exams || [])


const filters = computed<ExamFilters>({
  get() {
    return examStore.filters
  },
  set(value: ExamFilters) {
    examStore.filters = value
  },
})
const getExams = async () => {
  appTableStore.setLoading(true)
  await examStore.getExams()
  appTableStore.setLoading(false)
}
getExams()
watch(
  filters,
  () => {
    getExams()
  },
  { deep: true }
)
const { hasPrivilege } = useAuthStore()
const handleExtendDuration = (exam: ExamDto) => {
  examStore.exam = exam
  examStore.isExtendDurationDialogOpen = true
}
const handleReshuffleQuestions = (exam: ExamDto) => {
  examStore.exam = exam
  examStore.isQuestionReshuffleDialogOpen = true
}
const handleUpdateSchedule = (exam: ExamDto) => {
  examStore.exam = exam
  examStore.isUpdateScheduleDialogOpen = true
}
</script>

<template>
  <div>
    <AppCrud pagination v-model:current-page="filters.page" :total-pages="examStore.totalPages"
      create-link="/exams/create-exam" :add-button-text="$t('create-exams')"
      :hide-create="!hasPrivilege('ums:ems:exam:create')">
      <template #filters>
        <BaseInput :placeholder="$t('search')" v-model="filters.search" />
        <AppAutoCompleteField fetchOnSearch searchKey="search" :placeholder="$t('blueprint')" get-url="/exam-templates"
          item-label="name" item-value="id" v-model="filters.examTemplateId" />
        <AppAutoCompleteField fetchOnSearch searchKey="name" :placeholder="$t('groups')" get-url="/groups/lookup"
          item-label="title" item-value="id" v-model="filters.groupId" without-data />
        </template>
      <template #additional-filters>
        <div class="flex gap-4">
          <AppFieldAppInputField v-model="filters.StartDateFrom" type="date" :label="$t('start-date-from')" />
          <AppFieldAppInputField v-model="filters.StartDateTo" type="date" :label="$t('start-date-to')" />
        </div>
      </template>
      <AppTable title="Exams" :headers="tableHeaders($t)" :items="exams">
        <template #data-actions="data">
          <div class="flex items-center justify-center gap-2">
            <BaseButton variant="pastel" color="success" @click="handleExtendDuration(data.item)"
              class="border-green-500 font-bold">
              <Icon name="ph:question" class="me-2" size="18"></Icon>
              {{ $t("extend-duration") }}
            </BaseButton>
            <BaseButton variant="pastel" color="warning" @click="handleReshuffleQuestions(data.item)"
              class="border-warning-500 font-bold">
              <Icon name="ph:question" class="me-2" size="18"></Icon>
              {{ $t("question-reshuffle") }}
            </BaseButton>
               <BaseButton variant="pastel" color="warning" @click="handleUpdateSchedule(data.item)"
              class="border-warning-500 font-bold">
              <Icon name="ph:question" class="me-2" size="18"></Icon>
              {{ $t("update-schedule") }}
            </BaseButton>
            <AuditLogBtn :entity-id="data.item.id" />
          </div>
        </template>
        <template #data-startAtUtc="{ item }">
          {{ formatDateTime(item.startAtUtc) }}
        </template>
        <template #data-durationMinutes="{ item }">
          <span v-if="item.startAtUtc && item.endAtUtc">
            {{ item.durationMinutes }} {{ $t('minutes') }}
          </span>
        </template>
      </AppTable>
    </AppCrud>
    <UpdateSchedule @refresh="getExams" />
    <ExtendDuration @refresh="getExams" />
    <ReshuffleQuestions @refresh="getExams" />
  </div>
</template>
<style></style>
