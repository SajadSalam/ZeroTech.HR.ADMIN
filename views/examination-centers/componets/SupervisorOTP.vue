<script setup lang="ts">
import { useExaminationCenters } from '../store/index'

const examinationCentersStore = useExaminationCenters()

// Dialog state
const isLoading = ref(false)
const otpResult = ref<string | null>(null)
const errorMessage = ref('')
const isError = ref(false)

// Generate Supervisor OTP
const generateOTP = async () => {
  try {
    isLoading.value = true
    isError.value = false
    errorMessage.value = ''
    otpResult.value = null
    
    const response = await examinationCentersStore.generateSupervisorOTP()
    otpResult.value = response.otp
  } catch (error: any) {
    isError.value = true
    if(error.response.data.message){
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'Failed to generate supervisor OTP'
    }
  } finally {
    isLoading.value = false
  }
}

// Reset state when dialog opens
watch(() => examinationCentersStore.isSupervisorOTPDialogOpen, (newVal) => {
  if (newVal) {
    isLoading.value = false
    otpResult.value = null
    errorMessage.value = ''
    isError.value = false
  }
})
</script>

<template>
  <AppDialog 
    v-model="examinationCentersStore.isSupervisorOTPDialogOpen" 
    :title="$t('generate-supervisor-otp')" 
    size="lg"
    overflow-y="visible"
  >
    <!-- Content Section -->
    <div class="flex flex-col items-center justify-center space-y-6 p-6">
      <!-- Instruction Text -->
      <div class="text-center">
        <div class="mb-2 flex items-center justify-center">
          <div class="rounded-full bg-primary-100 p-3 dark:bg-primary-900/20">
            <Icon name="material-symbols:admin-panel-settings" 
                  class="size-8 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        <h3 class="text-lg font-semibold text-muted-900 dark:text-white">
          {{ $t('supervisor-otp-title') }}
        </h3>
        <p class="mt-1 text-sm text-muted-500 dark:text-muted-400">
          {{ $t('supervisor-otp-description') }}
        </p>
      </div>

      <!-- Generate Button or Result -->
      <div v-if="!isLoading && !otpResult && !isError" class="w-full max-w-md">
        <BaseButton 
          color="primary" 
          class="w-full" 
          size="lg"
          @click="generateOTP"
        >
          <Icon name="material-symbols:vpn-key" class="me-2 size-5" />
          {{ $t('generate-supervisor-otp') }}
        </BaseButton>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="w-full max-w-md rounded-lg bg-primary-50 p-6 dark:bg-primary-900/20">
        <div class="flex items-center justify-center gap-3">
          <Icon name="ph:spinner-gap" class="size-6 text-primary-500 animate-spin" />
          <p class="text-lg font-medium text-primary-700 dark:text-primary-400">
            {{ $t('generating-supervisor-otp') }}
          </p>
        </div>
      </div>

      <!-- Success Result -->
      <div v-if="otpResult && !isLoading" class="w-full max-w-md rounded-lg bg-success-50 p-6 dark:bg-success-900/20">
        <div class="text-center">
          <div class="flex items-center justify-center mb-3">
            <Icon name="material-symbols:check-circle" class="size-6 text-success-500" />
            <p class="ml-2 text-lg font-medium text-success-700 dark:text-success-400">
              {{ $t('supervisor-otp-generated') }}
            </p>
          </div>
          <div class="rounded-lg bg-white p-4 border-2 border-success-200 dark:bg-muted-800 dark:border-success-700">
            <p class="text-sm text-muted-600 dark:text-muted-400 mb-2">
              {{ $t('supervisor-otp-code') }}:
            </p>
            <div class="text-3xl font-bold text-success-700 dark:text-success-400 font-mono tracking-wider">
              {{ otpResult }}
            </div>
          </div>
          <p class="mt-3 text-xs text-muted-500 dark:text-muted-400">
            يمكنك استخدام هذا الرمز لأنهاء الامتحان
          </p>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="isError && errorMessage" class="w-full max-w-md rounded-lg bg-danger-50 p-4 dark:bg-danger-900/20">
        <div class="flex items-center">
          <Icon name="material-symbols:error" class="size-5 text-danger-500" />
          <p class="ml-2 text-sm text-danger-600 dark:text-danger-400">
            {{ errorMessage }}
          </p>
        </div>
        <div class="mt-3">
          <BaseButton 
            color="danger" 
            variant="outline" 
            size="sm"
            @click="generateOTP"
          >
            {{ $t('try-again') }}
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Dialog Actions -->
    <template #actions>
      <BaseButton 
        color="muted" 
        variant="outline"
        @click="examinationCentersStore.isSupervisorOTPDialogOpen = false"
      >
        {{ $t('close') }}
      </BaseButton>
      <BaseButton 
        v-if="otpResult" 
        color="primary" 
        @click="generateOTP"
      >
        <Icon name="material-symbols:refresh" class="me-2 size-4" />
        {{ $t('generate-new-otp') }}
      </BaseButton>
    </template>
  </AppDialog>
</template>