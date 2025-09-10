<script setup lang="ts">
import { useQuestionBankStore } from '../store/index'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'

const questionBankStore = useQuestionBankStore()
const rejectReason = ref<string | null>('')
const emit = defineEmits(['update'])
const rejectQuestion = () => {
  questionBankStore.rejectQuestion(questionBankStore.selectedQuestion!.id as string, {
    rejectReason: rejectReason.value,
  })
  questionBankStore.isRejectionDialogOpen = false
  emit('update')
  rejectReason.value = ''
}
</script>
<template>
  <AppDialog
    v-model="questionBankStore.isRejectionDialogOpen"
    :title="$t('rejection-reason')"
    size="lg"
    overflow-y="visible"
    :loading="questionBankStore.isLoading"
  >
    <div class="flex w-full flex-col items-center justify-center p-3">
      <Icon name="ph-warning-octagon-fill" class="text-danger-500" size="80" />
      <BaseHeading level="3" class="mt-3">{{ $t('rejection-heading') }}</BaseHeading>
      <p class="text-muted-400">
        {{ $t('rejection-description') }}
      </p>
    </div>
    <BaseTextarea
      v-model="rejectReason"
      :label="$t('rejection-reason')"
      :placeholder="$t('rejection-reason')"
      class="mt-3 w-full"
    />

    <BaseButton color="danger" class="mt-5 w-full gap-1" @click="rejectQuestion">
      <Icon name="ph:x" class="size-5" />
      {{ $t('reject') }}
    </BaseButton>
  </AppDialog>
</template>
