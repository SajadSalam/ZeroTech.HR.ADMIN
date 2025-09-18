<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { required } from '@vuelidate/validators'
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { useAppToaster } from '~/services/toaster/toaster'
import { createValidator } from '~/services/validationWithI18n'
import { Validator } from '~/services/validator'
import { useExaminationCenters } from '../store/index'
import type { DeactivationRequest } from '../types'

const props = defineProps<{
  examCenterId: string
  examCenterName?: string
}>()

const examinationCentersStore = useExaminationCenters()
const { t } = useI18n()
const toaster = useAppToaster()

// Get today's date in YYYY-MM-DD format
const today = new Date()
const formattedToday = today.toISOString().split('T')[0]

const validator = new Validator<DeactivationRequest>(
  {
    reason: '',
    deactivationDate: formattedToday,
  },
  {
    reason: {
      required: createValidator(t, 'reason', 'required'),
    },
    deactivationDate: {
      required: createValidator(t, 'deactivation-date', 'required'),
    },
  }
)

const body = validator.validation

const isLoading = computed(() => {
  return examinationCentersStore.isLoading
})

const deactivateExamCenter = async () => {
  const isValid = await body.value.$validate()
  if (!isValid) return

  try {
    await examinationCentersStore.deactivateExamCenter(props.examCenterId, validator.extractBody())
    
    // Show success message with details
    const response = examinationCentersStore.deactivationResponse
    if (response) {
      toaster.success({
        title: t('success'),
        message: `${response.message}. ${t('affected-tickets')}: ${response.affectedTickets}, ${t('students-affected')}: ${response.studentsAffected}, ${t('free-take-points-granted')}: ${response.freeTakePointsGranted}`,
      })
    }
    
    validator.resetBody()
    examinationCentersStore.isDeactivateDialogOpen = false
  } catch (error: any) {
    // Handle API errors
    if (error.response?.data?.errors) {
      const errorMessages = error.response.data.errors.map((err: any) => err.message).join(', ')
      toaster.error({
        title: t('error'),
        message: errorMessages,
      })
    } else {
      toaster.error({
        title: t('error'),
        message: t('something-went-wrong'),
      })
    }
  }
}

// Reset form when dialog opens
watch(() => examinationCentersStore.isDeactivateDialogOpen, (isOpen) => {
  if (isOpen) {
    validator.resetBody()
    body.value.deactivationDate.$model = formattedToday
  }
})
</script>

<template>
  <AppDialog
    v-model="examinationCentersStore.isDeactivateDialogOpen"
    :title="$t('deactivate-exam-center')"
    size="2xl"
  >
    <div class="rounded-3xl p-6 space-y-6">
      <!-- Warning Message -->
      <div class="bg-[#FB923C] bg-op-10 border border-[#FB923C] border-solid rounded-lg p-4">
        <div class="flex gap-5 items-center">
          <Icon name="ph:warning-duotone" class="size-15 text-[#FB923C] mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 class="text-lg font-bold text-[#FB923C] mb-1">
              {{ $t('deactivation-warning-title') }}
            </h3>
            <p class="text-md text-gray-600">
              {{ $t('deactivation-warning-message', { centerName: examCenterName || 'this exam center' }) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Form Fields -->
      <div class="space-y-4">
        <AppInputField
          v-model="body.deactivationDate.$model"
          :errors="body.deactivationDate.$errors"
          :label="$t('deactivation-date')"
          type="date"
          :min="formattedToday"
          class="w-full"
        />

        <AppTextAreaField
          v-model="body.reason.$model"
          :errors="body.reason.$errors"
          :label="$t('deactivation-reason')"
          :placeholder="$t('deactivation-reason-placeholder')"
          rows="4"
          class="w-full"
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-3 pt-4">
        <BaseButton 
          color="muted" 
          class="flex-1 order-2 sm:order-1" 
          @click="examinationCentersStore.isDeactivateDialogOpen = false"
          :disabled="isLoading"
        >
          {{ $t('cancel') }}
        </BaseButton>
        
        <BaseButton 
          color="primary" 
          class="flex-1 order-1 sm:order-2 gap-2" 
          @click="deactivateExamCenter"
          :loading="isLoading"
          :disabled="isLoading"
        >
          <Icon name="ph:warning-circle-duotone" class="size-4" />
          {{ $t('confirm-deactivation') }}
        </BaseButton>
      </div>

      <!-- Information Box -->
      <div class="bg-[#FB923C] bg-op-10 border border-info-200 rounded-lg p-4 mt-4">
        <div class="flex gap-5 items-center">
          <Icon name="ph:info-duotone" class="size-15 text-[#FB923C] mt-0.5 mr-3 flex-shrink-0" />
          <div class="text-md text-gray-600">
            <p class="font-bold text-[#FB923C] mb-1">{{ $t('what-happens-when-deactivated') }}</p>
            <ul class="list-disc list-inside space-y-1 text-gray-600">
              <li>{{ $t('deactivation-effect-1') }}</li>
              <li>{{ $t('deactivation-effect-2') }}</li>
              <li>{{ $t('deactivation-effect-3') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </AppDialog>
</template>