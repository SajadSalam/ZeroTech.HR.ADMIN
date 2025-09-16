<script setup lang="ts">
import { useQuestionBankStore } from '../store/index'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'

const questionBankStore = useQuestionBankStore()
const emit = defineEmits(['update'])
const route = useRoute()
const { id } = route.params
const removeTopic = () => {
  questionBankStore.removeTopic(id as string, questionBankStore.selectedTopic!.topicId as string)
  questionBankStore.isDeleteTopicOpen = false
  emit('update')
}
</script>
<template>
  <AppDialog
    v-model="questionBankStore.isDeleteTopicOpen"
    :title="$t('delete-topic')"
    size="lg"
    overflow-y="visible"
    :loading="questionBankStore.isLoading"
  >
    <div class="flex w-full flex-col items-center justify-center p-3">
      <Icon name="ph-warning-octagon-fill" class="text-danger-500" size="80" />
      <BaseHeading level="3" class="mt-3">
        {{ $t('are-sure-deleting-this-topic-from-question-bank') }}
      </BaseHeading>
      <p class="text-muted-400">
        {{ $t('delete-topic-description') }}
      </p>
    </div>

    <BaseButton color="danger" class="mt-5 w-full gap-1" @click="removeTopic">
      <Icon name="ph:x" class="size-5" />
      {{ $t('delete') }}
    </BaseButton>
  </AppDialog>
</template>
