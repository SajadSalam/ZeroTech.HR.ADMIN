<script setup lang="ts">
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import AppTable from '~/components/app-table/AppTable.vue'
import { contractTypes, tableHeader } from '~/views/employees'
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'
import { useAuthStore } from '~/views/auth/store/auth'
import { useEmployeeStore } from '~/views/employees/store'
import type { EmployeeDto, EmployeeFilters } from '~/views/employees/types'
import { formatDate } from '~/services/formatters'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { useEmployeeVacationStore } from '~/views/employee-vacation/store'
import VacationBalanceDialog from '~/views/employee-vacation/components/VacationBalanceDialog.vue'

definePageMeta({
    title: 'الموظفين',
    description: 'إدارة الموظفين في النظام',
})

const employeeStore = useEmployeeStore()
const appTableStore = useAppTableStore()
const vacationStore = useEmployeeVacationStore()

const isLoading = computed(() => employeeStore.isLoading)
const employees = computed(() => employeeStore.employees || [])
const filters = computed<EmployeeFilters>({
    get() {
        return employeeStore.filters
    },
    set(value) {
        employeeStore.filters = value
    },
})

const getEmployees = async () => {
    appTableStore.setLoading(true)
    await employeeStore.getEmployees()
    appTableStore.setLoading(false)
}
const viewEmployeeDetails = (item: EmployeeDto) => {
    useRouter().push(`/employees/${item.id}`)
}

const viewVacationBalance = async (item: EmployeeDto) => {
    await vacationStore.getEmployeeVacationBalance(item.id)
}
getEmployees()
watch(
    filters,
    () => {
        getEmployees()
    },
    { deep: true }
)
</script>

<template>
    <div>
        <AppCrud
            add-button-text="إضافة موظف جديد"
            :add-btn-action="() => useRouter().push('/employees/form')"
            :pagination="true"
            :total-pages="employeeStore.totalPages"
            title="الموظفين"
            @update:current-page="filters.pageNumber = $event"
        >
            <template #filters>
                <BaseInput
                    v-model="filters.searchTerm"
                    placeholder="البحث في الاسم والوصف"
                />
                <AppAutoCompleteField
                    v-model="filters.DepartmentId"
                    placeholder="البحث بالقسم"
                    get-url="/Department"
                    item-label="name"
                    item-value="id"
                />
                <AppAutoCompleteField
                    v-model="filters.ContractType"
                    placeholder="البحث بنوع العقد"
                    :items="contractTypes"
                    item-label="label"
                    item-value="value"
                />
            </template>

            <AppTable
                title="قائمة الموظفين"
                :headers="tableHeader()"
                :items="employees"
                :is-loading="isLoading"
            >
                <template #data-hireDate="{ item }">
                    {{ item.hireDate.split('T')[0] }}
                </template>
                <template #data-contractType="{ item }">
                    {{
                        contractTypes.find(
                            (type) => type.value === item.contractType
                        )?.label
                    }}
                </template>
                <template #data-actions="{ item }">
                    <div class="flex justify-center items-center gap-2">
                        <Icon
                            @click="viewEmployeeDetails(item)"
                            name="ph:eye-duotone"
                            class="size-5 text-primary-500 cursor-pointer"
                        />
                        <BaseButton
                            size="sm"
                            color="primary"
                            class="gap-1"
                            @click="
                                useRouter().push(
                                    `/employees/balance/${item.id}`
                                )
                            "
                        >
                            <Icon name="ph:wallet-duotone" class="size-4" />
                            الرصيد
                        </BaseButton>
                        <BaseButton
                            size="sm"
                            color="success"
                            class="gap-1"
                            @click="viewVacationBalance(item)"
                        >
                            <Icon name="ph:airplane-duotone" class="size-4" />
                            الإجازات
                        </BaseButton>
                        <AppCrudActions
                            :item="item"
                            :edit-button-action="
                                () => {
                                    employeeStore.selectedRequestCategory = item
                                    employeeStore.selectedRequestCategoryId =
                                        item.id
                                    employeeStore.isEditDialogOpen = true
                                }
                            "
                            hide-update
                            hide-delete
                            :delete-service="employeeStore.deleteEmployee"
                        />
                    </div>
                </template>
            </AppTable>
        </AppCrud>
        <VacationBalanceDialog />
    </div>
</template>

