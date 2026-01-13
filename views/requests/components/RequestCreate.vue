<script setup lang="ts">
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { useAuthStore } from '~/views/auth/store/auth'
import { useEmployeeStore } from '~/views/employees/store'
import { useRequestTypeStore } from '~/views/request-types/store'
import { useRequestStore } from '../store'
import type { RequestCreateDto } from '../types'

const requestStore = useRequestStore()
const requestTypesStore = useRequestTypeStore()
const employeesStore = useEmployeeStore()
const authStore = useAuthStore()

const validator = new Validator<RequestCreateDto>(
  {
    employeeId: authStore.userData?.id || 0,
    requestTypeId: 0,
    startDate: '',
    endDate: '',
    description: '',
    requestData: '',
    affectsBalance: true,
    balanceDeduction: 0,
  },
  {
    requestTypeId: {
      required: requiredValidator('نوع الطلب مطلوب'),
    },
    startDate: {
      required: requiredValidator('تاريخ البداية مطلوب'),
    },
    endDate: {
      required: requiredValidator('تاريخ النهاية مطلوب'),
    },
    description: {
      required: requiredValidator('وصف الطلب مطلوب'),
    },
  }
)

const body = validator.validation
const isLoading = computed(() => requestStore.isLoading)
const requestTypes = computed(() => requestTypesStore.requestTypes || [])
const employees = computed(() => employeesStore.employees || [])
const selectedRequestType = computed(() => {
  return requestTypes.value.find(rt => rt.id === body.value.requestTypeId.$model)
})
const employeeBalance = computed(() => requestStore.employeeBalance)

// Load data on component mount
onMounted(async () => {
  await requestTypesStore.getRequestTypes()
  // No need to pre-load employees since AppAutoCompleteField will fetch them on search
})

// Watch for request type changes to update balance-related fields
watch(() => body.value.requestTypeId.$model, async (newTypeId) => {
  if (newTypeId) {
    const requestType = requestTypes.value.find(rt => rt.id === newTypeId)
    if (requestType) {
      body.value.affectsBalance.$model = requestType.affectsBalance
      if (requestType.defaultBalanceDeduction) {
        body.value.balanceDeduction.$model = requestType.defaultBalanceDeduction
      }
    }
  }
})

// Watch for employee changes to load balance
watch(() => body.value.employeeId.$model, async (newEmployeeId) => {
  if (newEmployeeId) {
    await requestStore.getEmployeeBalance(newEmployeeId)
  }
})

// Calculate duration when dates change
watch([() => body.value.startDate.$model, () => body.value.endDate.$model], ([startDate, endDate]) => {
  if (startDate && endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    
    if (body.value.affectsBalance.$model) {
      body.value.balanceDeduction.$model = diffDays
    }
  }
})

const createRequest = async () => {
  const isValid = await body.value.$validate()
  if (!isValid) return

  try {
    await requestStore.createRequest(validator.extractBody())
    validator.resetBody()
    requestStore.isCreateDialogOpen = false
  } catch (error) {
    console.error('Error creating request:', error)
  }
}

watch(() => requestStore.isCreateDialogOpen, (val: boolean) => {
  if (val) {
    validator.resetBody()
    // Set default employee ID for current user
    body.value.employeeId.$model = authStore.userData?.employeeId || 0
    if (body.value.employeeId.$model) {
      requestStore.getEmployeeBalance(body.value.employeeId.$model)
    }
  }
})

const isAdmin = computed(() => authStore.userData?.roles.some(role => role.name === 'Admin'))
</script>

