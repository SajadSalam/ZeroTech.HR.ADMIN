<script setup lang="ts">
import { computed, watch } from 'vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { useRequestStore } from '../store'
import type { CancelRequestDto } from '../types'
import { RequestStatus } from '../types'

const requestStore = useRequestStore()

const validator = new Validator<CancelRequestDto>(
  {
    requestId: 0,
    reason: '',
  },
  {
    reason: {
      required: requiredValidator('سبب الإلغاء مطلوب'),
    },
  }
)

const body = validator.validation
const isLoading = computed(() => requestStore.isLoading)
const selectedRequest = computed(() => requestStore.selectedRequest)

// Check if request can be cancelled
const canCancel = computed(() => {
  if (!selectedRequest.value) return false
  return selectedRequest.value.status === RequestStatus.Submitted || 
         selectedRequest.value.status === RequestStatus.InProgress ||
         selectedRequest.value.status === RequestStatus.ApprovedPartially
})

const cancelRequest = async () => {
  const isValid = await body.value.$validate()
  if (!isValid) return

  try {
    await requestStore.cancelRequest(validator.extractBody())
    validator.resetBody()
    requestStore.isCancelDialogOpen = false
  } catch (error) {
    console.error('Error cancelling request:', error)
  }
}

watch(() => requestStore.isCancelDialogOpen, (val: boolean) => {
  if (val && selectedRequest.value) {
    validator.resetBody()
    body.value.requestId.$model = selectedRequest.value.id
  }
})

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <AppDialog
    v-model="requestStore.isCancelDialogOpen"
    title="إلغاء الطلب"
    size="lg"
    overflow-y="visible"
  >
    <div v-if="!canCancel" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <Icon name="ph:warning-duotone" class="size-5 text-red-600 ml-2" />
        <span class="text-red-800">لا يمكن إلغاء هذا الطلب في حالته الحالية</span>
      </div>
    </div>

    <!-- Request Summary -->
    <div v-if="selectedRequest" class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <h3 class="font-medium text-gray-900 mb-3">تفاصيل الطلب المراد إلغاؤه</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-gray-600">رقم الطلب:</span>
          <span class="font-medium">#{{ selectedRequest.id }}</span>
        </div>
        <div>
          <span class="text-gray-600">نوع الطلب:</span>
          <span class="font-medium">{{ selectedRequest.requestType.name }}</span>
        </div>
        <div>
          <span class="text-gray-600">تاريخ البداية:</span>
          <span class="font-medium">{{ formatDate(selectedRequest.startDate) }}</span>
        </div>
        <div>
          <span class="text-gray-600">تاريخ النهاية:</span>
          <span class="font-medium">{{ formatDate(selectedRequest.endDate) }}</span>
        </div>
        <div>
          <span class="text-gray-600">الحالة الحالية:</span>
          <span class="px-2 py-1 rounded-full text-xs font-medium"
                :class="`bg-${requestStore.getStatusColor(selectedRequest.status)}-100 text-${requestStore.getStatusColor(selectedRequest.status)}-800`">
            {{ requestStore.getStatusText(selectedRequest.status) }}
          </span>
        </div>
        <div>
          <span class="text-gray-600">المدة:</span>
          <span class="font-medium">{{ selectedRequest.durationDays || 'غير محدد' }} يوم</span>
        </div>
      </div>
      <div class="mt-3">
        <span class="text-gray-600">الوصف:</span>
        <p class="text-gray-900 mt-1">{{ selectedRequest.description }}</p>
      </div>
    </div>

    <!-- Warning Message -->
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div class="flex items-start gap-3">
        <Icon name="ph:warning-duotone" class="size-5 text-yellow-600 mt-0.5" />
        <div>
          <h4 class="font-medium text-yellow-900">تنبيه مهم</h4>
          <p class="text-yellow-700 text-sm mt-1">
            إلغاء الطلب سيؤدي إلى إيقاف عملية الموافقة نهائياً. لن يتمكن أي شخص من الموافقة على هذا الطلب بعد الإلغاء.
          </p>
          <p class="text-yellow-700 text-sm mt-1">
            إذا كان الطلب يؤثر على الرصيد وتم خصم أيام، فسيتم إرجاع الأيام المخصومة إلى رصيدك.
          </p>
        </div>
      </div>
    </div>

    <!-- Cancellation Reason -->
    <div class="mb-6">
      <AppTextAreaField
        v-model="body.reason.$model"
        label="سبب الإلغاء"
        placeholder="اكتب سبب إلغاء الطلب..."
        rows="4"
        :error="body.reason.$error"
        :error-message="body.reason.$errors[0]?.$message"
        :disabled="!canCancel"
        required
      />
      <p class="text-xs text-gray-500 mt-1">
        سيتم إرسال سبب الإلغاء إلى جميع المسؤولين المعنيين بالطلب
      </p>
    </div>

    <!-- Balance Impact -->
    <div v-if="selectedRequest?.affectsBalance && selectedRequest?.balanceDeducted" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div class="flex items-start gap-3">
        <Icon name="ph:info-duotone" class="size-5 text-green-600 mt-0.5" />
        <div>
          <h4 class="font-medium text-green-900">استرداد الرصيد</h4>
          <p class="text-green-700 text-sm mt-1">
            سيتم إرجاع {{ selectedRequest.balanceDeduction }} يوم إلى رصيدك عند إلغاء هذا الطلب.
          </p>
        </div>
      </div>
    </div>

    <template #actions>
      <BaseButton 
        color="gray" 
        @click="requestStore.isCancelDialogOpen = false"
      >
        تراجع
      </BaseButton>
      <BaseButton 
        v-if="canCancel"
        color="red" 
        class="gap-1" 
        :loading="isLoading" 
        @click="cancelRequest"
      >
        <Icon name="ph:x-circle-duotone" class="size-5" />
        إلغاء الطلب
      </BaseButton>
    </template>
  </AppDialog>
</template>
