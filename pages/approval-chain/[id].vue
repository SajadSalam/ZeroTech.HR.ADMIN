<script setup lang="ts">
import ApprovalStepForm from '~/views/approval-chains/components/ApprovalStepForm.vue'
import ApprovalStepManager from '~/views/approval-chains/components/ApprovalStepManager.vue'
import { useApprovalChainStore } from '~/views/approval-chains/store'
import type { ApprovalStepDto, TimelineStepStatus } from '~/views/approval-chains/types'

definePageMeta({
  title: 'تفاصيل سلسلة الموافقات',
  description: 'عرض تفاصيل سلسلة الموافقات والمخطط الزمني',
})

const route = useRoute()
const router = useRouter()
const approvalChainStore = useApprovalChainStore()

const activeTab = ref<'timeline' | 'manage'>('timeline')

const selectedChain = computed(() => approvalChainStore.selectedApprovalChain)
const approvalSteps = computed(() => approvalChainStore.approvalSteps)
const isLoading = computed(() => approvalChainStore.isLoading)

// Get step status for timeline visualization
const getStepStatus = (step: ApprovalStepDto, index: number): TimelineStepStatus => {
  // This would typically come from actual approval data
  // For now, we'll simulate different statuses for demo
  if (index === 0) return 'completed'
  if (index === 1) return 'active'
  if (index === 2) return 'pending'
  return 'pending'
}

// Get status color
const getStatusColor = (status: TimelineStepStatus) => {
  switch (status) {
    case 'completed': return 'success'
    case 'active': return 'primary'
    case 'rejected': return 'danger'
    case 'escalated': return 'warning'
    case 'timeout': return 'muted'
    default: return 'muted'
  }
}

// Get status icon
const getStatusIcon = (status: TimelineStepStatus) => {
  switch (status) {
    case 'completed': return 'ph:check-circle-duotone'
    case 'active': return 'ph:clock-duotone'
    case 'rejected': return 'ph:x-circle-duotone'
    case 'escalated': return 'ph:warning-duotone'
    case 'timeout': return 'ph:timer-duotone'
    default: return 'ph:circle-duotone'
  }
}

// Get status text
const getStatusText = (status: TimelineStepStatus) => {
  switch (status) {
    case 'completed': return 'مكتمل'
    case 'active': return 'قيد المراجعة'
    case 'rejected': return 'مرفوض'
    case 'escalated': return 'تم التصعيد'
    case 'timeout': return 'انتهت المهلة'
    default: return 'في الانتظار'
  }
}

// Get approvers list
const getApprovers = (step: ApprovalStepDto): string[] => {
  const approvers: string[] = []
  
  if (step.approvalStepUsers) {
    approvers.push(...step.approvalStepUsers.map(u => u.user.username || u.user.email))
  }
  
  if (step.approvalStepRoles) {
    approvers.push(...step.approvalStepRoles.map(r => r.role.name))
  }
  
  return approvers
}

// Format timeout action
const formatTimeoutAction = (action?: string) => {
  switch (action) {
    case 'AutoApprove': return 'موافقة تلقائية'
    case 'AutoReject': return 'رفض تلقائي'
    case 'Escalate': return 'تصعيد'
    case 'Notify': return 'إشعار فقط'
    default: return action || '-'
  }
}

// Navigate back to approval chains list
const goBack = () => {
  router.push('/approval-chains')
}

// Navigate to edit page
const editApprovalChain = () => {
  if (selectedChain.value) {
    approvalChainStore.selectedApprovalChain = selectedChain.value
    approvalChainStore.selectedApprovalChainId = selectedChain.value.id
    approvalChainStore.isEditDialogOpen = true
  }
}

// Load approval chain data
const loadApprovalChain = async () => {
  const id = route.params.id as string
  if (id) {
    try {
      await approvalChainStore.getApprovalChainById(id)
      await approvalChainStore.getApprovalSteps(Number(id))
    } catch (error) {
      console.error('Error loading approval chain:', error)
      // Redirect to 404 or approval chains list if not found
      router.push('/approval-chains')
    }
  }
}

