<script setup lang="ts">
import { formatDate, formatDateTime } from '~/services/formatters'
import ApprovalProcess from '~/views/requests/components/ApprovalProcess.vue'
import { useRequestStore } from '~/views/requests/store'
import type { PendingApprovalDto } from '~/views/requests/types'

definePageMeta({
  title: 'الموافقات المعلقة',
  description: 'إدارة الطلبات المعلقة التي تحتاج موافقة',
})

const requestStore = useRequestStore()

const isLoading = computed(() => requestStore.isLoading)
const pendingApprovals = computed(() => requestStore.pendingApprovals || [])


const isOverdue = (dueDate: string) => {
  return new Date(dueDate) < new Date()
}

const getDaysUntilDue = (dueDate: string) => {
  const due = new Date(dueDate)
  const now = new Date()
  const diffTime = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const handleApproval = (approval: PendingApprovalDto) => {
  requestStore.openApprovalDialog(approval.id, approval.request as any)
}

const loadPendingApprovals = async () => {
  await requestStore.getPendingApprovals()
}

// Load data on mount
onMounted(() => {
  loadPendingApprovals()
})

// Auto-refresh every 30 seconds
const refreshInterval = setInterval(() => {
  if (!requestStore.isApprovalDialogOpen) {
    loadPendingApprovals()
  }
}, 30000)

onUnmounted(() => {
  clearInterval(refreshInterval)
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">الموافقات المعلقة</h1>
        <p class="text-gray-600 mt-1">إدارة الطلبات التي تحتاج موافقتك</p>
      </div>
      
      <div class="flex items-center gap-4">
        <!-- Refresh Button -->
        <BaseButton
          color="gray"
          variant="outline"
          @click="loadPendingApprovals"
          :loading="isLoading"
        >
          <Icon name="ph:arrow-clockwise-duotone" class="size-4 ml-1" />
          تحديث
        </BaseButton>

        <!-- Pending Count Badge -->
        <div class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
          {{ pendingApprovals.length }} طلب معلق
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && pendingApprovals.length === 0" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p class="text-gray-600">جاري تحميل الموافقات المعلقة...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="pendingApprovals.length === 0" class="text-center py-12">
      <Icon name="ph:check-circle-duotone" class="size-16 text-green-400 mx-auto mb-4" />
      <h2 class="text-xl font-semibold text-gray-900 mb-2">لا توجد موافقات معلقة</h2>
      <p class="text-gray-600">جميع الطلبات المخصصة لك تمت معالجتها</p>
    </div>

    <!-- Pending Approvals List -->
    <div v-else class="space-y-4">
      <div
        v-for="approval in pendingApprovals"
        :key="approval.id"
        class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        :class="{ 'border-red-300 bg-red-50': isOverdue(approval.dueAt) }"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <!-- Request Header -->
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-semibold text-gray-900">
                طلب #{{ approval.request.id }}
              </h3>
              <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {{ approval.request.requestType.name }}
              </span>
              <span v-if="isOverdue(approval.dueAt)" class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                متأخر
              </span>
            </div>

            <!-- Employee Info -->
            <div class="text-gray-600 mb-3">
              <span class="font-medium">الموظف:</span>
              {{ approval.request.employee.firstName }} {{ approval.request.employee.lastName }}
            </div>

            <!-- Request Details -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <span class="text-sm text-gray-500">تاريخ البداية:</span>
                <div class="font-medium">{{ formatDate(approval.request.startDate) }}</div>
              </div>
              <div>
                <span class="text-sm text-gray-500">تاريخ النهاية:</span>
                <div class="font-medium">{{ formatDate(approval.request.endDate) }}</div>
              </div>
              <div>
                <span class="text-sm text-gray-500">موعد الاستحقاق:</span>
                <div class="font-medium" :class="{ 'text-red-600': isOverdue(approval.dueAt) }">
                  {{ formatDateTime(approval.dueAt) }}
                </div>
              </div>
            </div>

            <!-- Request Description -->
            <div class="mb-4">
              <span class="text-sm text-gray-500">وصف الطلب:</span>
              <p class="text-gray-900 mt-1">{{ approval.request.description }}</p>
            </div>

            <!-- Approval Step Info -->
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-sm text-gray-500">خطوة الموافقة:</span>
                  <div class="font-medium">{{ approval.approvalStep.stepName }}</div>
                </div>
                <div class="text-right">
                  <span class="text-sm text-gray-500">ترتيب الخطوة:</span>
                  <div class="font-medium">{{ approval.approvalStep.stepOrder }}</div>
                </div>
              </div>
            </div>

            <!-- Due Date Warning -->
            <div v-if="isOverdue(approval.dueAt)" class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div class="flex items-center gap-2 text-red-800">
                <Icon name="ph:warning-duotone" class="size-4" />
                <span class="text-sm font-medium">
                  هذا الطلب متأخر عن موعد الاستحقاق بـ {{ Math.abs(getDaysUntilDue(approval.dueAt)) }} يوم
                </span>
              </div>
            </div>

            <!-- Reminder Count -->
            <div v-if="approval.reminderCount > 0" class="text-sm text-gray-500 mb-4">
              تم إرسال {{ approval.reminderCount }} تذكير لهذا الطلب
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col gap-2 ml-4">
            <BaseButton
              color="primary"
              size="sm"
              @click="handleApproval(approval)"
            >
              <Icon name="ph:check-circle-duotone" class="size-4 ml-1" />
              معالجة
            </BaseButton>

            <BaseButton
              color="gray"
              variant="outline"
              size="sm"
              @click="$router.push(`/requests/${approval.request.id}`)"
            >
              <Icon name="ph:eye-duotone" class="size-4 ml-1" />
              التفاصيل
            </BaseButton>
          </div>
        </div>

        <!-- Priority Indicator -->
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center gap-2">
            <Icon 
              name="ph:clock-duotone" 
              class="size-4"
              :class="isOverdue(approval.dueAt) ? 'text-red-500' : 'text-yellow-500'"
            />
            <span :class="isOverdue(approval.dueAt) ? 'text-red-600' : 'text-yellow-600'">
              {{ isOverdue(approval.dueAt) 
                ? `متأخر بـ ${Math.abs(getDaysUntilDue(approval.dueAt))} يوم` 
                : `باقي ${getDaysUntilDue(approval.dueAt)} يوم` }}
            </span>
          </div>
          
          <div class="text-gray-500">
            تم التقديم: {{ formatDate(approval.request.startDate) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Approval Process Dialog -->
    <ApprovalProcess 
      v-if="requestStore.selectedApprovalId && pendingApprovals.find(a => a.id === requestStore.selectedApprovalId)"
      :approval="pendingApprovals.find(a => a.id === requestStore.selectedApprovalId)!"
    />
  </div>
</template>
