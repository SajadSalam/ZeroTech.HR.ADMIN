<script setup lang="ts">
// Import dependencies
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import AppTable from '~/components/app-table/AppTable.vue'
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'
import { useGroupStore } from '~/views/groups/store'
import { useAuthStore } from '~/views/auth/store/auth'
import { tableHeader } from '~/views/groups'
import type { GroupDto, GroupsFilters } from '~/views/groups/types'
import GroupCreate from '~/views/groups/componets/GroupCreate.vue'
import CardView from '~/views/groups/componets/CardView.vue'
import OrganizationalStructureDialog from '~/views/groups/componets/OrganizationalStructureDialog.vue'
import GroupEdit from '~/views/groups/componets/GroupEdit.vue'

definePageMeta({
  title: 'groups',
  description: 'create-and-manage-groups',
})

// Enum for view types
enum ViewType {
  Card = 'card',
  Table = 'table',
}

// Store initializations
const groupStore = useGroupStore()
const appTableStore = useAppTableStore()
const { hasPrivilege } = useAuthStore()

// Reactive state
const viewType = ref<ViewType>(ViewType.Table)
const isDialogOpen = ref(false)
const selectedGroup = ref<GroupDto | null>(null)
const showAll = reactive<Record<number, boolean>>({})

// Computed properties
const isLoading = computed(() => groupStore.isLoading)
const groups = computed(() => groupStore.groups || [])
const filters = computed<GroupsFilters>({
  get() {
    return groupStore.filters
  },
  set(value: GroupsFilters) {
    groupStore.filters = value
  },
})

const canCreateGroup = computed(() => hasPrivilege('ums:ems:groups:create'))
const canDeleteGroup = computed(() => hasPrivilege('ums:ems:groups:delete'))

// Methods
const toggleViewType = () => {
  viewType.value = viewType.value === ViewType.Table ? ViewType.Card : ViewType.Table
}

const openStructureDialog = (group: GroupDto) => {
  selectedGroup.value = group
  isDialogOpen.value = true
}

const getGroups = async () => {
  appTableStore.setLoading(true)
  await groupStore.getGroups(filters.value)
  appTableStore.setLoading(false)
}

const openEdit = async (group: GroupDto) => {
  groupStore.selectedGroup = group
  groupStore.selectedGroupId = group.id
  groupStore.isEditDialogOpen = true
}

// Initialize data
getGroups()

// Watchers
watch(
  filters,
  () => {
    getGroups()
  },
  { deep: true }
)
</script>

<template>
  <div>
    <AppCrud
      v-model:current-page="filters.pageNumber"
      :add-button-text="$t('create-group')"
      :add-btn-action="() => (groupStore.isCreateDialogOpen = true)"
      :pagination="true"
      :total-pages="groupStore.totalPages"
      :hide-create="!canCreateGroup"
      :title="$t('groups')"
    >
      <!-- View toggle button -->
      <template #headerActions>
        <BaseButton color="none" variant="outline" @click="toggleViewType">
          <Icon
            :name="viewType === ViewType.Table ? 'ph-grid-four-duotone' : 'ph-list-duotone'"
            size="18"
          />
          {{ $t(viewType === ViewType.Table ? 'card-view' : 'table-view') }}
        </BaseButton>
      </template>

      <!-- Search filter -->
      <template #filters>
        <BaseInput v-model="filters.search" :placeholder="$t('search')" />
      </template>

      <!-- Table view -->
      <AppTable
        v-if="viewType === ViewType.Table"
        title="Groups"
        :headers="tableHeader($t)"
        :items="groups"
        :is-loading="isLoading"
      >
        <!-- Actions column -->
        <template #data-actions="{ item }">
          <div class="flex items-center justify-center">
          <AppCrudActions
            :hide-update="false"
            :edit-button-action="() => openEdit(item)"
            :item="item"
            :hide-delete="!canDeleteGroup"
            :delete-service="groupStore.deleteGroup"
          />
          
          <AuditLogBtn :entity-id="item.id" />
          </div>
        </template>

        <!-- Organizational structures column -->
        <template #data-organizationalStructures="{ item }">
          <div class="flex flex-wrap items-center justify-center gap-2">
            <span
              v-for="org in item.organizationalStructures.slice(0, 3)"
              :key="org.id"
              class="rounded-full bg-gray-200 px-2 py-1 text-sm"
            >
              {{ org.fullNameAr }}
            </span>

            <BaseButton
              v-if="item.organizationalStructures.length > 3"
              color="primary"
              variant="pastel"
              size="sm"
              @click="openStructureDialog(item)"
            >
              <Icon name="tabler-eye" class="mr-2" />
              {{ $t('view_all') }}
            </BaseButton>
          </div>
        </template>
      </AppTable>

      <!-- Card view -->
      <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <CardView
          v-for="group in groups"
          :key="group.id"
          :group="group"
          @update:open-edit="openEdit"
        >
          <template #actions>
            <AuditLogBtn :entity-id="group.id" />
          </template>
        </CardView>
      </div>
    </AppCrud>

    <!-- Modals and dialogs -->
    <GroupCreate />
    <GroupEdit />
    <OrganizationalStructureDialog
      v-if="selectedGroup"
      v-model="isDialogOpen"
      :title="selectedGroup.name"
      :structures="selectedGroup.organizationalStructures"
    />
  </div>
</template>
