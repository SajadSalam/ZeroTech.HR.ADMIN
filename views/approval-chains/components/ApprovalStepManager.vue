<script setup lang="ts">
import { useApprovalChainStore } from '../store'
import type { ApprovalStepDto } from '../types'

const approvalChainStore = useApprovalChainStore()

const approvalSteps = computed(() => approvalChainStore.approvalSteps)
const isLoading = computed(() => approvalChainStore.isLoading)

// Format timeout action
const formatTimeoutAction = (action?: string) => {
  switch (action) {
    case 'AutoApprove': return 'موافقة تلقائية'
    case 'AutoReject': return 'رفض تلقائي'
    case 'Escalate': return 'تصعيد'
    case 'NextStep': return 'الخطوة التالية'
    case 'Notify': return 'إشعار فقط'
    default: return action || '-'
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

// Add new step
const addStep = () => {
  approvalChainStore.openStepDialog()
}

// Edit step
const editStep = (step: ApprovalStepDto) => {
  approvalChainStore.openStepDialog(step)
}

// Delete step
const deleteStep = async (stepId: string | number) => {
  if (confirm('هل أنت متأكد من حذف هذه الخطوة؟')) {
    await approvalChainStore.deleteApprovalStep(stepId)
  }
}

// Drag and drop functionality (simplified - would need a library like vue-draggable for full implementation)
const moveStepUp = async (step: ApprovalStepDto) => {
  if (step.stepOrder <= 1) return
  
  // Find the step above
  const stepAbove = approvalSteps.value.find(s => s.stepOrder === step.stepOrder - 1)
  if (!stepAbove) return
  
  // Swap orders
  const tempOrder = step.stepOrder
  step.stepOrder = stepAbove.stepOrder
  stepAbove.stepOrder = tempOrder
  
  // Update both steps
  await approvalChainStore.updateApprovalStep(step.id, { ...step, stepOrder: step.stepOrder })
  await approvalChainStore.updateApprovalStep(stepAbove.id, { ...stepAbove, stepOrder: stepAbove.stepOrder })
}

const moveStepDown = async (step: ApprovalStepDto) => {
  const maxOrder = Math.max(...approvalSteps.value.map(s => s.stepOrder))
  if (step.stepOrder >= maxOrder) return
  
  // Find the step below
  const stepBelow = approvalSteps.value.find(s => s.stepOrder === step.stepOrder + 1)
  if (!stepBelow) return
  
  // Swap orders
  const tempOrder = step.stepOrder
  step.stepOrder = stepBelow.stepOrder
  stepBelow.stepOrder = tempOrder
  
  // Update both steps
  await approvalChainStore.updateApprovalStep(step.id, { ...step, stepOrder: step.stepOrder })
  await approvalChainStore.updateApprovalStep(stepBelow.id, { ...stepBelow, stepOrder: stepBelow.stepOrder })
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-muted-800 dark:text-muted-100">
        إدارة خطوات الموافقة
      </h3>
      <BaseButton
        color="primary"
        size="sm"
        @click="addStep"
      >
        <Icon name="ph:plus-duotone" class="size-4 mr-2" />
        إضافة خطوة
      </BaseButton>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="approvalSteps.length === 0" class="text-center p-8">
      <Icon name="ph:list-duotone" class="size-12 text-muted-400 mx-auto mb-4" />
      <h4 class="text-lg font-medium text-muted-700 dark:text-muted-300 mb-2">
        لا توجد خطوات موافقة
      </h4>
      <p class="text-muted-500 mb-4">
        ابدأ بإضافة خطوة موافقة جديدة لهذه السلسلة
      </p>
      <BaseButton color="primary" @click="addStep">
        <Icon name="ph:plus-duotone" class="size-4 mr-2" />
        إضافة أول خطوة
      </BaseButton>
    </div>

    <!-- Steps List -->
    <div v-else class="space-y-4">
      <div
        v-for="(step, index) in approvalSteps"
        :key="step.id"
        class="bg-white dark:bg-muted-800 rounded-lg border border-muted-200 dark:border-muted-700 p-6"
      >
        <!-- Step Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <!-- Step Number -->
            <div class="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
              {{ step.stepOrder }}
            </div>
            
            <!-- Step Info -->
            <div>
              <h4 class="text-lg font-semibold text-muted-800 dark:text-muted-100">
                {{ step.name }}
              </h4>
              <p v-if="step.description" class="text-sm text-muted-600 dark:text-muted-400">
                {{ step.description }}
              </p>
            </div>
          </div>

          <!-- Step Actions -->
          <div class="flex items-center gap-2">
            <!-- Move Up -->
            <BaseButton
              v-if="step.stepOrder > 1"
              size="sm"
              variant="outline"
              @click="moveStepUp(step)"
            >
              <Icon name="ph:arrow-up-duotone" class="size-4" />
            </BaseButton>

            <!-- Move Down -->
            <BaseButton
              v-if="step.stepOrder < approvalSteps.length"
              size="sm"
              variant="outline"
              @click="moveStepDown(step)"
            >
              <Icon name="ph:arrow-down-duotone" class="size-4" />
            </BaseButton>

            <!-- Edit -->
            <BaseButton
              size="sm"
              variant="outline"
              color="primary"
              @click="editStep(step)"
            >
              <Icon name="ph:pencil-duotone" class="size-4" />
            </BaseButton>

            <!-- Delete -->
            <BaseButton
              size="sm"
              variant="outline"
              color="danger"
              @click="deleteStep(step.id)"
            >
              <Icon name="ph:trash-duotone" class="size-4" />
            </BaseButton>
          </div>
        </div>

        <!-- Step Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <!-- Status -->
          <div>
            <div class="text-xs font-medium text-muted-500 mb-1">الحالة</div>
            <div class="flex gap-1">
              <BaseTag
                v-if="step.isRequired"
                color="danger"
                variant="pastel"
                size="sm"
              >
                مطلوب
              </BaseTag>
              <BaseTag
                :color="step.isActive ? 'success' : 'muted'"
                variant="pastel"
                size="sm"
              >
                {{ step.isActive ? 'نشط' : 'غير نشط' }}
              </BaseTag>
            </div>
          </div>

          <!-- Timing -->
          <div>
            <div class="text-xs font-medium text-muted-500 mb-1">التوقيت</div>
            <div class="text-sm text-muted-700 dark:text-muted-300">
              {{ step.maxCompletionHours || '-' }} ساعة
            </div>
          </div>

          <!-- Timeout Action -->
          <div>
            <div class="text-xs font-medium text-muted-500 mb-1">إجراء انتهاء المهلة</div>
            <div class="text-sm text-muted-700 dark:text-muted-300">
              {{ formatTimeoutAction(step.timeoutAction) }}
            </div>
          </div>

          <!-- Approvers Count -->
          <div>
            <div class="text-xs font-medium text-muted-500 mb-1">المعتمدون</div>
            <div class="text-sm text-muted-700 dark:text-muted-300">
              {{ getApprovers(step).length }} معتمد
            </div>
          </div>
        </div>

        <!-- Approvers List -->
        <div v-if="getApprovers(step).length > 0">
          <div class="text-xs font-medium text-muted-500 mb-2">قائمة المعتمدين</div>
          <div class="flex flex-wrap gap-1">
            <BaseTag
              v-for="approver in getApprovers(step)"
              :key="approver"
              color="info"
              variant="pastel"
              size="sm"
            >
              {{ approver }}
            </BaseTag>
          </div>
        </div>

        <!-- Settings -->
        <div class="mt-4 flex flex-wrap gap-2">
          <BaseTag
            v-if="step.allowsAutoApproval"
            color="success"
            variant="pastel"
            size="sm"
          >
            <Icon name="ph:robot-duotone" class="size-3 mr-1" />
            موافقة تلقائية
          </BaseTag>
          <BaseTag
            v-if="step.allowsParallelApproval"
            color="info"
            variant="pastel"
            size="sm"
          >
            <Icon name="ph:arrows-horizontal-duotone" class="size-3 mr-1" />
            موافقة متوازية
          </BaseTag>
          <BaseTag
            v-if="step.sendReminders"
            color="warning"
            variant="pastel"
            size="sm"
          >
            <Icon name="ph:bell-duotone" class="size-3 mr-1" />
            تذكيرات
          </BaseTag>
          <BaseTag
            v-if="step.escalationUserId"
            color="danger"
            variant="pastel"
            size="sm"
          >
            <Icon name="ph:warning-duotone" class="size-3 mr-1" />
            تصعيد
          </BaseTag>
        </div>

        <!-- Connection Line (except for last step) -->
        <div
          v-if="index < approvalSteps.length - 1"
          class="flex justify-center mt-6"
        >
          <div class="w-0.5 h-8 bg-muted-300 dark:bg-muted-600 relative">
            <Icon
              name="ph:arrow-down-duotone"
              class="size-4 text-muted-400 absolute -bottom-2 -left-2"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
