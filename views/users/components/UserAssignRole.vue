<script setup lang="ts">
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppInputField from '~/components/app-field/AppInputField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { useUserStore } from '../store'
import { useRoleStore } from '~/views/roles/store'
import type { AssignRoleDto } from '../types'

const userStore = useUserStore()
const roleStore = useRoleStore()

const validator = new Validator<AssignRoleDto>(
    {
        userId: 0,
        roleId: 0,
        effectiveFrom: '',
        effectiveTo: '',
    },
    {
        roleId: {
            required: requiredValidator('الدور'),
        },
        effectiveFrom: {
            required: requiredValidator('تاريخ البداية'),
        },
        effectiveTo: {
            required: requiredValidator('تاريخ النهاية'),
        },
    }
)

const body = validator.validation
const isLoading = computed(() => userStore.isLoading)
const roles = computed(() => roleStore.roles || [])

const assignRole = async () => {
    const isValid = await body.value.$validate()
    if (!isValid) return

    const data = validator.extractBody()
    data.userId = userStore.selectedUserId!

    try {
        await userStore.assignRole(data)
        validator.resetBody()
        userStore.isAssignRoleDialogOpen = false
    } catch (error) {
        console.error('Error assigning role:', error)
    }
}

watch(
    () => userStore.isAssignRoleDialogOpen,
    async (val: boolean) => {
        if (val) {
            validator.resetBody()
            if (roleStore.roles.length === 0) {
                await roleStore.getRoles()
            }
        }
    }
)
</script>

<template>
    <AppDialog
        v-model="userStore.isAssignRoleDialogOpen"
        title="تعيين دور"
        size="lg"
        overflow-y="visible"
    >
        <div class="space-y-4">
            <AppAutoCompleteField
                v-model="body.roleId.$model"
                label="الدور"
                placeholder="اختر الدور"
                :items="roles"
                item-label="name"
                item-value="id"
                :error-message="
                    body.roleId.$errors.map((e) => e.$message).join(', ')
                "
            />
            <AppInputField
                v-model="body.effectiveFrom.$model"
                label="تاريخ البداية"
                type="date"
                placeholder="اختر تاريخ البداية"
                :error-message="
                    body.effectiveFrom.$errors.map((e) => e.$message).join(', ')
                "
            />
            <AppInputField
                v-model="body.effectiveTo.$model"
                label="تاريخ النهاية"
                type="date"
                placeholder="اختر تاريخ النهاية"
                :error-message="
                    body.effectiveTo.$errors.map((e) => e.$message).join(', ')
                "
            />
        </div>
        <template #actions>
            <BaseButton
                color="default"
                @click="userStore.isAssignRoleDialogOpen = false"
            >
                إلغاء
            </BaseButton>
            <BaseButton
                color="primary"
                class="gap-1"
                :loading="isLoading"
                @click="assignRole"
            >
                <Icon name="ph:check-circle-duotone" class="size-5" />
                تعيين
            </BaseButton>
        </template>
    </AppDialog>
</template>

