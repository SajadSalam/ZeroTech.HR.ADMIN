<script setup lang="ts">
import { useRequestStore } from '../store'
import type { RequestDto } from '../types'
import { RequestStatus } from '../types'
import RequestStatusTracker from './RequestStatusTracker.vue'

interface Props {
  request: RequestDto
}

const props = defineProps<Props>()
const requestStore = useRequestStore()

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

const getApprovalStatusText = (status: number) => {
  switch (status) {
    case 1: return 'في الانتظار'
    case 2: return 'موافق عليه'
    case 3: return 'مرفوض'
    default: return 'غير معروف'
  }
}

const getApprovalStatusColor = (status: number) => {
  switch (status) {
    case 1: return 'yellow'
    case 2: return 'green'
    case 3: return 'red'
    default: return 'gray'
  }
}

const parseRequestData = (data: string) => {
  try {
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

const requestData = computed(() => parseRequestData(props.request.requestData || ''))
</script>

<template>
  <div class="space-y-6">
    <!-- Request Header -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <div class="flex items-start justify-between mb-4">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">
            طلب رقم #{{ request.id }}
          </h2>
          <p class="text-gray-600 mt-1">{{ request.requestType.name }}</p>
        </div>
        <span class="px-3 py-1 rounded-full text-sm font-medium"
              :class="`bg-${requestStore.getStatusColor(request.status)}-100 text-${requestStore.getStatusColor(request.status)}-800`">
          {{ requestStore.getStatusText(request.status) }}
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="text-sm font-medium text-gray-700">الموظف</label>
          <p class="text-gray-900">{{ request.employee.firstName }} {{ request.employee.lastName }}</p>
          <p class="text-sm text-gray-500">{{ request.employee.email }}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">تاريخ البداية</label>
          <p class="text-gray-900">{{ formatDate(request.startDate) }}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">تاريخ النهاية</label>
          <p class="text-gray-900">{{ formatDate(request.endDate) }}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">المدة</label>
          <p class="text-gray-900">{{ request.durationDays || 'غير محدد' }} يوم</p>
        </div>
      </div>
    </div>

    <!-- Request Description -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-3">وصف الطلب</h3>
      <p class="text-gray-700 whitespace-pre-wrap">{{ request.description }}</p>
    </div>

    <!-- Balance Information -->
    <div v-if="request.affectsBalance" class="bg-white border border-gray-200 rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-3">معلومات الرصيد</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="text-sm text-blue-700">يؤثر على الرصيد</div>
          <div class="text-lg font-semibold text-blue-900">
            {{ request.affectsBalance ? 'نعم' : 'لا' }}
          </div>
        </div>
        <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div class="text-sm text-orange-700">المبلغ المخصوم</div>
          <div class="text-lg font-semibold text-orange-900">
            {{ request.balanceDeduction || 0 }} يوم
          </div>
        </div>
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="text-sm text-green-700">تم الخصم</div>
          <div class="text-lg font-semibold text-green-900">
            {{ request.balanceDeducted ? 'نعم' : 'لا' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Request Data -->
    <div v-if="requestData" class="bg-white border border-gray-200 rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-3">بيانات إضافية</h3>
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <pre class="text-sm text-gray-700 whitespace-pre-wrap">{{ JSON.stringify(requestData, null, 2) }}</pre>
      </div>
    </div>

    <!-- Request Status Tracker -->
    <RequestStatusTracker :request="request" />

    <!-- Request Timeline -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">التسلسل الزمني</h3>
      
      <div class="space-y-3">
        <div class="flex items-center gap-3 text-sm">
          <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span class="text-gray-600">تم تقديم الطلب في:</span>
          <span class="font-medium">{{ formatDateTime(request.submittedAt) }}</span>
        </div>

        <div v-if="request.completedAt" class="flex items-center gap-3 text-sm">
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          <span class="text-gray-600">تم إكمال الطلب في:</span>
          <span class="font-medium">{{ formatDateTime(request.completedAt) }}</span>
        </div>

        <div v-if="request.status === RequestStatus.InProgress" class="flex items-center gap-3 text-sm">
          <div class="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span class="text-gray-600">الطلب قيد المراجعة حالياً</span>
        </div>
      </div>
    </div>

    <!-- Attachments -->
    <div v-if="request.requestAttachments.length > 0" class="bg-white border border-gray-200 rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">المرفقات</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="attachment in request.requestAttachments" 
          :key="attachment.id"
          class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <Icon name="ph:file-duotone" class="size-8 text-gray-400" />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ attachment.fileName }}
              </p>
              <p class="text-xs text-gray-500">
                {{ (attachment.fileSize / 1024).toFixed(1) }} KB
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
