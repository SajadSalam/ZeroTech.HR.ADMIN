<script setup lang="ts">
import AppTable from '~/components/app-table/AppTable.vue'
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import { employeePayrollTableHeaders } from '~/views/payroll'
import EmployeePayrollDetails from '~/views/payroll/components/EmployeePayrollDetails.vue'
import { usePayrollStore } from '~/views/payroll/store'
import type { EmployeePayrollFilters } from '~/views/payroll/types'
import { PayrollStatus } from '~/views/payroll/types'

definePageMeta({
  title: 'رواتب الموظفين',
  description: 'عرض وإدارة رواتب الموظفين',
})

const payrollStore = usePayrollStore()
const appTableStore = useAppTableStore()
const isLoading = computed(() => payrollStore.isLoading)
const employeePayrolls = computed(() => payrollStore.employeePayrolls || [])
const filters = computed<EmployeePayrollFilters>({
  get() {
    return payrollStore.employeePayrollFilters
  },
  set(value) {
    payrollStore.employeePayrollFilters = value
  },
})

const getEmployeePayrolls = async () => {
  appTableStore.setLoading(true)
  await payrollStore.getEmployeePayrolls()
  appTableStore.setLoading(false)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'IQD',
  }).format(amount)
}

const getStatusBadgeColor = (status: PayrollStatus) => {
  switch (status) {
    case PayrollStatus.Draft:
      return 'gray'
    case PayrollStatus.Calculated:
      return 'green'
    case PayrollStatus.Approved:
      return 'purple'
    case PayrollStatus.Paid:
      return 'emerald'
    default:
      return 'gray'
  }
}

const statusOptions = [
  { value: PayrollStatus.Draft, label: 'مسودة' },
  { value: PayrollStatus.Calculated, label: 'محسوب' },
  { value: PayrollStatus.Approved, label: 'معتمد' },
  { value: PayrollStatus.Paid, label: 'مدفوع' },
]

getEmployeePayrolls()
watch(
  filters,
  () => {
    getEmployeePayrolls()
  },
  { deep: true }
)

onUnmounted(() => {
  payrollStore.employeePayrollFilters = {
    pageSize: 10,
    pageNumber: 1,
    employeeId: null,
  }
})
</script>

<template>
  <div>
    <AppCrud
      :show-add-button="false"
      :pagination="true"
      :total-pages="payrollStore.employeePayrollTotalPages"
      title="رواتب الموظفين"
      @update:current-page="filters.pageNumber = $event"
    >
      <template #filters>
        <AppAutoCompleteField
          v-model="filters.employeeId"
          placeholder="الموظف"
          fetch-on-search
          search-key="fullName"
          get-url="/Employee"
          item-label="fullName"
          item-value="id"
          clearable
        />
        
        <BaseInput 
          v-model="filters.employeeName" 
          placeholder="اسم الموظف" 
        />
        
        <BaseInput 
          v-model="filters.departmentName" 
          placeholder="القسم" 
        />
        
        <AppAutoCompleteField
          v-model="filters.payrollBatchId"
          placeholder="دفعة الراتب"
          fetch-on-search
          search-key="title"
          get-url="/Payroll/batch"
          item-label="title"
          item-value="id"
          clearable
        />
        
        <BaseSelect
          v-model="filters.status"
          placeholder="الحالة"
          :options="statusOptions"
          clearable
        />
        
        <BaseInput
          v-model="filters.minNetPay"
          type="number"
          placeholder="أقل راتب صافي"
          step="100"
        />
        
        <BaseInput
          v-model="filters.maxNetPay"
          type="number"
          placeholder="أعلى راتب صافي"
          step="100"
        />
      </template>
      
      <AppTable
        title="رواتب الموظفين"
        :headers="employeePayrollTableHeaders()"
        :items="employeePayrolls"
        :is-loading="isLoading"
      >
        <template #data-employeeNumber="{ item }">
          <BaseTag color="primary" variant="pastel" size="sm">
            {{ item.employeeNumber }}
          </BaseTag>
        </template>

        <template #data-employeeName="{ item }">
          <div class="flex flex-col">
            <span class="font-medium text-muted-800 dark:text-muted-100">
              {{ item.employeeName }}
            </span>
            <span class="text-xs text-muted-500">
              {{ item.jobTitle }}
            </span>
          </div>
        </template>

        <template #data-departmentName="{ item }">
          <BaseBadge color="blue" variant="pastel">
            {{ item.departmentName }}
          </BaseBadge>
        </template>

        <template #data-baseSalary="{ item }">
          <span class="font-medium text-muted-800 dark:text-muted-100">
            {{ formatCurrency(item.baseSalary) }}
          </span>
        </template>

        <template #data-actualWorkingDays="{ item }">
          <div class="text-center">
            <span class="font-medium text-muted-800 dark:text-muted-100">
              {{ item.actualWorkingDays }}
            </span>
            <span class="text-muted-500 text-sm">/ {{ item.scheduledWorkingDays }}</span>
          </div>
        </template>

        <template #data-absentDays="{ item }">
          <span 
            :class="item.absentDays > 0 ? 'text-red-600 font-medium' : 'text-muted-500'"
          >
            {{ item.absentDays }}
          </span>
        </template>

        <template #data-overtimeHours="{ item }">
          <span 
            :class="item.overtimeHours > 0 ? 'text-green-600 font-medium' : 'text-muted-500'"
          >
            {{ item.overtimeHours }}
          </span>
        </template>

        <template #data-totalDeductions="{ item }">
          <span 
            :class="item.totalDeductions > 0 ? 'text-red-600 font-medium' : 'text-muted-500'"
          >
            {{ formatCurrency(item.totalDeductions) }}
          </span>
        </template>

        <template #data-netPay="{ item }">
          <span class="font-semibold text-green-600">
            {{ formatCurrency(item.netPay) }}
          </span>
        </template>

        <template #data-statusDisplay="{ item }">
          <BaseBadge 
            :color="getStatusBadgeColor(item.status)"
            variant="solid"
          >
            {{ item.statusDisplay }}
          </BaseBadge>
        </template>

        <template #data-actions="{ item }">
          <BaseButton
            size="sm"
            color="primary"
            variant="outline"
            @click="payrollStore.setSelectedEmployeePayroll(item)"
          >
            <Icon name="ph:eye-duotone" class="size-4" />
            عرض التفاصيل
          </BaseButton>
        </template>
      </AppTable>
    </AppCrud>

    <!-- Employee Payroll Details Dialog -->
    <EmployeePayrollDetails />
  </div>
</template>
