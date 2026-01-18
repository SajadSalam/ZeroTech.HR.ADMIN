<script setup lang="ts">
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppTable from '~/components/app-table/AppTable.vue'
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import { payrollBatchTableHeaders } from '~/views/payroll'
import EmployeePayrollDetails from '~/views/payroll/components/EmployeePayrollDetails.vue'
import PayrollBatchCalculate from '~/views/payroll/components/PayrollBatchCalculate.vue'
import PayrollBatchCreate from '~/views/payroll/components/PayrollBatchCreate.vue'
import PayrollBatchEdit from '~/views/payroll/components/PayrollBatchEdit.vue'
import PayrollBatchView from '~/views/payroll/components/PayrollBatchView.vue'
import { usePayrollStore } from '~/views/payroll/store'
import type { PayrollBatchFilters } from '~/views/payroll/types'
import { PayrollBatchStatus } from '~/views/payroll/types'

definePageMeta({
  title: 'دفعات الرواتب',
  description: 'إدارة ومعالجة دفعات الرواتب',
})

const payrollStore = usePayrollStore()
const appTableStore = useAppTableStore()
const isLoading = computed(() => payrollStore.isLoading)
const payrollBatches = computed(() => payrollStore.payrollBatches || [])
const filters = computed<PayrollBatchFilters>({
  get() {
    return payrollStore.filters
  },
  set(value) {
    payrollStore.filters = value
  },
})

const getPayrollBatches = async () => {
  appTableStore.setLoading(true)
  await payrollStore.getPayrollBatches()
  appTableStore.setLoading(false)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'IQD',
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US')
}

const formatPercentage = (percentage: number) => {
  return `${percentage.toFixed(1)}%`
}

const getStatusBadgeColor = (status: PayrollBatchStatus) => {
  switch (status) {
    case PayrollBatchStatus.Draft:
      return 'gray'
    case PayrollBatchStatus.Calculating:
      return 'blue'
    case PayrollBatchStatus.Calculated:
      return 'green'
    case PayrollBatchStatus.Approved:
      return 'purple'
    case PayrollBatchStatus.Paid:
      return 'emerald'
    case PayrollBatchStatus.Cancelled:
      return 'red'
    default:
      return 'gray'
  }
}

const statusOptions = [
  { value: PayrollBatchStatus.Draft, label: 'مسودة' },
  { value: PayrollBatchStatus.Calculating, label: 'جاري الحساب' },
  { value: PayrollBatchStatus.Calculated, label: 'محسوب' },
  { value: PayrollBatchStatus.Approved, label: 'معتمد' },
  { value: PayrollBatchStatus.Paid, label: 'مدفوع' },
  { value: PayrollBatchStatus.Cancelled, label: 'ملغي' },
]

getPayrollBatches()
watch(
  filters,
  () => {
    getPayrollBatches()
  },
  { deep: true }
)
</script>

<template>
  <div>
    <AppCrud
      add-button-text="إنشاء دفعة راتب جديدة"
      :add-btn-action="() => (payrollStore.isCreateDialogOpen = true)"
      :pagination="true"
      :total-pages="payrollStore.totalPages"
      title="دفعات الرواتب"
      @update:current-page="filters.pageNumber = $event"
    >
      <template #filters>
        <BaseInput 
          v-model="filters.searchTerm" 
          placeholder="البحث في العنوان" 
        />
        
        <AppAutoCompleteField
          v-model="filters.status"
          placeholder="حالة الدفعة"
          :items="statusOptions"
          item-label="label"
          item-value="value"
        />
      </template>
      
      <AppTable
        title="دفعات الرواتب"
        :headers="payrollBatchTableHeaders()"
        :items="payrollBatches"
        :is-loading="isLoading"
      >
        <template #data-title="{ item }">
          <div class="flex flex-col">
            <span class="font-medium text-muted-800 dark:text-muted-100">
              {{ item.title }}
            </span>
            <span v-if="item.notes" class="text-xs text-muted-500 truncate max-w-xs">
              {{ item.notes }}
            </span>
          </div>
        </template>

        <template #data-periodStartDate="{ item }">
          <span class="text-muted-800 dark:text-muted-100">
            {{ formatDate(item.periodStartDate) }}
          </span>
        </template>

        <template #data-periodEndDate="{ item }">
          <span class="text-muted-800 dark:text-muted-100">
            {{ formatDate(item.periodEndDate) }}
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

        <template #data-totalEmployees="{ item }">
          <div class="text-center">
            <span class="font-medium text-muted-800 dark:text-muted-100">
              {{ item.totalEmployees }}
            </span>
          </div>
        </template>

        <template #data-processedCount="{ item }">
          <div class="text-center">
            <span 
              class="font-medium"
              :class="item.processedCount === item.totalEmployees ? 'text-green-600' : 'text-orange-600'"
            >
              {{ item.processedCount }}
            </span>
          </div>
        </template>

        <template #data-totalNetPay="{ item }">
          <span class="font-semibold text-green-600">
            {{ formatCurrency(item.totalNetPay) }}
          </span>
        </template>

        <template #data-completionPercentage="{ item }">
          <div class="flex items-center gap-2">
            <div class="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                class="h-2 rounded-full transition-all duration-300"
                :class="item.completionPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'"
                :style="{ width: `${item.completionPercentage}%` }"
              />
            </div>
            <span class="text-xs font-medium text-muted-600 min-w-[3rem]">
              {{ formatPercentage(item.completionPercentage) }}
            </span>
          </div>
        </template>

        <template #data-processedByUserName="{ item }">
          <span 
            v-if="item.processedByUserName"
            class="text-muted-800 dark:text-muted-100"
          >
            {{ item.processedByUserName }}
          </span>
          <span v-else class="text-muted-400">لم تتم المعالجة</span>
        </template>

        <template #data-actions="{ item }">
          <div class="flex gap-2">
            <!-- View Details Button -->
            <BaseButton
              size="sm"
              color="primary"
              variant="outline"
              @click="() => {
                payrollStore.setSelectedBatch(item)
                payrollStore.isViewDialogOpen = true
              }"
            >
              <Icon name="ph:eye-duotone" class="size-4" />
            </BaseButton>

            <!-- Calculate Button (only for Draft status) -->
            <BaseButton
              v-if="item.status === PayrollBatchStatus.Draft"
              size="sm"
              color="info"
              variant="outline"
              @click="() => {
                payrollStore.setSelectedBatch(item)
                payrollStore.isCalculateDialogOpen = true
              }"
            >
              <Icon name="ph:calculator-duotone" class="size-4" />
            </BaseButton>

          </div>
        </template>
      </AppTable>
    </AppCrud>

    <!-- Dialog Components -->
    <PayrollBatchCreate />
    <PayrollBatchEdit />
    <PayrollBatchCalculate />
    <PayrollBatchView />
    <EmployeePayrollDetails />
  </div>
</template>