<template>
  <AppDialog
    v-model="requestStore.isCreateDialogOpen"
    title="إنشاء طلب جديد"
    size="xl"
    overflow-y="visible"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Employee Selection -->
      <div class="md:col-span-2">
        <AppAutoCompleteField
          v-model="body.employeeId.$model"
          label="الموظف"
          placeholder="البحث عن موظف..."
          get-url="/employee"
          :fetch-on-search="true"
          search-key="search"
          item-label="fullName"
          item-value="id"
          item-subtitle="employeeNumber"
          :error="body.employeeId.$error"
          :error-message="body.employeeId.$errors[0]?.$message"
          required
        >
          <template #item="{ item }">
            <div class="flex items-center justify-between w-full">
              <div>
                <div class="font-medium">{{ item.fullName }}</div>
                <div class="text-sm text-gray-500">{{ item.employeeNumber }} - {{ item.department?.name }}</div>
              </div>
              <div class="text-xs text-gray-400">
                {{ item.position }}
              </div>
            </div>
          </template>
        </AppAutoCompleteField>
      </div>

      <!-- Request Type -->
      <div class="md:col-span-2">
        <AppAutoCompleteField
          v-model="body.requestTypeId.$model"
          label="نوع الطلب"
          placeholder="اختر نوع الطلب"
          :items="requestTypes"
          item-title="name"
          item-value="id"
          :error="body.requestTypeId.$error"
          :error-message="body.requestTypeId.$errors[0]?.$message"
          required
        >
          <template #item="{ item }">
            <div>
              <div class="font-medium">{{ item.name }}</div>
              <div class="text-sm text-gray-500">{{ item.description }}</div>
            </div>
          </template>
        </AppAutoCompleteField>
      </div>

      <!-- Start Date -->
      <AppInputField
        v-model="body.startDate.$model"
        type="date"
        label="تاريخ البداية"
        :error="body.startDate.$error"
        :error-message="body.startDate.$errors[0]?.$message"
        required
      />

      <!-- End Date -->
      <AppInputField
        v-model="body.endDate.$model"
        type="date"
        label="تاريخ النهاية"
        :error="body.endDate.$error"
        :error-message="body.endDate.$errors[0]?.$message"
        required
      />

      <!-- Balance Information -->
      <div v-if="selectedRequestType?.affectsBalance && employeeBalance" class="md:col-span-2">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 class="font-medium text-blue-900 mb-2">معلومات الرصيد</h4>
          <div class="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span class="text-blue-700">الرصيد الحالي:</span>
              <span class="font-medium">{{ employeeBalance.currentBalance }} يوم</span>
            </div>
            <div>
              <span class="text-blue-700">المطلوب خصمه:</span>
              <span class="font-medium">{{ body.balanceDeduction.$model }} يوم</span>
            </div>
            <div>
              <span class="text-blue-700">الرصيد المتبقي:</span>
              <span class="font-medium" :class="{ 'text-red-600': (employeeBalance.currentBalance - body.balanceDeduction.$model) < 0 }">
                {{ employeeBalance.currentBalance - body.balanceDeduction.$model }} يوم
              </span>
            </div>
          </div>
          <div v-if="(employeeBalance.currentBalance - body.balanceDeduction.$model) < 0" class="mt-2 text-red-600 text-sm">
            تحذير: الرصيد المطلوب أكبر من الرصيد المتاح
          </div>
        </div>
      </div>

      <!-- Balance Deduction -->
      <div v-if="selectedRequestType?.affectsBalance">
        <AppInputField
          v-model="body.balanceDeduction.$model"
          type="number"
          label="المدة المطلوب خصمها (أيام)"
          step="0.5"
          min="0"
        />
      </div>

      <!-- Description -->
      <div class="md:col-span-2">
        <AppTextAreaField
          v-model="body.description.$model"
          label="وصف الطلب"
          placeholder="اكتب وصفاً مفصلاً للطلب..."
          rows="4"
          :error="body.description.$error"
          :error-message="body.description.$errors[0]?.$message"
          required
        />
      </div>

      <!-- Additional Request Data -->
      <div class="md:col-span-2">
        <AppTextAreaField
          v-model="body.requestData.$model"
          label="بيانات إضافية (JSON)"
          placeholder='{"destination": "الرياض", "contactNumber": "+966501234567"}'
          rows="3"
        />
        <p class="text-xs text-gray-500 mt-1">
          يمكنك إضافة بيانات إضافية بصيغة JSON (اختياري)
        </p>
      </div>
    </div>

    <template #actions>
      <BaseButton 
        color="gray" 
        @click="requestStore.isCreateDialogOpen = false"
      >
        إلغاء
      </BaseButton>
      <BaseButton 
        color="primary" 
        class="gap-1" 
        :loading="isLoading" 
        @click="createRequest"
        :disabled="employeeBalance && selectedRequestType?.affectsBalance && (employeeBalance.currentBalance - body.balanceDeduction.$model) < 0"
      >
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        إنشاء الطلب
      </BaseButton>
    </template>
  </AppDialog>
</template>