// Load data on mount
onMounted(() => {
  loadApprovalChain()
})

// Watch route changes
watch(() => route.params.id, () => {
  loadApprovalChain()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header with Back Button -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <BaseButton
          size="sm"
          variant="outline"
          @click="goBack"
        >
          <Icon name="ph:arrow-right-duotone" class="size-4 mr-2" />
          العودة للقائمة
        </BaseButton>
        <h1 class="text-2xl font-bold text-muted-800 dark:text-muted-100">
          تفاصيل سلسلة الموافقات
        </h1>
      </div>
    </div>

    <div v-if="isLoading && !selectedChain" class="flex items-center justify-center p-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="selectedChain" class="space-y-6">
      <!-- Tab Navigation -->
      <div class="border-b border-muted-200 dark:border-muted-700">
        <nav class="flex space-x-8">
          <button
            class="py-2 px-1 border-b-2 font-medium text-sm"
            :class="activeTab === 'timeline' 
              ? 'border-primary-500 text-primary-600' 
              : 'border-transparent text-muted-500 hover:text-muted-700 hover:border-muted-300'"
            @click="activeTab = 'timeline'"
          >
            <Icon name="ph:timeline-duotone" class="size-4 mr-2" />
            المخطط الزمني
          </button>
          <button
            class="py-2 px-1 border-b-2 font-medium text-sm"
            :class="activeTab === 'manage' 
              ? 'border-primary-500 text-primary-600' 
              : 'border-transparent text-muted-500 hover:text-muted-700 hover:border-muted-300'"
            @click="activeTab = 'manage'"
          >
            <Icon name="ph:gear-duotone" class="size-4 mr-2" />
            إدارة الخطوات
          </button>
        </nav>
      </div>

      <!-- Chain Header -->
      <div class="bg-muted-50 dark:bg-muted-800 rounded-lg p-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h2 class="text-2xl font-bold text-muted-800 dark:text-muted-100 mb-2">
              {{ selectedChain.name }}
            </h2>
            <p v-if="selectedChain.description" class="text-muted-600 dark:text-muted-400 mb-4">
              {{ selectedChain.description }}
            </p>
          </div>
          <BaseTag
            :color="selectedChain.isActive ? 'success' : 'muted'"
            variant="pastel"
            size="lg"
          >
            {{ selectedChain.isActive ? 'نشط' : 'غير نشط' }}
          </BaseTag>
        </div>
        
        <!-- Chain Info Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-muted-900 rounded-lg p-4">
            <div class="text-sm text-muted-500 mb-1">نوع الطلب</div>
            <div class="font-semibold text-muted-800 dark:text-muted-100">
              {{ selectedChain.requestType.name }}
            </div>
            <div class="text-xs text-muted-500">
              {{ selectedChain.requestType.code }}
            </div>
          </div>
          
          <div class="bg-white dark:bg-muted-900 rounded-lg p-4">
            <div class="text-sm text-muted-500 mb-1">القسم</div>
            <div class="font-semibold text-muted-800 dark:text-muted-100">
              {{ selectedChain.department.name }}
            </div>
            <div class="text-xs text-muted-500">
              {{ selectedChain.department.code }}
            </div>
          </div>
          
          <div class="bg-white dark:bg-muted-900 rounded-lg p-4">
            <div class="text-sm text-muted-500 mb-1">الأولوية</div>
            <div class="font-semibold text-muted-800 dark:text-muted-100">
              {{ selectedChain.priority || 0 }}
            </div>
          </div>
          
          <div class="bg-white dark:bg-muted-900 rounded-lg p-4">
            <div class="text-sm text-muted-500 mb-1">الحد الأقصى للإنجاز</div>
            <div class="font-semibold text-muted-800 dark:text-muted-100">
              {{ selectedChain.maxCompletionHours || '-' }} ساعة
            </div>
          </div>
        </div>

        <!-- Chain Settings -->
        <div class="mt-4 flex flex-wrap gap-2">
          <BaseTag
            v-if="selectedChain.allowsParallelApproval"
            color="info"
            variant="pastel"
            size="sm"
          >
            <Icon name="ph:arrows-horizontal-duotone" class="size-3 mr-1" />
            موافقة متوازية
          </BaseTag>
          <BaseTag
            v-if="selectedChain.allowsStepSkipping"
            color="warning"
            variant="pastel"
            size="sm"
          >
            <Icon name="ph:skip-forward-duotone" class="size-3 mr-1" />
            تخطي الخطوات
          </BaseTag>
          <BaseTag
            v-if="selectedChain.timeoutAction"
            color="muted"
            variant="pastel"
            size="sm"
          >
            <Icon name="ph:timer-duotone" class="size-3 mr-1" />
            {{ formatTimeoutAction(selectedChain.timeoutAction) }}
          </BaseTag>
        </div>
      </div>

      <!-- Timeline Tab -->
      <div v-if="activeTab === 'timeline'" class="bg-white dark:bg-muted-800 rounded-lg p-6">
        <h3 class="text-xl font-bold text-muted-800 dark:text-muted-100 mb-6">
          خطوات الموافقة
        </h3>
        
        <div v-if="isLoading" class="flex items-center justify-center p-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
        
        <div v-else-if="approvalSteps.length === 0" class="text-center p-8 text-muted-500">
          لا توجد خطوات موافقة محددة
        </div>
        
        <div v-else class="relative">
          <!-- Timeline Line -->
          <div class="absolute right-8 top-0 bottom-0 w-0.5 bg-muted-200 dark:bg-muted-700"></div>
          
          <!-- Timeline Steps -->
          <div class="space-y-8">
            <div
              v-for="(step, index) in approvalSteps"
              :key="step.id"
              class="relative flex items-start gap-6"
            >
              <!-- Step Icon -->
              <div class="relative z-10 flex-shrink-0">
                <div
                  class="w-16 h-16 rounded-full flex items-center justify-center border-4 border-white dark:border-muted-800"
                  :class="`bg-${getStatusColor(getStepStatus(step, index))}-500`"
                >
                  <Icon
                    :name="getStatusIcon(getStepStatus(step, index))"
                    class="size-6 text-white"
                  />
                </div>
                <!-- Step Number -->
                <div class="absolute -bottom-2 -right-2 w-6 h-6 bg-muted-100 dark:bg-muted-700 rounded-full flex items-center justify-center text-xs font-bold text-muted-600 dark:text-muted-300">
                  {{ step.stepOrder }}
                </div>
              </div>
              
              <!-- Step Content -->
              <div class="flex-1 min-w-0 pb-8">
                <div class="bg-muted-50 dark:bg-muted-900 rounded-lg p-6">
                  <!-- Step Header -->
                  <div class="flex items-start justify-between mb-4">
                    <div>
                      <h4 class="text-lg font-semibold text-muted-800 dark:text-muted-100 mb-1">
                        {{ step.name }}
                      </h4>
                      <p v-if="step.description" class="text-muted-600 dark:text-muted-400 text-sm">
                        {{ step.description }}
                      </p>
                    </div>
                    <div class="flex items-center gap-2">
                      <BaseTag
                        :color="getStatusColor(getStepStatus(step, index))"
                        variant="pastel"
                        size="sm"
                      >
                        {{ getStatusText(getStepStatus(step, index)) }}
                      </BaseTag>
                      <BaseTag
                        v-if="step.isRequired"
                        color="danger"
                        variant="pastel"
                        size="sm"
                      >
                        مطلوب
                      </BaseTag>
                    </div>
                  </div>
                  
                  <!-- Step Details Grid -->
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <!-- Approvers -->
                    <div>
                      <div class="text-sm font-medium text-muted-700 dark:text-muted-300 mb-2">
                        المعتمدون
                      </div>
                      <div class="space-y-1">
                        <div
                          v-for="approver in getApprovers(step)"
                          :key="approver"
                          class="text-sm text-muted-600 dark:text-muted-400 bg-white dark:bg-muted-800 px-2 py-1 rounded"
                        >
                          {{ approver }}
                        </div>
                        <div v-if="getApprovers(step).length === 0" class="text-sm text-muted-500">
                          لم يتم تحديد معتمدين
                        </div>
                      </div>
                    </div>
                    
                    <!-- Timing -->
                    <div>
                      <div class="text-sm font-medium text-muted-700 dark:text-muted-300 mb-2">
                        التوقيت
                      </div>
                      <div class="space-y-1">
                        <div class="text-sm text-muted-600 dark:text-muted-400">
                          الحد الأقصى: {{ step.maxCompletionHours || '-' }} ساعة
                        </div>
                        <div v-if="step.sendReminders" class="text-sm text-muted-600 dark:text-muted-400">
                          تذكير كل: {{ step.reminderIntervalHours || '-' }} ساعة
                        </div>
                      </div>
                    </div>
                    
                    <!-- Settings -->
                    <div>
                      <div class="text-sm font-medium text-muted-700 dark:text-muted-300 mb-2">
                        الإعدادات
                      </div>
                      <div class="space-y-1">
                        <div v-if="step.allowsAutoApproval" class="text-xs">
                          <BaseTag color="success" variant="pastel" size="sm">
                            موافقة تلقائية
                          </BaseTag>
                        </div>
                        <div v-if="step.allowsParallelApproval" class="text-xs">
                          <BaseTag color="info" variant="pastel" size="sm">
                            موافقة متوازية
                          </BaseTag>
                        </div>
                        <div v-if="step.timeoutAction" class="text-xs">
                          <BaseTag color="warning" variant="pastel" size="sm">
                            {{ formatTimeoutAction(step.timeoutAction) }}
                          </BaseTag>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Escalation Info -->
                  <div v-if="step.escalationUserId && step.escalationUser" class="mt-4 p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200 dark:border-warning-800">
                    <div class="flex items-center gap-2 text-warning-700 dark:text-warning-300">
                      <Icon name="ph:warning-duotone" class="size-4" />
                      <span class="text-sm font-medium">تصعيد إلى:</span>
                      <span class="text-sm">{{ step.escalationUser.username || step.escalationUser.email }}</span>
                    </div>
                  </div>
                  
                  <!-- Completion Info (for completed steps) -->
                  <div v-if="getStepStatus(step, index) === 'completed'" class="mt-4 p-3 bg-success-50 dark:bg-success-900/20 rounded-lg border border-success-200 dark:border-success-800">
                    <div class="flex items-center gap-2 text-success-700 dark:text-success-300">
                      <Icon name="ph:check-circle-duotone" class="size-4" />
                      <span class="text-sm font-medium">تم الإنجاز في:</span>
                      <span class="text-sm">{{ new Date().toLocaleDateString('en-US') }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step Management Tab -->
      <div v-if="activeTab === 'manage'">
        <ApprovalStepManager />
      </div>
      
      <!-- Activation Conditions -->
      <div v-if="selectedChain.activationConditions" class="bg-white dark:bg-muted-800 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-muted-800 dark:text-muted-100 mb-4">
          شروط التفعيل
        </h3>
        <div class="bg-muted-50 dark:bg-muted-900 rounded-lg p-4">
          <code class="text-sm text-muted-600 dark:text-muted-400">
            {{ selectedChain.activationConditions }}
          </code>
        </div>
      </div>
    </div>

    <div v-else class="text-center p-12">
      <Icon name="ph:warning-duotone" class="size-12 text-muted-400 mb-4" />
      <h3 class="text-lg font-semibold text-muted-800 dark:text-muted-100 mb-2">
        سلسلة الموافقات غير موجودة
      </h3>
      <p class="text-muted-600 dark:text-muted-400 mb-4">
        لم يتم العثور على سلسلة الموافقات المطلوبة
      </p>
      <BaseButton @click="goBack">
        العودة للقائمة
      </BaseButton>
    </div>

    <!-- Step Form Dialog -->
    <ApprovalStepForm />
  </div>
</template>
