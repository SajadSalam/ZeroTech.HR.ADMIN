<script setup lang="ts">
import { useQuestionStore } from '../store/index'

const questionsStore = useQuestionStore()
const cancelReason = ref<string | null>('')
const emit = defineEmits(['update'])

const cancelQuestion = () => {
  questionsStore.cancelQuestion(
    questionsStore.selectedQuestion!.id as string, 
    cancelReason.value as string
  )
  questionsStore.isRejectionDialogOpen = false
  emit('update')
  cancelReason.value = ''
}
</script>

<template>
  <AppDialog
    v-model="questionsStore.isRejectionDialogOpen"
    :title="$t('cancel-question-title')"
    size="lg"
    overflow-y="visible"
    :loading="questionsStore.isLoading"
  >
    <div class="flex w-full flex-col items-center justify-center p-3">
      <Icon name="ph-warning-octagon-fill" class="text-danger-500" size="80" />
      <BaseHeading level="3" class="mt-3">{{ $t('cancel-question-heading') }}</BaseHeading>
      <p class="text-muted-400">
        {{ $t('cancel-question-description') }}
      </p>
    </div>
    <BaseTextarea
      v-model="cancelReason"
      :label="$t('cancel-reason')"
      :placeholder="$t('cancel-reason-placeholder')"
      class="mt-3 w-full"
    />

    <BaseButton color="danger" class="mt-5 w-full gap-1" @click="cancelQuestion">
      <Icon name="ph:x" class="size-5" />
      {{ $t('cancel') }}
    </BaseButton>
  </AppDialog>
</template>
