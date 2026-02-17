<script setup lang="ts">
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import AppTable from '~/components/app-table/AppTable.vue'
import { useUserStore } from '~/views/users/store'
import { tableHeader } from '~/views/users'
import UserRolesDialog from '~/views/users/components/UserRolesDialog.vue'
import UserAssignRole from '~/views/users/components/UserAssignRole.vue'
import type { UserDto, UserFilters } from '~/views/users/types'
import { formatDateTime } from '~/services/formatters'

definePageMeta({
    title: 'المستخدمين',
    description: 'إدارة المستخدمين',
})

const userStore = useUserStore()
const appTableStore = useAppTableStore()
const isLoading = computed(() => userStore.isLoading)
const users = computed(() => userStore.users || [])
const filters = computed<UserFilters>({
    get() {
        return userStore.filters
    },
    set(value: UserFilters) {
        userStore.filters = value
    },
})

const getUsers = async () => {
    appTableStore.setLoading(true)
    await userStore.getUsers()
    appTableStore.setLoading(false)
}

const openRolesDialog = (user: UserDto) => {
    userStore.selectedUserId = user.id
    userStore.selectedUser = user
    userStore.isRolesDialogOpen = true
}

const openAssignRoleDialog = (user: UserDto) => {
    userStore.selectedUserId = user.id
    userStore.selectedUser = user
    userStore.isAssignRoleDialogOpen = true
}
const handleUnlock = async (user: UserDto) => {
    if (!user.isLockedOut) return
    await userStore.unlockUser(user.id)
}

getUsers()
watch(
    filters,
    () => {
        getUsers()
    },
    { deep: true }
)

onUnmounted(() => {
    userStore.filters = {
        pageSize: 10,
        pageNumber: 1,
        search: null,
    }
})
</script>

<template>
    <div>
        <AppCrud
            :add-btn-action="null"
            :pagination="true"
            :total-pages="userStore.totalPages"
            title="المستخدمين"
            @update:current-page="filters.pageNumber = $event"
            hide-create
        >
            <template #filters>
                <BaseInput
                    v-model="filters.search"
                    placeholder="البحث باسم المستخدم"
                    class="ml-2"
                />
            </template>
            <AppTable
                title="جدول المستخدمين"
                :headers="tableHeader()"
                :items="users"
                :is-loading="isLoading"
            >
                <template #data-lastLoginAt="{ item }">
                    <span>
                        {{
                            item.lastLoginAt
                                ? formatDateTime(item.lastLoginAt)
                                : 'لم يسجل دخول'
                        }}
                    </span>
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
                 <template #data-isLockedOut="{ item }">
                    <BaseButton
                        :color="item.isLockedOut ? 'success' : 'danger'"
                        variant="pastel"
                        size="sm"
                        @click="handleUnlock(item)"
                    >
                        {{ item.isLockedOut ? 'مقيد' : 'غير مقيد' }}
                    </BaseButton>
                </template>
                <template #data-actions="{ item }">
                    <div class="flex gap-2">
                        <BaseButton
                            color="default"
                            size="sm"
                            @click="openRolesDialog(item)"
                        >
                            <Icon name="ph:users-duotone" class="size-4" />
                            عرض الأدوار
                        </BaseButton>
                        <BaseButton
                            color="primary"
                            size="sm"
                            @click="openAssignRoleDialog(item)"
                        >
                            <Icon
                                name="ph:plus-circle-duotone"
                                class="size-4"
                            />
                            تعيين دور
                        </BaseButton>
                    </div>
                </template>
            </AppTable>
        </AppCrud>
        <UserRolesDialog />
        <UserAssignRole />
    </div>
</template>

