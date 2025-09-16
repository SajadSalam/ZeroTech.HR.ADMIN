<script lang="ts" setup>
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { useAuthStore } from '~/views/auth/store/auth'
import ExamCreate from '~/views/exams/components/ExamCreate.vue'
import ExamDetails from '~/views/exams/components/ExamDetails.vue'
import ExamEdit from '~/views/exams/components/ExamEdit.vue'
import { tableHeaders } from '~/views/exams/index'
import { useExamStore } from '~/views/exams/store/index'
import { examStatusOptions, examTypesOptions, type ExamFilters } from '~/views/exams/types/index'

definePageMeta({
  title: 'exams-page',
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
  <div>
    <AppCrud
      pagination
      v-model:current-page="filters.pageNumber"
      :total-pages="examStore.totalPages"
      :add-btn-action="() => (examStore.isCreateDialogOpen = true)"
      :add-button-text="$t('create-exams')"
      :hide-create="!hasPrivilege('ums:ems:exam:create')"
    >
      <template #filters>
        <BaseInput :placeholder="$t('search')" v-model="filters.search" />
        <AppAutoCompleteField
          fetchOnSearch
          searchKey="search"
          :placeholder="$t('blueprint')"
          get-url="/examtemplate"
          item-label="name"
          item-value="id"
          v-model="filters.examTemplateId"
        />
        <AppAutoCompleteField
          :placeholder="$t('status')"
          :items="examStatusOptions($t)"
          item-label="label"
          item-value="value"
          v-model="filters.status"
        />
        <AppAutoCompleteField
          :placeholder="$t('exam-type')"
          :items="examTypesOptions($t)"
          item-label="label"
          item-value="value"
          v-model="filters.type"
        />
      </template>
      <AppTable title="Exams" :headers="tableHeaders($t)" :items="exams">
        <template #data-actions="data">
          <div class="flex items-center justify-center gap-2">
            <AppCrudActions
              :item="data.item"
              :delete-service="examStore.deleteExam"
              :edit-button-action="
                () => {
                 isUpdateDialogOpen = true;
                  examId = data.item.id;
                }
              "
              :hide-delete="!hasPrivilege('ums:ems:exam:delete')"
              :hide-update="!hasPrivilege('ums:ems:exam:update')"
            />
            <BaseButtonIcon
              :data-nui-tooltip="$t('view')"
              rounded="full"
              size="sm"
              color="primary"
              variant="outline"
              @click="openExamDetails(data.item)"
            >
              <Icon name="ph:eye" size="18" />
            </BaseButtonIcon>

            <BaseDropdown
              variant="context"
              :data-nui-tooltip="$t('actions')"
              placement="bottom-start"
              size="md"
            >
              <BaseDropdownItem
                :to="`/exams/${data.item.id}/students`"
                v-if="hasPrivilege('ums:ems:exam:view-linked-exams')"
              >
                <template #start>
                  <Icon name="ph:users" class="text-warning" size="18"></Icon>
                  {{ $t("students") }}
                </template>
              </BaseDropdownItem>
              <BaseDropdownItem
                :to="`/exams/${data.item.id}/view`"
                v-if="hasPrivilege('ums:ems:exam:view')"
              >
                <template #start>
                  <Icon name="ph:question" class="text-green-500" size="18"></Icon>
                  {{ $t("questions") }}
                </template>
              </BaseDropdownItem>
            </BaseDropdown>
          </div>
        </template>
        <template #data-orgnaizations="{ item }">
          {{ item.orgnaizations.join(", ") }}
        </template>
        <template #data-templateName="{ item }">
          {{ item.examTemplate.name }}
        </template>
        <template #data-examType="{ item }">
          {{ examTypesOptions($t).find((type) => type.value === item.examType)?.label }}
        </template>
        <template #data-time="{ item }">
          {{ item.startTime }} - {{ item.endTime }}
        </template>
        <template #data-attendance>
          {{ Math.floor(Math.random() * 100) }}
        </template>
        <template #data-pass>
          {{ Math.floor(Math.random() * 100) }}
        </template>
        <template #data-fail>
          {{ Math.floor(Math.random() * 100) }}
        </template>
        <template #data-startDate="{ item }">
          {{ item.startDate.split("T")[0] }}
        </template>
        <template #data-endDate="{ item }">
          {{ item.endDate.split("T")[0] }}
        </template>
      </AppTable>
    </AppCrud>
  </div>
  <ExamCreate />
  <ExamDetails v-model="isExamDialogOpen" :examId="examId" />
  <ExamEdit v-model="isUpdateDialogOpen" :examId="examId" />
</template>
<style></style>
