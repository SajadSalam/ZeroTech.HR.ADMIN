<script setup lang="ts">
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { useApprovalChainStore } from '../store'
import type { ApprovalChainCreateDto } from '../types'

const approvalChainStore = useApprovalChainStore()

const validator = new Validator<ApprovalChainCreateDto>(
  {
    requestTypeId: 0,
    departmentId: 0,
    name: '',
    description: '',
    isActive: true,
    priority: 1,
    activationConditions: '',
    allowsParallelApproval: false,
    allowsStepSkipping: false,
    maxCompletionHours: 72,
    timeoutAction: 'Escalate',
    escalationUserId: undefined,
  },
  // {
  //   requestTypeId: {
  //     required: requiredValidator('نوع الطلب مطلوب'),
  //   },
  //   departmentId: {
  //     required: requiredValidator('القسم مطلوب'),
  //   },
  //   name: {
  //     required: requiredValidator('اسم السلسلة مطلوب'),
  //   },
  // }
)

const body = validator.validation
const isLoading = computed(() => approvalChainStore.isLoading)

const timeoutActions = [
  { value: 'AutoApprove', label: 'موافقة تلقائية' },
  { value: 'AutoReject', label: 'رفض تلقائي' },
  { value: 'Escalate', label: 'تصعيد' },
  { value: 'Notify', label: 'إشعار فقط' },
]

const createApprovalChain = async () => {
//   const isValid = await body.value.$validate()
//   console.log(body.value.$errors)
//   if (!isValid) return
  
  try {
    const bodyData = validator.extractBody()
    if(!bodyData.priority) {
        bodyData.priority = 1
    }
    //allowsParallelApproval
    if(!bodyData.allowsParallelApproval) {
        bodyData.allowsParallelApproval = false
    }
    //allowsStepSkipping
    if(!bodyData.allowsStepSkipping) {
        bodyData.allowsStepSkipping = false
    }
    //isActive
    if(!bodyData.isActive) {
        bodyData.isActive = true
    }
    await approvalChainStore.createApprovalChain(bodyData as ApprovalChainCreateDto)
    validator.resetBody()
    approvalChainStore.isCreateDialogOpen = false
  } catch (error) {
    console.error('Error creating approval chain:', error)
  }
}

watch(() => approvalChainStore.isCreateDialogOpen, (val: boolean) => {
  if (val) validator.resetBody()
})
</script>

<template>
  <AppDialog
    v-model="approvalChainStore.isCreateDialogOpen"
    title="إنشاء سلسلة موافقات جديدة"
    size="3xl"
    overflow-y="visible"
  >
    <div class="space-y-6">
      <!-- Basic Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-muted-800 dark:text-muted-100">
          المعلومات الأساسية
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInputField
            v-model="body.name.$model"
            label="اسم السلسلة"
            placeholder="أدخل اسم سلسلة الموافقات"
            :error="body.name.$error"
            :error-message="body.name.$errors[0]?.$message"
            required
          />

          <AppInputField
            v-model="body.priority.$model"
            label="الأولوية"
            placeholder="1"
            type="number"
            min="1"
          />
        </div>

        <AppTextAreaField
          v-model="body.description.$model"
          label="الوصف"
          placeholder="أدخل وصف سلسلة الموافقات"
          rows="3"
        />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppAutoCompleteField
            v-model="body.requestTypeId.$model"
            label="نوع الطلب"
            placeholder="اختر نوع الطلب"
            get-url="/RequestType"
            item-label="name"
            item-value="id"
            fetch-on-search
            search-key="name"
            :error="body.requestTypeId.$error"
            :error-message="body.requestTypeId.$errors[0]?.$message"
            required
          />

          <AppAutoCompleteField
            v-model="body.departmentId.$model"
            label="القسم"
            placeholder="اختر القسم"
            get-url="/Department"
            item-label="name"
            item-value="id"
            fetch-on-search
            search-key="name"
            :error="body.departmentId.$error"
            :error-message="body.departmentId.$errors[0]?.$message"
            required
          />
        </div>
      </div>

      <!-- Settings -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-muted-800 dark:text-muted-100">
          إعدادات السلسلة
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInputField
            v-model="body.maxCompletionHours.$model"
            label="الحد الأقصى للإنجاز (ساعة)"
            placeholder="72"
            type="number"
            min="1"
          />

          <div class="space-y-2">
            <label class="text-sm font-medium text-muted-700 dark:text-muted-300">
              إجراء انتهاء المهلة
            </label>
            <BaseSelect v-model="body.timeoutAction.$model">
              <option value="">اختر الإجراء</option>
              <option
                v-for="action in timeoutActions"
                :key="action.value"
                :value="action.value"
              >
                {{ action.label }}
              </option>
            </BaseSelect>
          </div>
        </div>

        <div v-if="body.timeoutAction.$model === 'Escalate'">
          <AppAutoCompleteField
            v-model="body.escalationUserId.$model"
            label="مستخدم التصعيد"
            placeholder="اختر المستخدم للتصعيد"
            get-url="/user"
            item-label="username"
            item-value="id"
            fetch-on-search
            search-key="username"
          />
        </div>

        <!-- Checkboxes -->
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <BaseCheckbox
              v-model="body.isActive.$model"
              label="نشط"
              color="success"
            />
          </div>
          
          <div class="flex items-center gap-3">
            <BaseCheckbox
              v-model="body.allowsParallelApproval.$model"
              label="السماح بالموافقة المتوازية"
              color="primary"
            />
          </div>
          
          <div class="flex items-center gap-3">
            <BaseCheckbox
              v-model="body.allowsStepSkipping.$model"
              label="السماح بتخطي الخطوات"
              color="warning"
            />
          </div>
        </div>
      </div>

      <!-- Advanced Settings -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-muted-800 dark:text-muted-100">
          الإعدادات المتقدمة
        </h3>

        <AppTextAreaField
          v-model="body.activationConditions.$model"
          label="شروط التفعيل (JSON)"
          placeholder='{"minDays": 5, "maxAmount": 10000}'
          rows="3"
        />
      </div>

      <!-- Preview -->
      <div class="p-4 bg-muted-50 dark:bg-muted-800 rounded-lg">
        <h4 class="text-sm font-medium text-muted-700 dark:text-muted-300 mb-3">
          معاينة السلسلة
        </h4>
        <div class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-muted-600 dark:text-muted-400">الاسم:</span>
            <span class="font-medium">{{ body.name.$model || 'غير محدد' }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-muted-600 dark:text-muted-400">الأولوية:</span>
            <BaseTag color="primary" variant="pastel" size="sm">
              {{ body.priority.$model || 1 }}
            </BaseTag>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-muted-600 dark:text-muted-400">الحد الأقصى:</span>
            <span class="font-medium">{{ body.maxCompletionHours.$model || 72 }} ساعة</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-muted-600 dark:text-muted-400">الحالة:</span>
            <BaseTag
              :color="body.isActive.$model ? 'success' : 'muted'"
              variant="pastel"
              size="sm"
            >
              {{ body.isActive.$model ? 'نشط' : 'غير نشط' }}
            </BaseTag>
          </div>
        </div>
      </div>
    </div>

    <template #actions>
      <BaseButton 
        color="muted" 
        @click="approvalChainStore.isCreateDialogOpen = false"
      >
        إلغاء
      </BaseButton>
      <BaseButton 
        color="primary" 
        class="gap-1" 
        :loading="isLoading" 
        @click="createApprovalChain"
      >
        <Icon name="ph:plus-duotone" class="size-5" />
        إنشاء السلسلة
      </BaseButton>
    </template>
  </AppDialog>
</template>
