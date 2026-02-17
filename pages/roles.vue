<script setup lang="ts">
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import AppTable from '~/components/app-table/AppTable.vue'
import { useRoleStore } from '~/views/roles/store'
import { tableHeader } from '~/views/roles'
import type { RoleDto, RoleFilters } from '~/views/roles/types'

definePageMeta({
    title: 'الأدوار',
    description: 'إدارة الأدوار',
})

const roleStore = useRoleStore()
const appTableStore = useAppTableStore()
const isLoading = computed(() => roleStore.isLoading)
const roles = computed(() => roleStore.roles || [])
const filters = computed<RoleFilters>({
    get() {
        return roleStore.filters
    },
    set(value: RoleFilters) {
        roleStore.filters = value
    },
})

const getRoles = async () => {
    appTableStore.setLoading(true)
    await roleStore.getRoles()
    appTableStore.setLoading(false)
}

getRoles()
watch(
    filters,
    () => {
        getRoles()
    },
    { deep: true }
)

onUnmounted(() => {
    roleStore.filters = {
        pageSize: 10,
        pageNumber: 1,
        name: null,
    }
})
</script>

<template>
    <div>
        <AppCrud
            :add-btn-action="null"
            :pagination="true"
            :total-pages="roleStore.totalPages"
            title="الأدوار"
            @update:current-page="filters.pageNumber = $event"
            hide-create
        >
            <template #filters>
                <BaseInput
                    v-model="filters.name"
                    placeholder="البحث في الأدوار"
                />
            </template>
            <AppTable
                title="جدول الأدوار"
                :headers="tableHeader()"
                :items="roles"
                :is-loading="isLoading"
            >
                <template #data-name="{ item }">
                    <span class="font-medium">{{ item.name }}</span>
                </template>
                <template #data-description="{ item }">
                    <span class="text-muted-500 dark:text-muted-400">{{
                        item.description
                    }}</span>
                </template>
                <template #data-isSystemRole="{ item }">
                    <BaseTag
                        :color="item.isSystemRole ? 'primary' : 'default'"
                        variant="pastel"
                        size="sm"
                    >
                        {{ item.isSystemRole ? 'نعم' : 'لا' }}
                    </BaseTag>
                </template>
                <template #data-permissions="{ item }">
                    <span class="font-medium">{{
                        item.permissions?.length || 0
                    }}</span>
                </template>
                <template #data-isActive="{ item }">
                    <BaseTag
                        :color="item.isActive ? 'success' : 'danger'"
                        variant="pastel"
                        size="sm"
                    >
                        {{ item.isActive ? 'نشط' : 'غير نشط' }}
                    </BaseTag>
                </template>
            </AppTable>
        </AppCrud>
    </div>
</template>

