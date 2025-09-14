<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { createValidator } from '~/services/validationWithI18n'
import { Validator } from '~/services/validator'
import { useBlacklistStore } from '../store'
import type { UnblacklistRequest } from '../types'

const blacklistStore = useBlacklistStore()
const { t } = useI18n()

const selectedEntry = computed(() => blacklistStore.selectedBlacklistEntry)

const validator = new Validator<UnblacklistRequest>(
  {
    unblacklistReason: '',
  },
  {
    unblacklistReason: {
      required: createValidator(t, 'unblacklist-reason', 'required'),
    },
  }
)

const body = validator.validation

const isLoading = computed(() => {
  return blacklistStore.isLoading
})

const unblacklistStudent = async () => {
  const isValid = await body.value.$validate()

  if (!isValid) return
  
  if (!selectedEntry.value?.id) {
    console.error('No blacklist entry selected')
    return
  }

  await blacklistStore.unblacklistStudent(selectedEntry.value.id, validator.extractBody())
  validator.resetBody()
  blacklistStore.isUnblacklistDialogOpen = false
}

watch(
  () => blacklistStore.isUnblacklistDialogOpen,
  (val: boolean) => {
    if (val) {
      validator.resetBody()
    }
  }
)
</script>

<template>
  <AppDialog
    v-model="blacklistStore.isUnblacklistDialogOpen"
    :title="$t('unblacklist-student')"
    size="lg"
    overflow-y="visible"
  >
    <div class="rounded-3xl p-3">
      <div class="flex flex-col gap-4">
        <!-- Student Info -->
        <div v-if="selectedEntry" class="rounded-lg bg-muted-50 p-4 dark:bg-muted-800">
          <h4 class="text-lg font-medium text-muted-900 dark:text-white mb-2">
            {{ $t('student-details') }}
          </h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium text-muted-600 dark:text-muted-400">{{ $t('student-name') }}:</span>
              <span class="ms-2 text-muted-900 dark:text-white">{{ selectedEntry.externalStudentName }}</span>
            </div>
            <div>
              <span class="font-medium text-muted-600 dark:text-muted-400">{{ $t('national-id') }}:</span>
              <span class="ms-2 text-muted-900 dark:text-white">{{ selectedEntry.externalStudentNationalId }}</span>
            </div>
            <div>
              <span class="font-medium text-muted-600 dark:text-muted-400">{{ $t('exam-center') }}:</span>
              <span class="ms-2 text-muted-900 dark:text-white">{{ selectedEntry.examCenterName }}</span>
            </div>
            <div>
              <span class="font-medium text-muted-600 dark:text-muted-400">{{ $t('blacklist-reason') }}:</span>
              <span class="ms-2 text-muted-900 dark:text-white">{{ selectedEntry.reason }}</span>
            </div>
          </div>
        </div>

        <!-- Warning Message -->
        <div class="rounded-lg bg-warning-50 p-4 dark:bg-warning-900/20">
          <div class="flex items-center">
            <Icon name="material-symbols:info" class="size-5 me-1 text-warning-500" />
            <p class="ml-2 text-sm text-warning-700 dark:text-warning-400">
              {{ $t('unblacklist-warning') }}
            </p>
          </div>
        </div>

        <!-- Reason Input -->
        <AppTextAreaField
          v-model="body.unblacklistReason.$model"
          :errors="body.unblacklistReason.$errors"
          :label="$t('unblacklist-reason')"
          :placeholder="$t('enter-unblacklist-reason')"
          rows="4"
          size="md"
        />
      </div>
    </div>
    
    <template #actions>
      <BaseButton
        color="muted"
        variant="outline"
        :disabled="isLoading"
        @click="blacklistStore.isUnblacklistDialogOpen = false"
      >
        {{ $t('cancel') }}
      </BaseButton>
      <BaseButton
        color="success"
        class="gap-1"
        :disabled="isLoading"
        :loading="isLoading"
        @click="unblacklistStudent"
      >
        <Icon name="material-symbols:check-circle" class="size-5" />
        {{ $t('unblacklist-student') }}
      </BaseButton>
    </template>
  </AppDialog>
</template>