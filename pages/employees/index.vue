<script setup lang="ts">
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import AppTable from '~/components/app-table/AppTable.vue'
import { tableHeader } from '~/views/employees'
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'
import { useAuthStore } from '~/views/auth/store/auth'
import { useEmployeeStore } from '~/views/employees/store'
import type { EmployeeDto, EmployeeFilters } from '~/views/employees/types'
import { formatDate } from '~/services/formatters'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'

definePageMeta({
  title: 'الموظفين',
  description: 'إدارة الموظفين في النظام',
})

const employeeStore = useEmployeeStore()
const appTableStore = useAppTableStore()

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
getEmployees()
watch(filters, () => { getEmployees() }, { deep: true })
const contractTypes = [{
            label: 'دوام كامل',
            value: 1,
          }, {
            label: 'دوام جزئي',
            value: 2,
          }, {
            label: 'عقد ',
            value:3,
          }, {
            label: 'مؤقت',
            value: 4,
          }, {
            label: 'متدرب',
            value: 5,
          }]
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
          {{ contractTypes.find(type => type.value === item.contractType)?.label }}
        </template>
        <template #data-actions="{ item }">
          <div class="flex justify-center items-center gap-2">
            <Icon @click="viewEmployeeDetails(item)" name="ph:eye-duotone" class="size-5 text-primary-500 cursor-pointer" />
            <AppCrudActions
            :item="item"
            :edit-button-action="() => {
              employeeStore.selectedRequestCategory = item
              employeeStore.selectedRequestCategoryId = item.id
              employeeStore.isEditDialogOpen = true
            }"
            hide-update
            hide-delete
            :delete-service="employeeStore.deleteRequestCategory"
            />
          </div>
        </template>
      </AppTable>
    </AppCrud>
    
    <RequestCategoryCreate />
    <RequestCategoryEdit />
  </div>
</template>
