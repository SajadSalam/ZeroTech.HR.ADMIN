<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { useRequestStore } from '../store'
import type { PendingApprovalDto, ProcessApprovalDto } from '../types'

interface Props {
  approval: PendingApprovalDto
}

const props = defineProps<Props>()
const requestStore = useRequestStore()

const validator = new Validator<ProcessApprovalDto>(
  {
    approvalId: props.approval.id,
    isApproved: true,
    comments: '',
  },
  {
    comments: {
      required: requiredValidator('التعليقات مطلوبة'),
    },
  }
)

const body = validator.validation
const isLoading = computed(() => requestStore.isLoading)
const isApproveMode = ref(true)

const processApproval = async () => {
  body.value.isApproved.$model = isApproveMode.value
  
  const isValid = await body.value.$validate()
  if (!isValid) return

  try {
    await requestStore.processApproval(validator.extractBody())
    validator.resetBody()
    requestStore.isApprovalDialogOpen = false
  } catch (error) {
    console.error('Error processing approval:', error)
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatDateTime = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

watch(() => requestStore.isApprovalDialogOpen, (val: boolean) => {
  if (val) {
    validator.resetBody()
    body.value.approvalId.$model = props.approval.id
    isApproveMode.value = true
  }
})
</script>

<template>
  <AppDialog
    v-model="requestStore.isApprovalDialogOpen"
    title="معالجة الموافقة"
    size="xl"
    overflow-y="visible"
  >
    <!-- Request Summary -->
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <h3 class="font-medium text-gray-900 mb-3">تفاصيل الطلب</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-gray-600">الموظف:</span>
          <span class="font-medium">{{ approval.request.employee.firstName }} {{ approval.request.employee.lastName }}</span>
        </div>
        <div>
          <span class="text-gray-600">نوع الطلب:</span>
          <span class="font-medium">{{ approval.request.requestType.name }}</span>
        </div>
        <div>
          <span class="text-gray-600">تاريخ البداية:</span>
          <span class="font-medium">{{ formatDate(approval.request.startDate) }}</span>
        </div>
        <div>
          <span class="text-gray-600">تاريخ النهاية:</span>
          <span class="font-medium">{{ formatDate(approval.request.endDate) }}</span>
        </div>
      </div>
      <div class="mt-3">
        <span class="text-gray-600">الوصف:</span>
        <p class="text-gray-900 mt-1">{{ approval.request.description }}</p>
      </div>
    </div>

    <!-- Approval Step Info -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 class="font-medium text-blue-900 mb-3">معلومات خطوة الموافقة</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-blue-700">اسم الخطوة:</span>
          <span class="font-medium">{{ approval.approvalStep.stepName }}</span>
        </div>
        <div>
          <span class="text-blue-700">ترتيب الخطوة:</span>
          <span class="font-medium">{{ approval.approvalStep.stepOrder }}</span>
        </div>
        <div>
          <span class="text-blue-700">موعد الاستحقاق:</span>
          <span class="font-medium">{{ formatDateTime(approval.dueAt) }}</span>
        </div>
        <div>
          <span class="text-blue-700">عدد التذكيرات:</span>
          <span class="font-medium">{{ approval.reminderCount }}</span>
        </div>
      </div>
    </div>

    <!-- Decision Selection -->
    <div class="mb-6">
      <label class="text-sm font-medium text-gray-700 mb-3 block">القرار</label>
      <div class="flex gap-4">
        <button
          type="button"
          @click="isApproveMode = true"
          class="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
          :class="isApproveMode 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'"
        >
          <Icon name="ph:check-circle-duotone" class="size-5" />
          موافقة
        </button>
        <button
          type="button"
          @click="isApproveMode = false"
          class="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
          :class="!isApproveMode 
            ? 'bg-red-50 border-red-200 text-red-800' 
            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'"
        >
          <Icon name="ph:x-circle-duotone" class="size-5" />
          رفض
        </button>
      </div>
    </div>

    <!-- Comments -->
    <div class="mb-6">
      <AppTextAreaField
        v-model="body.comments.$model"
        :label="isApproveMode ? 'تعليقات الموافقة' : 'أسباب الرفض'"
        :placeholder="isApproveMode 
          ? 'اكتب تعليقاتك حول الموافقة...' 
          : 'اكتب أسباب رفض الطلب...'"
        rows="4"
        :error="body.comments.$error"
        :error-message="body.comments.$errors[0]?.$message"
        required
      />
    </div>

    <!-- Warning for Rejection -->
    <div v-if="!isApproveMode" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-start gap-3">
        <Icon name="ph:warning-duotone" class="size-5 text-red-600 mt-0.5" />
        <div>
          <h4 class="font-medium text-red-900">تحذير</h4>
          <p class="text-red-700 text-sm mt-1">
            رفض هذا الطلب سيؤدي إلى إنهاء عملية الموافقة بالكامل ولن يتمكن الطلب من المتابعة إلى الخطوات التالية.
          </p>
        </div>
      </div>
    </div>

    <template #actions>
      <BaseButton 
        color="gray" 
        @click="requestStore.isApprovalDialogOpen = false"
      >
        إلغاء
      </BaseButton>
      <BaseButton 
        :color="isApproveMode ? 'green' : 'red'"
        class="gap-1" 
        :loading="isLoading" 
        @click="processApproval"
      >
        <Icon 
          :name="isApproveMode ? 'ph:check-circle-duotone' : 'ph:x-circle-duotone'" 
          class="size-5" 
        />
        {{ isApproveMode ? 'موافقة' : 'رفض' }}
      </BaseButton>
    </template>
  </AppDialog>
</template>
