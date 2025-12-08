<script setup lang="ts">
import AppTable from '~/components/app-table/AppTable.vue'
import { useUserStore } from '~/views/users/store'
import type { RoleDto } from '~/views/roles/types'

const userStore = useUserStore()
const isLoading = computed(() => userStore.isLoading)
const userRoles = computed(() => userStore.userRoles || [])
const isDeleteConfirmOpen = ref(false)
const roleToDelete = ref<RoleDto | null>(null)

const tableHeaders = [
    {
        key: 'name',
        label: 'اسم الدور',
        sortable: true,
    },
    {
        key: 'description',
        label: 'الوصف',
        sortable: false,
    },
    {
        key: 'permissions',
        label: 'الصلاحيات',
        sortable: false,
    },
    {
        key: 'isActive',
        label: 'الحالة',
        sortable: true,
    },
    {
        key: 'actions',
        label: 'الإجراءات',
        sortable: false,
    },
]

const handleRemoveRole = (role: RoleDto) => {
    roleToDelete.value = role
    isDeleteConfirmOpen.value = true
}

const confirmRemoveRole = async () => {
    if (!userStore.selectedUserId || !roleToDelete.value) return

    try {
        await userStore.removeRole(
            userStore.selectedUserId,
            roleToDelete.value.id
        )
        isDeleteConfirmOpen.value = false
        roleToDelete.value = null
    } catch (error) {
        console.error('Error removing role:', error)
    }
}

const cancelRemoveRole = () => {
    isDeleteConfirmOpen.value = false
    roleToDelete.value = null
}

watch(
    () => userStore.isRolesDialogOpen,
    async (val: boolean) => {
        if (val && userStore.selectedUserId) {
            await userStore.getUserRoles(userStore.selectedUserId)
        }
    }
)
</script>

<template>
    <AppDialog
        v-model="userStore.isRolesDialogOpen"
        title="أدوار المستخدم"
        size="xl"
    >
        <div v-if="isLoading" class="flex justify-center items-center py-8">
            <AppLoading />
        </div>
        <div v-else-if="userRoles.length === 0" class="text-center py-8">
            <p class="text-muted-500 dark:text-muted-400">
                لا توجد أدوار لهذا المستخدم
            </p>
        </div>
        <AppTable
            v-else
            title="قائمة أدوار المستخدم"
            :headers="tableHeaders"
            :items="userRoles"
            :is-loading="isLoading"
        >
            <template #data-permissions="{ item }">
                <div class="flex flex-wrap gap-1">
                    <BaseBadge
                        v-for="permission in item.permissions?.slice(0, 3)"
                        :key="permission.id"
                        color="default"
                        :label="permission.displayName"
                        size="sm"
                    />
                    <BaseBadge
                        v-if="item.permissions && item.permissions.length > 3"
                        color="muted"
                        :label="`+${item.permissions.length - 3} أخرى`"
                        size="sm"
                    />
                    <span
                        v-if="
                            !item.permissions || item.permissions.length === 0
                        "
                        class="text-muted-500"
                    >
                        لا توجد صلاحيات
                    </span>
                </div>
            </template>
            <template #data-isActive="{ item }">
                <BaseBadge
                    :color="item.isActive ? 'success' : 'danger'"
                    :label="item.isActive ? 'نشط' : 'غير نشط'"
                />
            </template>
            <template #data-actions="{ item }">
                <div class="flex gap-2">
                    <BaseButton
                        color="danger"
                        size="sm"
                        variant="outline"
                        @click="handleRemoveRole(item)"
                        :disabled="isLoading"
                    >
                        <Icon name="ph:trash-duotone" class="size-4" />
                        حذف
                    </BaseButton>
                </div>
            </template>
        </AppTable>
        <template #actions>
            <BaseButton
                color="default"
                @click="userStore.isRolesDialogOpen = false"
            >
                إغلاق
            </BaseButton>
        </template>
    </AppDialog>

    <!-- Confirmation Dialog -->
    <AppDialog v-model="isDeleteConfirmOpen" title="تأكيد حذف الدور" size="sm">
        <div class="text-center py-4">
            <Icon
                name="ph:warning-circle-duotone"
                class="size-16 text-danger mx-auto mb-4"
            />
            <h3 class="text-lg font-semibold mb-2">
                هل أنت متأكد من حذف هذا الدور؟
            </h3>
            <p class="text-muted-500 dark:text-muted-400 mb-4">
                سيتم حذف الدور <strong>"{{ roleToDelete?.name }}"</strong> من
                المستخدم نهائياً.
            </p>
            <p class="text-sm text-muted-400">
                لا يمكن التراجع عن هذا الإجراء.
            </p>
        </div>
        <template #actions>
            <div class="flex gap-2 justify-end">
                <BaseButton
                    color="default"
                    variant="outline"
                    @click="cancelRemoveRole"
                >
                    إلغاء
                </BaseButton>
                <BaseButton
                    color="danger"
                    :loading="isLoading"
                    @click="confirmRemoveRole"
                >
                    <Icon name="ph:trash-duotone" class="size-4" />
                    حذف
                </BaseButton>
            </div>
        </template>
    </AppDialog>
</template>

