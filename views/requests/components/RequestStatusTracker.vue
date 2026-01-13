<script setup lang="ts">
import { computed } from 'vue'
import type { RequestDto } from '../types'
import { RequestStatus } from '../types'

interface Props {
  request: RequestDto
  showTitle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showTitle: true,
})

const getStepStatus = (stepOrder: number, currentStep: number, requestStatus: RequestStatus) => {
  if (requestStatus === RequestStatus.Rejected || requestStatus === RequestStatus.Cancelled) {
    return stepOrder <= currentStep ? 'rejected' : 'pending'
  }
  
  if (requestStatus === RequestStatus.Completed) {
    return 'completed'
  }
  
  if (stepOrder < currentStep) {
    return 'completed'
  } else if (stepOrder === currentStep) {
    return 'active'
  } else {
    return 'pending'
  }
}

const getStepIcon = (status: string) => {
  switch (status) {
    case 'completed': return 'ph:check-circle-fill'
    case 'active': return 'ph:clock-fill'
    case 'rejected': return 'ph:x-circle-fill'
    default: return 'ph:circle'
  }
}

const getStepColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-green-600'
    case 'active': return 'text-blue-600'
    case 'rejected': return 'text-red-600'
    default: return 'text-gray-400'
  }
}

const getConnectorColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-600'
    case 'active': return 'bg-blue-600'
    case 'rejected': return 'bg-red-600'
    default: return 'bg-gray-300'
  }
}

const formatDateTime = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getStatusText = (status: RequestStatus) => {
  switch (status) {
    case RequestStatus.Submitted: return 'مُقدم'
    case RequestStatus.InProgress: return 'قيد المراجعة'
    case RequestStatus.ApprovedPartially: return 'موافق عليه جزئياً'
    case RequestStatus.Approved: return 'موافق عليه'
    case RequestStatus.Rejected: return 'مرفوض'
    case RequestStatus.Completed: return 'مكتمل'
    case RequestStatus.Cancelled: return 'ملغي'
    default: return 'غير معروف'
  }
}

const getStatusColor = (status: RequestStatus) => {
  switch (status) {
    case RequestStatus.Submitted: return 'blue'
    case RequestStatus.InProgress: return 'yellow'
    case RequestStatus.ApprovedPartially: return 'orange'
    case RequestStatus.Approved: return 'green'
    case RequestStatus.Rejected: return 'red'
    case RequestStatus.Completed: return 'emerald'
    case RequestStatus.Cancelled: return 'gray'
    default: return 'gray'
  }
}

// Create timeline steps including submission and completion
const timelineSteps = computed(() => {
  const steps = []
  
  // Submission step
  steps.push({
    id: 'submission',
    title: 'تقديم الطلب',
    description: 'تم تقديم الطلب بنجاح',
    timestamp: props.request.submittedAt,
    status: 'completed',
    employee: props.request.employee,
  })
  
  // Approval steps
  props.request.requestApprovals.forEach((approval) => {
    const stepStatus = getStepStatus(
      approval.approvalStep.stepOrder,
      props.request.currentStepOrder || 1,
      props.request.status
    )
    
    steps.push({
      id: `approval-${approval.id}`,
      title: approval.approvalStep.stepName,
      description: approval.comments || 'في انتظار الموافقة',
      timestamp: approval.approvedAt || approval.rejectedAt || approval.dueAt,
      status: stepStatus,
      employee: approval.approverEmployee,
      dueAt: approval.dueAt,
      isApproval: true,
      approvalStatus: approval.approvalStatus,
    })
  })
  
  // Completion step (if applicable)
  if (props.request.status === RequestStatus.Completed && props.request.completedAt) {
    steps.push({
      id: 'completion',
      title: 'اكتمال الطلب',
      description: 'تم إكمال الطلب وخصم الرصيد (إن وجد)',
      timestamp: props.request.completedAt,
      status: 'completed',
    })
  }
  
  return steps
})
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <div v-if="showTitle" class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-medium text-gray-900">تتبع حالة الطلب</h3>
      <span class="px-3 py-1 rounded-full text-sm font-medium"
            :class="`bg-${getStatusColor(request.status)}-100 text-${getStatusColor(request.status)}-800`">
        {{ getStatusText(request.status) }}
      </span>
    </div>

    <!-- Progress Bar -->
    <div class="mb-8">
      <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span>التقدم</span>
        <span>
          {{ request.requestApprovals.filter(a => a.approvalStatus === 2).length }} / 
          {{ request.requestApprovals.length }} خطوات مكتملة
        </span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="h-2 rounded-full transition-all duration-300"
          :class="`bg-${getStatusColor(request.status)}-500`"
          :style="{ 
            width: `${(request.requestApprovals.filter(a => a.approvalStatus === 2).length / Math.max(request.requestApprovals.length, 1)) * 100}%` 
          }"
        ></div>
      </div>
    </div>

    <!-- Timeline -->
    <div class="relative">
      <div class="absolute right-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      
      <div class="space-y-6">
        <div
          v-for="(step, index) in timelineSteps"
          :key="step.id"
          class="relative flex items-start gap-4"
        >
          <!-- Step Icon -->
          <div class="relative z-10 flex-shrink-0">
            <div class="w-8 h-8 rounded-full flex items-center justify-center"
                 :class="`bg-white border-2 border-${getStatusColor(request.status)}-500`">
              <Icon 
                :name="getStepIcon(step.status)" 
                class="size-4"
                :class="getStepColor(step.status)"
              />
            </div>
          </div>

          <!-- Step Content -->
          <div class="flex-1 min-w-0 pb-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4 class="text-sm font-medium text-gray-900">{{ step.title }}</h4>
                <p class="text-sm text-gray-600 mt-1">{{ step.description }}</p>
                
                <!-- Employee Info -->
                <div v-if="step.employee" class="text-xs text-gray-500 mt-1">
                  {{ step.employee.firstName }} {{ step.employee.lastName }}
                </div>
                
                <!-- Due Date (for pending approvals) -->
                <div v-if="step.status === 'active' && step.dueAt" class="text-xs text-orange-600 mt-1">
                  موعد الاستحقاق: {{ formatDateTime(step.dueAt) }}
                </div>
              </div>
              
              <!-- Timestamp -->
              <div class="text-xs text-gray-500 text-left">
                {{ formatDateTime(step.timestamp) }}
              </div>
            </div>

            <!-- Approval Status Badge -->
            <div v-if="step.isApproval" class="mt-2">
              <span 
                v-if="step.approvalStatus === 1"
                class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium"
              >
                في الانتظار
              </span>
              <span 
                v-else-if="step.approvalStatus === 2"
                class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
              >
                موافق عليه
              </span>
              <span 
                v-else-if="step.approvalStatus === 3"
                class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium"
              >
                مرفوض
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="mt-8 pt-6 border-t border-gray-200">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div class="text-2xl font-bold text-blue-600">{{ request.requestApprovals.length }}</div>
          <div class="text-sm text-gray-600">إجمالي الخطوات</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-green-600">
            {{ request.requestApprovals.filter(a => a.approvalStatus === 2).length }}
          </div>
          <div class="text-sm text-gray-600">خطوات مكتملة</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-yellow-600">
            {{ request.requestApprovals.filter(a => a.approvalStatus === 1).length }}
          </div>
          <div class="text-sm text-gray-600">في الانتظار</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-red-600">
            {{ request.requestApprovals.filter(a => a.approvalStatus === 3).length }}
          </div>
          <div class="text-sm text-gray-600">مرفوضة</div>
        </div>
      </div>
    </div>
  </div>
</template>
