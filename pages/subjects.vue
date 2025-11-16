<script setup lang="ts">
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import type { BaseFilters } from '~/utils/types/ApiResponses'
import AppTable from '~/components/app-table/AppTable.vue'
import { useSubjectStore } from '~/views/subjects/store'
import { tableHeader } from '~/views/subjects'
import SubjectCreate from '~/views/subjects/components/SubjectCreate.vue'
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'
import SubjectEdit from '~/views/subjects/components/SubjectEdit.vue'
import type { Subject, SubjectDto, SubjectFilters } from '~/views/subjects/types'
import { useAuthStore } from '~/views/auth/store/auth'
definePageMeta({
  title: 'subjects',
  description: 'create-and-manage-subjects',
})

const subjectStore = useSubjectStore()
const appTableStore = useAppTableStore()
const isLoading = computed(() => subjectStore.isLoading)
const subjects = computed(() => subjectStore.subjects || [])
const filters = computed<SubjectFilters>({
  get() {
    return subjectStore.filters
  },
  set(value) {
    subjectStore.filters = value
  },
})
const getSubjects = async () => {
  appTableStore.setLoading(true)
  await subjectStore.getSubjects()
  appTableStore.setLoading(false)
}
const deleteItem = async (item: SubjectDto) => {
  await subjectStore.deleteSubject(item.id)
}
getSubjects()
watch(
  filters,
  () => {
    getSubjects()
  },
  { deep: true }
)
const openEdit = (item: SubjectDto) => {}
const { hasPrivilege } = useAuthStore()
</script>

<template>
  <div>
    <AppCrud
      :add-button-text="$t('add-new-subject')"
      :add-btn-action="() => (subjectStore.isCreateDialogOpen = true)"
      :pagination="true"
      :total-pages="subjectStore.totalPages"
      :title="$t('subjects')"
      :hide-create="!hasPrivilege('ums:ems:subjects:create')"
      @update:current-page="filters.pageNumber = $event"
    >
      <template #filters>
        <BaseInput v-model="filters.name" :placeholder="$t('search')" />
      </template>
      <AppTable
        title="Subjects"
        :headers="tableHeader($t)"
        :items="subjects"
        :is-loading="isLoading"
      >
        <template #data-actions="{ item }">
          <AppCrudActions
            :item="item"
            :hide-update="!hasPrivilege('ums:ems:subjects:update')"
            :hide-delete="!hasPrivilege('ums:ems:subjects:delete')"
            :edit-button-action="
              () => {
                subjectStore.selectedSubject = item
                subjectStore.selectedSubjectId = item.id
                subjectStore.isEditDialogOpen = true
              }
            "
            :delete-service="subjectStore.deleteSubject"
          />
        </template>
      </AppTable>
    </AppCrud>
    <SubjectCreate />
    <SubjectEdit />
  </div>
</template>
