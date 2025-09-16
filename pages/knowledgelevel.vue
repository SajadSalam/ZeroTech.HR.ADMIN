<script setup lang="ts">
import { computed, watch } from 'vue'
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppTable from '~/components/app-table/AppTable.vue'
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import { useAuthStore } from '~/views/auth/store/auth'
import { tableHeader } from '~/views/knowledgelevel'
import KnowledgelevelCreate from '~/views/knowledgelevel/components/KnowledgelevelCreate.vue'
import KnowledgelevelEdit from '~/views/knowledgelevel/components/KnowledgelevelEdit.vue'
import { useKnowledgelevelStore } from '~/views/knowledgelevel/store'
import type { KnowledgelevelDto, KnowledgelevelFilters } from '~/views/knowledgelevel/types'
definePageMeta({
  title: 'knowledgelevel',
  description: '',
})

const knowledgelevelStore = useKnowledgelevelStore()
const appTableStore = useAppTableStore()
const isLoading = computed(() => knowledgelevelStore.isLoading)
const knowledgelevels = computed(() => knowledgelevelStore.knowledgelevels || [])
const filters = computed<KnowledgelevelFilters>({
  get() {
    return knowledgelevelStore.filters
  },
  set(value: KnowledgelevelFilters) {
    knowledgelevelStore.filters = value
  },
})
const getKnowledgelevel = async () => {
  appTableStore.setLoading(true)
  await knowledgelevelStore.getKnowledgelevels(filters.value)
  appTableStore.setLoading(false)
}
getKnowledgelevel()
watch(
  filters,
  () => {
    getKnowledgelevel()
  },
  { deep: true }
)
const openEdit = (item: KnowledgelevelDto) => {}

const deleteKnowledgelevel = async (item: KnowledgelevelDto) => {
  await knowledgelevelStore.deleteKnowledgelevel(item.id)
}
// const { hasPrivilege } = useAuthStore()
const hasPrivilege = (privilege: string) => true
</script>

<template>
  <div>
    <AppCrud
      v-model:current-page="filters.pageNumber"
      :add-button-text="$t('create-knowledgelevel')"
      :add-btn-action="() => (knowledgelevelStore.isCreateDialogOpen = true)"
      :pagination="true"
      :total-pages="knowledgelevelStore.totalPages"
      :title="$t('knowledgelevel')"
      :hide-create="!hasPrivilege('ums:ems:knowledgelevel:create')"
    >
      <!-- Search filter -->
      <template #filters>
        <BaseInput v-model="filters.name" :placeholder="$t('search')" />
       
      </template>
      <AppTable title="Knowledgelevel" :headers="tableHeader($t)" :items="knowledgelevels" :is-loading="isLoading">
        <template #data-actions="data">
          <AppCrudActions
            :hide-delete="!hasPrivilege('ums:ems:knowledgelevel:delete')"
            :hide-update="!hasPrivilege('ums:ems:knowledgelevel:update')"
            :item="data.item"
            :edit-button-action="
              () => {
                knowledgelevelStore.selectedKnowledgelevel = data.item
                knowledgelevelStore.selectedKnowledgelevelId = data.item.id
                knowledgelevelStore.isEditDialogOpen = true
              }
            "
            :delete-service="knowledgelevelStore.deleteKnowledgelevel"
          />
        </template>
      </AppTable>
    </AppCrud>
    <KnowledgelevelCreate />
    <KnowledgelevelEdit />
  </div>
</template>
