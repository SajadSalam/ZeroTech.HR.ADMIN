<script setup lang="ts">
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { employeeService } from '~/views/employees/service'
import type { EmployeeDto } from '~/views/employees/types'
import { usePayrollStore } from '../store'
import type { PayrollBatchCreateDto } from '../types'

const payrollStore = usePayrollStore()

// Employee selection state
const includeAllEmployees = ref(true)
const selectedEmployeeIds = ref<number[]>([])
const employees = ref<EmployeeDto[]>([])
const autoCalculate = ref(false)
const overtimeMultiplier = ref(1.5)

// Fetch active employees
const fetchEmployees = async () => {
  try {
    const response = await employeeService.get({
      pageSize: 1000,
      pageNumber: 1,
      status: 'active',
    })
    employees.value = response.data
  } catch (error) {
    console.error('Error fetching employees:', error)
  }
}

onMounted(() => {
  fetchEmployees()
})

const validator = new Validator<PayrollBatchCreateDto>(
  {
    title: '',
    periodStartDate: '',
    periodEndDate: '',
    notes: '',
    includeAllEmployees: true,
    employeeIds: null,
    autoCalculate: false,
    overtimeMultiplier: 1.5,
  },
  {
    title: {
      required: requiredValidator('عنوان دفعة الراتب'),
    },
    periodStartDate: {
      required: requiredValidator('تاريخ بداية الفترة'),
    },
    periodEndDate: {
      required: requiredValidator('تاريخ نهاية الفترة'),
    },
  }
)

const body = validator.validation

const isLoading = computed(() => {
  return payrollStore.isLoading
})

// Sync reactive refs with validator body
watch(includeAllEmployees, (val) => {
  if (body.value.includeAllEmployees) {
    body.value.includeAllEmployees.$model = val
  }
  if (val && body.value.employeeIds) {
    selectedEmployeeIds.value = []
    body.value.employeeIds.$model = null
  }
})

watch(selectedEmployeeIds, (val) => {
  if (body.value.employeeIds) {
    body.value.employeeIds.$model = val.length > 0 ? val : null
    autoCalculate.value = val.length > 0
  }
})

watch(autoCalculate, (val) => {
  if (body.value.autoCalculate) {
    body.value.autoCalculate.$model = val
  }
  if (!val) {
    overtimeMultiplier.value = 1.5
  }
})

watch(overtimeMultiplier, (val) => {
  // Ensure the value is a number
  if (body.value.overtimeMultiplier) {
    body.value.overtimeMultiplier.$model = typeof val === 'string' ? parseFloat(val) : val
  }
})

const createPayrollBatch = async () => {
  const isValid = await body.value.$validate()

  if (!isValid) return
  
  // Validate that end date is after start date
  const startDate = new Date(body.value.periodStartDate.$model as string)
  const endDate = new Date(body.value.periodEndDate.$model as string)
  
  if (endDate <= startDate) {
    // You might want to add a proper validation error here
    return
  }

  // Custom validation: if not including all employees, at least one employee must be selected
  if (!includeAllEmployees.value && (!selectedEmployeeIds.value || selectedEmployeeIds.value.length === 0)) {
    return
  }

  // Custom validation: if auto-calculate is enabled, overtime multiplier must be greater than 0
  if (autoCalculate.value && overtimeMultiplier.value <= 0) {
    return
  }

  // Prepare the payload
  const payload = validator.extractBody()
  
  // Only include overtimeMultiplier if autoCalculate is true
  if (!autoCalculate.value) {
    delete payload.overtimeMultiplier
  } else {
    // Ensure overtimeMultiplier is a number, not a string
    payload.overtimeMultiplier = parseFloat(payload.overtimeMultiplier as any) || 1.5
  }

  await payrollStore.createPayrollBatch(payload)
  validator.resetBody()
  includeAllEmployees.value = true
  selectedEmployeeIds.value = []
  autoCalculate.value = false
  overtimeMultiplier.value = 1.5
  payrollStore.isCreateDialogOpen = false
}

watch(
  () => payrollStore.isCreateDialogOpen,
  (val: boolean) => {
    if (val) {
      validator.resetBody()
      includeAllEmployees.value = true
      selectedEmployeeIds.value = []
      autoCalculate.value = false
      overtimeMultiplier.value = 1.5
    }
  }
)

const buttonText = computed(() => {
  return autoCalculate.value ? 'إنشاء وحساب الرواتب' : 'إنشاء دفعة راتب'
})
</script>

<template>
  <AppDialog
    v-model="payrollStore.isCreateDialogOpen"
    title="إنشاء دفعة راتب جديدة"
    size="xl"
    overflow-y="visible"
  >
    <div class="rounded-3xl p-3">
      <div class="flex flex-col gap-4">
        
        <!-- Employee Selection Section -->
        <div class="border-b border-gray-200 pb-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">اختيار الموظفين</h3>
          <div class="flex flex-col gap-4">
            <!-- Employee Selection Toggle -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-700">خيارات الموظفين</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="includeAllEmployees"
                    type="radio"
                    :value="true"
                    class="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span class="text-sm text-gray-700">جميع الموظفين</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="includeAllEmployees"
                    type="radio"
                    :value="false"
                    class="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span class="text-sm text-gray-700">موظفين محددين</span>
                </label>
              </div>
            </div>

            <!-- Employee Multi-Select -->
            <div v-if="!includeAllEmployees" class="mt-2">
              <AppAutoCompleteField
                v-model="selectedEmployeeIds"
                get-url="/employee"
                fetch-on-search
                search-key="SearchTerm"
                item-label="fullName"
                item-value="id"
                item-subtitle="employeeNumber"
                label="اختر الموظفين"
                placeholder="ابحث عن موظف..."
                :multiple="true"
              />
              <p v-if="!includeAllEmployees && selectedEmployeeIds.length === 0" class="text-sm text-red-600 mt-1">
                يجب اختيار موظف واحد على الأقل
              </p>
              <p v-else-if="selectedEmployeeIds.length > 0" class="text-sm text-green-600 mt-1">
                تم اختيار {{ selectedEmployeeIds.length }} موظف
              </p>
            </div>
          </div>
        </div>
        <!-- Basic Information Section -->
        <div class="border-b border-gray-200 pb-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">المعلومات الأساسية</h3>
          <div class="flex flex-col gap-4">
            <AppInputField
              v-model="body.title.$model"
              :errors="body.title.$errors"
              size="md"
              label="عنوان دفعة الراتب"
              placeholder="مثال: راتب يناير 2026"
              required
            />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AppInputField
                v-model="body.periodStartDate.$model"
                :errors="body.periodStartDate.$errors"
                size="md"
                label="تاريخ بداية الفترة"
                type="date"
                required
              />
              <AppInputField
                v-model="body.periodEndDate.$model"
                :errors="body.periodEndDate.$errors"
                size="md"
                label="تاريخ نهاية الفترة"
                type="date"
                required
              />
            </div>
            
            <AppTextAreaField
              v-if="body.notes"
              v-model="body.notes.$model"
              :errors="body.notes.$errors"
              size="md"
              label="ملاحظات"
              placeholder="ملاحظات إضافية حول دفعة الراتب"
              rows="3"
            />
          </div>
        </div>


      </div>
    </div>
    <template #actions>
      <BaseButton color="primary" class="gap-1" :loading="isLoading" @click="createPayrollBatch">
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        {{ buttonText }}
      </BaseButton>
    </template>
  </AppDialog>
</template>
