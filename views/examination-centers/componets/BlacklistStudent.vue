<script setup lang="ts">
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { useExaminationCenters } from '../store/index'

const examinationCentersStore = useExaminationCenters()

// Dialog state
const isLoading = ref(false)
const reason = ref('')
const errorMessage = ref('')
const isError = ref(false)
const selectedStudent = ref<any>(null)

// Blacklist student
const blacklistStudent = async () => {
  if (!reason.value.trim()) {
    errorMessage.value = 'Reason is required'
    isError.value = true
    return
  }

  if (!selectedStudent.value?.studentExamTicketId) {
    errorMessage.value = 'Student ticket ID is missing'
    isError.value = true
    return
  }

  try {
    isLoading.value = true
    isError.value = false
    errorMessage.value = ''
    
    await examinationCentersStore.blacklistStudent({
      ticketId: selectedStudent.value.studentExamTicketId,
      reason: reason.value.trim()
    })
    
    // Close dialog and reset state
    examinationCentersStore.isBlacklistStudentDialogOpen = false
    reason.value = ''
    selectedStudent.value = null
    
    // Show success message (you can implement toast notification)
    console.log('Student blacklisted successfully')
    
  } catch (error: any) {
    isError.value = true
    if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'Failed to blacklist student'
    }
  } finally {
    isLoading.value = false
  }
}

// Reset state when dialog opens
watch(() => examinationCentersStore.isBlacklistStudentDialogOpen, (newVal) => {
  if (newVal) {
    isLoading.value = false
    reason.value = ''
    errorMessage.value = ''
    isError.value = false
    selectedStudent.value = examinationCentersStore.selectedStudentForBlacklist
  }
})

// Close dialog
const closeDialog = () => {
  examinationCentersStore.isBlacklistStudentDialogOpen = false
  reason.value = ''
  selectedStudent.value = null
}
</script>

<template>
  <AppDialog 
    v-model="examinationCentersStore.isBlacklistStudentDialogOpen" 
    :title="$t('blacklist-student')" 
    size="lg"
    overflow-y="visible"
  >
    <!-- Content Section -->
    <div class="flex flex-col space-y-6 p-6">
      <!-- Student Info -->
      <div v-if="selectedStudent" class="rounded-lg bg-muted-50 p-4 dark:bg-muted-800">
        <h4 class="text-lg font-medium text-muted-900 dark:text-white mb-2">
          {{ $t('student-details') }}
        </h4>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="font-medium text-muted-600 dark:text-muted-400">{{ $t('student-name') }}:</span>
            <span class="ms-2 text-muted-900 dark:text-white">{{ selectedStudent.externalStudentName }}</span>
          </div>
          <div>
            <span class="font-medium text-muted-600 dark:text-muted-400">{{ $t('student-id') }}:</span>
            <span class="ms-2 text-muted-900 dark:text-white">#{{ selectedStudent.externalStudentId }}</span>
          </div>
        </div>
      </div>

      <!-- Warning Message -->
      <div class="rounded-lg bg-warning-50 p-4 dark:bg-warning-900/20">
        <div class="flex items-center">
          <Icon name="material-symbols:warning" class="size-5 text-warning-500" />
          <p class="ml-2 text-sm text-warning-700 dark:text-warning-400">
            {{ $t('blacklist-warning') }}
          </p>
        </div>
      </div>

      <!-- Reason Input -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-muted-700 dark:text-muted-300">
          {{ $t('blacklist-reason') }} <span class="text-danger-500">*</span>
        </label>
        <AppTextAreaField
          v-model="reason"
          :placeholder="$t('enter-blacklist-reason')"
          rows="4"
          :disabled="isLoading"
        />
      </div>

      <!-- Error Message -->
      <div v-if="isError && errorMessage" class="rounded-lg bg-danger-50 p-4 dark:bg-danger-900/20">
        <div class="flex items-center">
          <Icon name="material-symbols:error" class="size-5 text-danger-500" />
          <p class="ml-2 text-sm text-danger-600 dark:text-danger-400">
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </div>

    <!-- Dialog Actions -->
    <template #actions>
      <BaseButton 
        color="muted" 
        variant="outline"
        :disabled="isLoading"
        @click="closeDialog"
      >
        {{ $t('cancel') }}
      </BaseButton>
      <BaseButton 
        color="danger" 
        :loading="isLoading"
        @click="blacklistStudent"
      >
        <Icon name="material-symbols:block" class="me-2 size-4" />
        {{ $t('blacklist-student') }}
      </BaseButton>
    </template>
  </AppDialog>
</template>