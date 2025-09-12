<script setup lang="ts">
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'
import AppTable from '~/components/app-table/AppTable.vue'
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import type { BaseFilters } from '~/utils/types/ApiResponses'
import { useAuthStore } from '~/views/auth/store/auth'
import { tableHeader } from '~/views/examination-centers/halls'
import AssignSupervisor from '~/views/examination-centers/halls/components/AssignSupervisor.vue'
import CreateHall from '~/views/examination-centers/halls/components/HallCreate.vue'
import EditHall from '~/views/examination-centers/halls/components/HallEdit.vue'
import { useHallStore } from '~/views/examination-centers/halls/store'
import type { Hall, HallDto } from '~/views/examination-centers/halls/types'

definePageMeta({
  title: 'examination-centers',
  description: 'create-and-manage-examination-centers',
})
const {id} = useRoute().params
const hallsStore = useHallStore()
const appTableStore = useAppTableStore()
const isLoading = computed(() => hallsStore.isLoading)
const halls = computed(() => hallsStore.halls || [])
const filters = computed<BaseFilters>({
  get() {
    return hallsStore.filters
  },
  set(value: BaseFilters) {
    hallsStore.filters = value
  },
})

const getHalls = async () => {
  appTableStore.setLoading(true)

  filters.value.examCenterId = id as string
  await hallsStore.getHalls(filters.value)
  appTableStore.setLoading(false)
}
getHalls()
watch(
  filters,
  () => {
    getHalls()
  },
  { deep: true }
)
const openEdit = (item: HallDto) => {
  hallsStore.selectedHall = item
  hallsStore.isEditDialogOpen = true
}
const openAssignSupervisor = (item: HallDto) => {
  hallsStore.selectedHall = item
  hallsStore.isAssignSupervisorDialogOpen = true
}
const deleteHall = async (item: HallDto) => {
  await hallsStore.deleteHall(item.id)
}
const { hasPrivilege } = useAuthStore()
</script>

<template>
  <div>
    <AppCrud
      v-model:current-page="filters.pageNumber"
      :add-button-text="$t('create-hall')"
      :add-btn-action="() => (hallsStore.isCreateDialogOpen = true)"
      :pagination="true"
      :total-pages="hallsStore.totalPages"
      :title="$t('halls')"
      :hide-create="!hasPrivilege('ums:ems:examcenter:create')"
    >
      <!-- Search filter -->
      <template #filters>
        <BaseInput v-model="filters.search" :placeholder="$t('search')" />
      </template>
      <AppTable
        title="Halls"
        :headers="tableHeader($t)"
        :items="halls"
        :is-loading="isLoading"
      >
        <template #data-actions="{ item }">
          <div class="flex gap-2 items-center">
            <AppCrudActions
            :delete-service="() => deleteHall(item)"
            :hide-delete="!hasPrivilege('ums:ems:examcenter:delete')"
            :hide-update="!hasPrivilege('ums:ems:examcenter:update')"
            :item="item"
            :edit-button-action="() => openEdit(item)"
          />

          <BaseButton color="primary" @click="openAssignSupervisor(item)">
            {{ $t('assign-supervisor') }}
          </BaseButton>
          <BaseButton color="info" :to="`/examination-centers/${id}/hall/${item.id}`">
            <Icon name="ph:eye-duotone" class="size-4" />
            {{ $t('exam_supervision') }}
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
    <CreateHall />
    <EditHall />
    <AssignSupervisor />
  </div>
</template>
