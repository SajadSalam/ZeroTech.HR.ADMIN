<script setup lang="ts">
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'
import AppTable from '~/components/app-table/AppTable.vue'
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import type { BaseFilters } from '~/utils/types/ApiResponses'
import { useAuthStore } from '~/views/auth/store/auth'
import { tableHeader } from '~/views/examination-centers'
import AssignExamCenterManager from '~/views/examination-centers/componets/AssignExamCenterManager.vue'
import CreateExaminationCenter from '~/views/examination-centers/componets/CreateExaminationCenter.vue'
import EditExaminationCenter from '~/views/examination-centers/componets/EditExaminationCenter.vue'
import { useExaminationCenters } from '~/views/examination-centers/store'
import type { ExaminationCenterDto } from '~/views/examination-centers/types'

definePageMeta({
  title: 'examination-centers',
  description: 'create-and-manage-examination-centers',
})

const examinationCenterStore = useExaminationCenters()
const appTableStore = useAppTableStore()
const isLoading = computed(() => examinationCenterStore.isLoading)
const examinationCenters = computed(() => examinationCenterStore.examinationCenters || [])
const filters = computed<BaseFilters>({
  get() {
    return examinationCenterStore.filters
  },
  set(value: BaseFilters) {
    examinationCenterStore.filters = value
  },
})
const getExaminationCenters = async () => {
  appTableStore.setLoading(true)
  await examinationCenterStore.getExaminationCenters(filters.value)
  appTableStore.setLoading(false)
}
getExaminationCenters()
watch(
  filters,
  () => {
    getExaminationCenters()
  },
  { deep: true }
)
const openEdit = (item: ExaminationCenterDto) => {
  examinationCenterStore.selectedExaminationCenter = item
  examinationCenterStore.isEditDialogOpen = true
}
const openAssignExamCenterManager = (item: ExaminationCenterDto) => {
  examinationCenterStore.selectedExaminationCenter = item
  examinationCenterStore.isAssignExamCenterManagerDialogOpen = true
}
const deleteExaminationCenter = async (item: ExaminationCenterDto) => {
  await examinationCenterStore.deleteExaminationCenter(item.id)
}
const { hasPrivilege } = useAuthStore()
</script>

<template>
  <div>
    <AppCrud
      v-model:current-page="filters.pageNumber"
      :add-button-text="$t('create-examination-center')"
      :add-btn-action="() => (examinationCenterStore.isCreateDialogOpen = true)"
      :pagination="true"
      :total-pages="examinationCenterStore.totalPages"
      :title="$t('examination-centers')"
      :hide-create="!hasPrivilege('ums:ems:examcenter:create')"
    >
      <!-- Search filter -->
      <template #filters>
        <BaseInput v-model="filters.search" :placeholder="$t('search')" />
      </template>
      <AppTable
        title="ExaminationCenters"
        :headers="tableHeader($t)"
        :items="examinationCenters"
        :is-loading="isLoading"
      >
      <template #data-managerName="{ item }">
       <div class="flex items-center justify-center gap-2">
        <BaseTag
            v-if="item.managerName"
            color="warning"
            variant="pastel"
            
            class="cursor-pointer flex items-center gap-2 pa-2" 
            @click="openAssignExamCenterManager(item)"
        >
            {{ item.managerName }}
           <Icon  name="ph:pen-duotone" color="warning" class="size-4" />
        </BaseTag>
        <BaseTag
            v-if="!item.managerName"
            class="cursor-pointer flex items-center justify-center gap-2 pa-2" 
            @click="openAssignExamCenterManager(item)"
            color="info"
            variant="pastel"
       >
           <span v-if="!item.managerName">
             {{ $t('assign-exam-center-manager') }}
           </span>
           <Icon v-if="!item.managerName" name="ph:plus-circle-duotone" class="me-2 size-4" />
          </BaseTag> 
       </div>
      </template>
        <template #data-actions="{ item }">
          <div class="flex items-center justify-start W-full gap-2">
            <AppCrudActions
            :delete-service="() => deleteExaminationCenter(item)"
            :hide-delete="!hasPrivilege('ums:ems:examcenter:delete')"
            :hide-update="!hasPrivilege('ums:ems:examcenter:update')"
            :item="item"
            :edit-button-action="() => openEdit(item)"
          />

          
          <BaseButton size="sm" color="primary" :to="`/examination-centers/${item.id}/exams`">
            <Icon name="ph:eye" class="size-4" />
            {{ $t('view-examination-center') }}
          </BaseButton>
          </div>
        </template>
        <template #data-isActive="{ item }">
          <BaseTag :color="item.isActive ? 'success' : 'danger'" variant="pastel">
            {{ item.isActive ? $t('active') : $t('inactive') }}
          </BaseTag>
        </template>
      </AppTable>
    </AppCrud>
    <CreateExaminationCenter />
    <EditExaminationCenter />
    <AssignExamCenterManager />
  </div>
</template>
