<script lang="ts" setup>
import AppInputField from '~/components/app-field/AppInputField.vue'
import { useExamStore } from '../store/index'

const examStore = useExamStore()

const route = useRoute()
const examId = route.params.id as string
const isLoading = computed(() => examStore.isLoading)
const emit = defineEmits(['refresh'])
const replaceQuestion = async () => {
  await examStore.replaceQuestion(examId, examStore.questionId as string)
  emit('refresh')
  examStore.isQuestionReplaceDialogOpen = false
}
</script>

<template>
  <AppDialog
    v-model="examStore.isQuestionReplaceDialogOpen"
    :title="$t('replace-question')"
    size="2xl"
    overflow-y="visible"
  >
    <div class="flex flex-col items-center justify-center rounded-3xl p-3 text-center">
      <h1 class="text-2xl">
        <span>{{ $t('you-are-going-to-replace-the-question') }}</span>
        <span class="mx-2 font-bold text-primary-500">
          {{ $t('question') }}
        </span>
        <span>{{ $t('are-you-sure') }}</span>
      </h1>
      <p class="text-muted-500">
        {{ $t('the-question-will-be-replaced-with-a-new-one-for-all-students') }}
      </p>
    </div>
    <BaseButton
      class="mt-5 w-full"
      :loading="isLoading"
      color="primary"
      size="lg"
      @click="replaceQuestion"
    >
      {{ $t('replace-question') }}
    </BaseButton>
  </AppDialog>
</template>

<style></style>
