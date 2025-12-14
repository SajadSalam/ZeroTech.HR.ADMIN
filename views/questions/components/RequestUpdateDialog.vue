<script setup lang="ts">
import { useQuestionStore } from '../store/index'

const questionsStore = useQuestionStore()
const requestUpdateReason = ref<string | null>('')
const emit = defineEmits(['update'])

const requestUpdateQuestion = () => {
  questionsStore.requestUpdateQuestion(
    questionsStore.selectedQuestion!.id as string, 
    requestUpdateReason.value as string
  )
  questionsStore.isRequestUpdateDialogOpen = false
  emit('update')
  requestUpdateReason.value = ''
}
</script>

<template>
  <AppDialog
    v-model="questionsStore.isRequestUpdateDialogOpen"
    :title="$t('request-update-title')"
    size="lg"
    overflow-y="visible"
    :loading="questionsStore.isLoading"
  >
    <div class="flex w-full flex-col items-center justify-center p-3">
      <Icon name="ph-arrow-clockwise" class="text-warning-500" size="80" />
      <BaseHeading level="3" class="mt-3">{{ $t('request-update-heading') }}</BaseHeading>
      <p class="text-muted-400">
        {{ $t('request-update-description') }}
      </p>
    </div>
    <BaseTextarea
      v-model="requestUpdateReason"
      :label="$t('request-update-reason')"
      :placeholder="$t('request-update-reason-placeholder')"
      class="mt-3 w-full"
    />

    <BaseButton color="warning" class="mt-5 w-full gap-1" @click="requestUpdateQuestion">
      <Icon name="ph:arrow-clockwise" class="size-5" />
      {{ $t('request-update') }}
    </BaseButton>
  </AppDialog>
</template>

