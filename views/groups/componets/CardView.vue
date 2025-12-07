<script lang="ts" setup>
import type { GroupDto } from '../types'
import { useGroupStore } from '~/views/groups/store'
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'
import { useAuthStore } from '~/views/auth/store/auth'
import OrganizationalStructureDialog from '~/views/groups/componets/OrganizationalStructureDialog.vue'

// Component props and stores
const props = defineProps<{
  group: GroupDto
}>()
const { hasPrivilege } = useAuthStore()
const groupStore = useGroupStore()

// State management
const isDialogOpen = defineModel({ default: false })
const showAll = ref(false)

// Computed properties
const groupTags = computed(() => props.group.organizationalStructures || [])

const visibleGroups = computed(() =>
  showAll.value ? groupTags.value : groupTags.value.slice(0, 4)
)

const hiddenCount = computed(() => Math.max(0, groupTags.value.length - 4))

const shouldShowViewToggle = computed(() => groupTags.value.length > 4)

const canUpdate = computed(() => hasPrivilege('ums:ems:groups:update'))
const canDelete = computed(() => hasPrivilege('ums:ems:groups:delete'))
const canManage = computed(() => canUpdate.value || canDelete.value)
const emits = defineEmits<{
  (event: 'update:openEdit', group: GroupDto): void
}>()
const openEdit = async (group: GroupDto) => {
  emits('update:openEdit', group)
}
</script>

<template>
  <div class="pa-3 rounded-xl bg-white border">
    <!-- Header with group name and actions -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <BaseIconBox color="primary" variant="pastel">
          <Icon name="tabler:users-group" size="18" />
        </BaseIconBox>
        <!--  <span class="text-lg font-semibold">{{ group.name }}</span> -->
      </div>
      <div class="flex items-center">
        <AppCrudActions
        v-if="canManage"
        :item="group"
        :delete-service="groupStore.deleteGroup"
        :edit-button-action="() => openEdit(group)"
        :hide-delete="!canDelete"
        :hide-update="false"
        />
        <slot name="actions" />
      </div>
    </div>
      
    <!-- Organizational structure tags -->
    <div class="mt-2 flex flex-col items-center justify-center text-center">
      <h1 class="my-5 text-3xl font-semibold">
        {{ group.name }}
      </h1>
      <div class="flex flex-wrap items-center justify-center gap-3">
        <template v-if="groupTags.length">
          <span
            v-for="org in visibleGroups"
            :key="org.id"
            class="rounded-full bg-gray-200 px-2 py-1 text-sm"
          >
            {{ org.fullNameAr }}
          </span>

          <!-- +X Tag for hidden items -->
          <BaseTag
            v-if="!showAll && hiddenCount > 0"
            size="md"
            class="pa-3 flex items-center gap-1 text-lg"
            color="primary"
            variant="pastel"
          >
            +{{ hiddenCount }}
          </BaseTag>
        </template>
        <span v-else class="text-sm text-gray-500">-</span>
      </div>

      <!-- View all button -->
      <BaseButton
        v-if="shouldShowViewToggle"
        color="primary"
        variant="pastel"
        class="mt-5 w-full"
        @click="isDialogOpen = true"
      >
        <Icon name="tabler-eye" class="mr-2" />
        {{ $t('view_all') }}
      </BaseButton>

      <!-- Dialog for viewing all structures -->
      <OrganizationalStructureDialog
        v-model="isDialogOpen"
        :title="group.name"
        :structures="groupTags"
      />
    </div>
  </div>
</template>
