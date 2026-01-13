<script setup lang="ts">
import { usePayrollStore } from '../store'

const payrollStore = usePayrollStore()

const selectedPayroll = computed(() => payrollStore.selectedEmployeePayroll)

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



const isDialogOpen = computed({
  get: () => !!selectedPayroll.value,
  set: (value) => {
     if (!value) {
       payrollStore.setSelectedEmployeePayroll(null as any)
     }
  }
})
</script>

<template>
  <AppDialog
    v-model="isDialogOpen"
    title="تفاصيل راتب الموظف"
    size="xl"
    overflow-y="auto"
  >
    <div v-if="selectedPayroll" class="space-y-6">
      <!-- Employee Info Header -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">{{ selectedPayroll.employeeName }}</h2>
            <p class="text-gray-600">{{ selectedPayroll.employeeNumber }} - {{ selectedPayroll.jobTitle }}</p>
          </div>
          <BaseBadge color="blue" variant="solid">
            {{ selectedPayroll.departmentName }}
          </BaseBadge>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ formatCurrency(selectedPayroll.netPay) }}</div>
            <div class="text-sm text-gray-600">الراتب الصافي</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ formatPercentage(selectedPayroll.attendanceRate) }}</div>
            <div class="text-sm text-gray-600">نسبة الحضور</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">{{ formatPercentage(selectedPayroll.deductionPercentage) }}</div>
            <div class="text-sm text-gray-600">نسبة الخصم</div>
          </div>
        </div>
      </div>

      <!-- Payroll Breakdown -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Income Section -->
        <div class="bg-green-50 rounded-lg p-4 border border-green-200">
          <h3 class="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <Icon name="ph:plus-circle-duotone" class="size-5" />
            الدخل
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span>الراتب الأساسي:</span>
              <span class="font-medium">{{ formatCurrency(selectedPayroll.baseSalary) }}</span>
            </div>
            <div class="flex justify-between">
              <span>أجر الساعات الإضافية:</span>
              <span class="font-medium">{{ formatCurrency(selectedPayroll.overtimePay) }}</span>
            </div>
            <div class="border-t border-green-200 pt-2 flex justify-between font-semibold">
              <span>الإجمالي:</span>
              <span>{{ formatCurrency(selectedPayroll.grossPay) }}</span>
            </div>
          </div>
        </div>

        <!-- Deductions Section -->
        <div class="bg-red-50 rounded-lg p-4 border border-red-200">
          <h3 class="font-semibold text-red-800 mb-3 flex items-center gap-2">
            <Icon name="ph:minus-circle-duotone" class="size-5" />
            الخصومات
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span>خصم الغياب:</span>
              <span class="font-medium">{{ formatCurrency(selectedPayroll.absenceDeductions) }}</span>
            </div>
            <div class="flex justify-between">
              <span>خصم التأخير:</span>
              <span class="font-medium">{{ formatCurrency(selectedPayroll.lateDeductions) }}</span>
            </div>
            <div class="border-t border-red-200 pt-2 flex justify-between font-semibold">
              <span>الإجمالي:</span>
              <span>{{ formatCurrency(selectedPayroll.totalDeductions) }}</span>
            </div>
          </div>
        </div>

        <!-- Attendance Section -->
        <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 class="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <Icon name="ph:calendar-check-duotone" class="size-5" />
            الحضور
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span>أيام العمل المجدولة:</span>
              <span class="font-medium">{{ selectedPayroll.scheduledWorkingDays }}</span>
            </div>
            <div class="flex justify-between">
              <span>أيام العمل الفعلية:</span>
              <span class="font-medium">{{ selectedPayroll.actualWorkingDays }}</span>
            </div>
            <div class="flex justify-between">
              <span>أيام الغياب:</span>
              <span class="font-medium text-red-600">{{ selectedPayroll.absentDays }}</span>
            </div>
            <div class="flex justify-between">
              <span>أيام التأخير:</span>
              <span class="font-medium text-orange-600">{{ selectedPayroll.lateDays }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Working Hours -->
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <h3 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Icon name="ph:clock-duotone" class="size-5" />
          ساعات العمل
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div class="text-center p-3 bg-gray-50 rounded">
            <div class="font-semibold text-lg">{{ selectedPayroll.regularHours }}</div>
            <div class="text-gray-600">الساعات العادية</div>
          </div>
          <div class="text-center p-3 bg-green-50 rounded">
            <div class="font-semibold text-lg text-green-600">{{ selectedPayroll.overtimeHours }}</div>
            <div class="text-gray-600">الساعات الإضافية</div>
          </div>
          <div class="text-center p-3 bg-orange-50 rounded">
            <div class="font-semibold text-lg text-orange-600">{{ selectedPayroll.totalLateMinutes }}</div>
            <div class="text-gray-600">دقائق التأخير</div>
          </div>
          <div class="text-center p-3 bg-blue-50 rounded">
            <div class="font-semibold text-lg text-blue-600">{{ selectedPayroll.overtimeMultiplier }}x</div>
            <div class="text-gray-600">معامل الإضافي</div>
          </div>
        </div>
      </div>

      <!-- Rates -->
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <h3 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Icon name="ph:calculator-duotone" class="size-5" />
          المعدلات المحسوبة
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="flex justify-between p-3 bg-gray-50 rounded">
            <span>المعدل اليومي:</span>
            <span class="font-medium">{{ formatCurrency(selectedPayroll.dailyRate) }}</span>
          </div>
          <div class="flex justify-between p-3 bg-gray-50 rounded">
            <span>المعدل بالساعة:</span>
            <span class="font-medium">{{ formatCurrency(selectedPayroll.hourlyRate) }}</span>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div v-if="selectedPayroll.notes" class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <h3 class="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
          <Icon name="ph:note-duotone" class="size-5" />
          ملاحظات
        </h3>
        <p class="text-yellow-900 text-sm">{{ selectedPayroll.notes }}</p>
      </div>

      <!-- Audit Info -->
      <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 class="font-semibold text-gray-800 mb-2">معلومات التدقيق</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span class="font-medium">تم الإنشاء بواسطة:</span> {{ selectedPayroll.createdByUserName }}
            <br>
            <span class="font-medium">تاريخ الإنشاء:</span> {{ selectedPayroll.createdAt ? formatDate(selectedPayroll.createdAt) : '-' }}
          </div>
          <div>
             <span class="font-medium">الحالة:</span> {{ selectedPayroll.statusDisplay }}
            <br>
            <span class="font-medium">قابل للتعديل:</span> {{ selectedPayroll.isEditable ? 'نعم' : 'لا' }}
          </div>
        </div>
      </div>
    </div>

    <template #actions>
      <BaseButton color="muted" variant="outline" @click="isDialogOpen = false">
        <Icon name="ph:x-duotone" class="size-5" />
        إغلاق
      </BaseButton>
    </template>
  </AppDialog>
</template>
