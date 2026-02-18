<script setup lang="ts">
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { useApprovalChainStore } from '../store'
import type { ApprovalStepCreateDto, ApprovalStepUpdateDto } from '../types'

const approvalChainStore = useApprovalChainStore()

const isEditing = computed(() => approvalChainStore.isEditingStep)
const selectedStep = computed(() => approvalChainStore.selectedStep)

const validator = new Validator<ApprovalStepCreateDto | ApprovalStepUpdateDto>(
  {
    approvalChainId: 0,
    name: '',
    description: '',
    stepOrder: 1,
    isRequired: true,
    allowsAutoApproval: false,
    autoApprovalConditions: '',
    allowsParallelApproval: false,
    minRequiredApprovals: 1,
    requiresAllApprovers: false,
    maxCompletionHours: 24,
    sendReminders: true,
    firstReminderHours: 12,
    reminderIntervalHours: 6,
    maxReminders: 3,
    timeoutAction: 'Escalate',
    escalationUserId: undefined,
    activationConditions: '',
    isActive: true,
  },
  {
    name: {
      required: requiredValidator('اسم الخطوة مطلوب'),
    },
    stepOrder: {
      required: requiredValidator('ترتيب الخطوة مطلوب'),
    },
  }
)

const body = validator.validation
const isLoading = computed(() => approvalChainStore.isLoading)

const timeoutActions = [
  { value: 'AutoApprove', label: 'موافقة تلقائية' },
  { value: 'AutoReject', label: 'رفض تلقائي' },
  { value: 'Escalate', label: 'تصعيد' },
  { value: 'NextStep', label: 'الخطوة التالية' },
  { value: 'Notify', label: 'إشعار فقط' },
]

const route = useRoute()
const saveStep = async () => {
  const isValid = await body.value.$validate()
  if (!isValid) return
  
  try {
    const stepData = validator.extractBody()
    stepData.approvalChainId = Number(route.params.id)
    
    if (isEditing.value && selectedStep.value) {
      await approvalChainStore.updateApprovalStep(selectedStep.value.id, stepData as ApprovalStepUpdateDto)
    } else {
      await approvalChainStore.createApprovalStep(stepData as ApprovalStepCreateDto)
    }
    
    validator.resetBody()
    approvalChainStore.isStepDialogOpen = false
  } catch (error) {
    console.error('Error saving approval step:', error)
  }
}

</script>

<template>
  <AppDialog
    v-model="approvalChainStore.isStepDialogOpen"
    :title="isEditing ? 'تعديل خطوة الموافقة' : 'إضافة خطوة موافقة جديدة'"
    size="4xl"
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
            label="اسم الخطوة"
            placeholder="أدخل اسم خطوة الموافقة"
            :error="body.name.$error"
            :error-message="body.name.$errors[0]?.$message"
            required
          />

          <AppInputField
            v-model="body.stepOrder.$model"
            label="ترتيب الخطوة"
            placeholder="1"
            type="number"
            min="1"
            :error="body.stepOrder.$error"
            :error-message="body.stepOrder.$errors[0]?.$message"
            required
          />
        </div>

        <AppTextAreaField
          v-model="body.description.$model"
          label="الوصف"
          placeholder="أدخل وصف خطوة الموافقة"
          rows="3"
        />
      </div>

      <!-- Approval Settings -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-muted-800 dark:text-muted-100">
          إعدادات الموافقة
        </h3>

        <!-- Checkboxes -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <BaseCheckbox
                v-model="body.isRequired.$model"
                label="خطوة مطلوبة"
                color="danger"
              />
            </div>
            
            <div class="flex items-center gap-3">
              <BaseCheckbox
                v-model="body.allowsAutoApproval.$model"
                label="السماح بالموافقة التلقائية"
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
                v-model="body.isActive.$model"
                label="نشط"
                color="success"
              />
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <BaseCheckbox
                v-model="body.sendReminders.$model"
                label="إرسال تذكيرات"
                color="warning"
              />
            </div>
            
            <div v-if="body.allowsParallelApproval.$model" class="flex items-center gap-3">
              <BaseCheckbox
                v-model="body.requiresAllApprovers.$model"
                label="يتطلب موافقة جميع المعتمدين"
                color="info"
              />
            </div>
          </div>
        </div>

        <!-- Parallel Approval Settings -->
        <div v-if="body.allowsParallelApproval.$model && !body.requiresAllApprovers.$model">
          <AppInputField
            v-model="body.minRequiredApprovals.$model"
            label="الحد الأدنى للموافقات المطلوبة"
            placeholder="1"
            type="number"
            min="1"
          />
        </div>
      </div>

      <!-- Timing Settings -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-muted-800 dark:text-muted-100">
          إعدادات التوقيت
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInputField
            v-model="body.maxCompletionHours.$model"
            label="الحد الأقصى للإنجاز (ساعة)"
            placeholder="24"
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

        <!-- Reminder Settings -->
        <div v-if="body.sendReminders.$model" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AppInputField
            v-model="body.firstReminderHours.$model"
            label="أول تذكير بعد (ساعة)"
            placeholder="12"
            type="number"
            min="1"
          />

          <AppInputField
            v-model="body.reminderIntervalHours.$model"
            label="فترة التذكير (ساعة)"
            placeholder="6"
            type="number"
            min="1"
          />

          <AppInputField
            v-model="body.maxReminders.$model"
            label="الحد الأقصى للتذكيرات"
            placeholder="3"
            type="number"
            min="1"
          />
        </div>

        <!-- Escalation User -->
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
      </div>
      <!-- Preview -->
      <div class="p-4 bg-muted-50 dark:bg-muted-800 rounded-lg">
        <h4 class="text-sm font-medium text-muted-700 dark:text-muted-300 mb-3">
          معاينة الخطوة
        </h4>
        <div class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-muted-600 dark:text-muted-400">الاسم:</span>
            <span class="font-medium">{{ body.name.$model || 'غير محدد' }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-muted-600 dark:text-muted-400">الترتيب:</span>
            <BaseTag color="primary" variant="pastel" size="sm">
              {{ body.stepOrder.$model || 1 }}
            </BaseTag>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-muted-600 dark:text-muted-400">الحد الأقصى:</span>
            <span class="font-medium">{{ body.maxCompletionHours.$model || 24 }} ساعة</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-muted-600 dark:text-muted-400">الحالة:</span>
            <div class="flex gap-1">
              <BaseTag
                v-if="body.isRequired.$model"
                color="danger"
                variant="pastel"
                size="sm"
              >
                مطلوب
              </BaseTag>
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
    </div>

    <template #actions>
      <BaseButton 
        color="muted" 
        @click="approvalChainStore.isStepDialogOpen = false"
      >
        إلغاء
      </BaseButton>
      <BaseButton 
        color="primary" 
        class="gap-1" 
        :loading="isLoading" 
        @click="saveStep"
      >
        <Icon :name="isEditing ? 'ph:floppy-disk-duotone' : 'ph:plus-duotone'" class="size-5" />
        {{ isEditing ? 'حفظ التغييرات' : 'إضافة الخطوة' }}
      </BaseButton>
    </template>
  </AppDialog>
</template>
