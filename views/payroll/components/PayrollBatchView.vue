<script setup lang="ts">
import AppTable from '~/components/app-table/AppTable.vue'
import { employeePayrollTableHeaders } from '../index'
import { usePayrollStore } from '../store'
import { PayrollBatchStatus, PayrollStatus } from '../types'

const payrollStore = usePayrollStore()

const selectedBatch = computed(() => payrollStore.selectedBatch)
const employeePayrolls = computed(() => selectedBatch.value?.employeePayrolls || [])

// Watch for dialog open and fetch batch details
watch(() => payrollStore.isViewDialogOpen, async (isOpen) => {
  if (isOpen && payrollStore.selectedBatchId) {
    await payrollStore.getPayrollBatchById(payrollStore.selectedBatchId)
  }
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'IQD',
  }).format(amount)
}

const formatPercentage = (percentage: number) => {
  return `${percentage.toFixed(2)}%`
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US')
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

const getEmployeePayrollStatusBadgeColor = (status: PayrollStatus) => {
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
</script>

<template>
  <AppDialog
    v-model="payrollStore.isViewDialogOpen"
    title="تفاصيل دفعة الراتب"
    size="3xl"
    overflow-y="auto"
  >
    <div v-if="selectedBatch" class="space-y-6">
      <!-- Batch Summary -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">{{ selectedBatch.title }}</h2>
           <BaseBadge 
             :color="getStatusBadgeColor(selectedBatch.status)"
             variant="solid"
           >
             {{ selectedBatch.statusDisplay }}
           </BaseBadge>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="text-sm text-gray-600 mb-1">فترة الراتب</div>
            <div class="font-semibold">
              {{ formatDate(selectedBatch.periodStartDate) }} - {{ formatDate(selectedBatch.periodEndDate) }}
            </div>
          </div>

          <div class="bg-blue-50 rounded-lg p-4">
            <div class="text-sm text-blue-600 mb-1">عدد الموظفين</div>
            <div class="font-semibold text-blue-900">
              {{ selectedBatch.processedCount }} / {{ selectedBatch.totalEmployees }}
            </div>
          </div>

          <div class="bg-green-50 rounded-lg p-4">
            <div class="text-sm text-green-600 mb-1">إجمالي الراتب الصافي</div>
            <div class="font-semibold text-green-900">
              {{ formatCurrency(selectedBatch.totalNetPay) }}
            </div>
          </div>

          <div class="bg-purple-50 rounded-lg p-4">
            <div class="text-sm text-purple-600 mb-1">نسبة الإنجاز</div>
            <div class="font-semibold text-purple-900">
              {{ formatPercentage(selectedBatch.completionPercentage) }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div class="bg-orange-50 rounded-lg p-4">
            <div class="text-sm text-orange-600 mb-1">إجمالي الراتب الإجمالي</div>
            <div class="font-semibold text-orange-900">
              {{ formatCurrency(selectedBatch.totalGrossPay) }}
            </div>
          </div>

          <div class="bg-red-50 rounded-lg p-4">
            <div class="text-sm text-red-600 mb-1">إجمالي الخصومات</div>
            <div class="font-semibold text-red-900">
              {{ formatCurrency(selectedBatch.totalDeductions) }}
            </div>
          </div>

          <div class="bg-gray-50 rounded-lg p-4">
            <div class="text-sm text-gray-600 mb-1">أيام الفترة</div>
            <div class="font-semibold text-gray-900">
              {{ selectedBatch.periodDays }} يوم
            </div>
          </div>
        </div>

        <div v-if="selectedBatch.notes" class="mt-4 p-4 bg-yellow-50 rounded-lg">
          <div class="text-sm text-yellow-600 mb-1">ملاحظات</div>
          <div class="text-yellow-900">{{ selectedBatch.notes }}</div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-200">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span class="font-medium">تم الإنشاء بواسطة:</span> {{ selectedBatch.createdByUserName }}
              <br>
              <span class="font-medium">تاريخ الإنشاء:</span> {{ selectedBatch.createdAt ? formatDate(selectedBatch.createdAt) : '-' }}
            </div>
            <div v-if="selectedBatch.processedByUserName">
              <span class="font-medium">تمت المعالجة بواسطة:</span> {{ selectedBatch.processedByUserName }}
              <br>
              <span class="font-medium">تاريخ المعالجة:</span> {{ selectedBatch.processedAt ? formatDate(selectedBatch.processedAt) : '-' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Employee Payrolls Table -->
      <div class="bg-white rounded-lg border border-gray-200">
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">رواتب الموظفين</h3>
        </div>
        
        <AppTable
          title="رواتب الموظفين"
          :headers="employeePayrollTableHeaders()"
          :items="employeePayrolls"
          :is-loading="false"
        >
          <template #data-baseSalary="{ item }">
            <span class="font-medium">{{ formatCurrency(item.baseSalary) }}</span>
          </template>

          <template #data-actualWorkingDays="{ item }">
            <div class="text-center">
              <span class="font-medium">{{ item.actualWorkingDays }}</span>
              <span class="text-gray-500 text-sm">/ {{ item.scheduledWorkingDays }}</span>
            </div>
          </template>

          <template #data-absentDays="{ item }">
            <span :class="item.absentDays > 0 ? 'text-red-600 font-medium' : 'text-gray-500'">
              {{ item.absentDays }}
            </span>
          </template>

          <template #data-overtimeHours="{ item }">
            <span :class="item.overtimeHours > 0 ? 'text-green-600 font-medium' : 'text-gray-500'">
              {{ item.overtimeHours }}
            </span>
          </template>

          <template #data-totalDeductions="{ item }">
            <span :class="item.totalDeductions > 0 ? 'text-red-600 font-medium' : 'text-gray-500'">
              {{ formatCurrency(item.totalDeductions) }}
            </span>
          </template>

          <template #data-netPay="{ item }">
            <span class="font-semibold text-green-600">{{ formatCurrency(item.netPay) }}</span>
          </template>

          <template #data-statusDisplay="{ item }">
            <BaseBadge 
              :color="getEmployeePayrollStatusBadgeColor(item.status)"
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
      </div>
    </div>

    <template #actions>
      <div class="flex gap-2">
        <BaseButton
          v-if="payrollStore.canCalculateBatch"
           color="info"
          @click="payrollStore.isCalculateDialogOpen = true"
        >
          <Icon name="ph:calculator-duotone" class="size-5" />
          حساب الرواتب
        </BaseButton>
        
        <BaseButton
          v-if="payrollStore.canApproveBatch"
           color="success"
          @click="payrollStore.approvePayrollBatch(selectedBatch!.id)"
        >
          <Icon name="ph:check-circle-duotone" class="size-5" />
          اعتماد الدفعة
        </BaseButton>
        
        <BaseButton
          v-if="payrollStore.canMarkAsPaid"
           color="success"
          @click="payrollStore.markBatchAsPaid(selectedBatch!.id)"
        >
          <Icon name="ph:money-duotone" class="size-5" />
          تسجيل كمدفوع
        </BaseButton>
        
        <BaseButton
          v-if="payrollStore.canCancelBatch"
           color="danger"
          variant="outline"
          @click="payrollStore.cancelPayrollBatch(selectedBatch!.id)"
        >
          <Icon name="ph:x-circle-duotone" class="size-5" />
          إلغاء الدفعة
        </BaseButton>
      </div>
    </template>
  </AppDialog>
</template>
