<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'

import { useQuestionBankStore } from '../store/index'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { useSubjectStore } from '~/views/subjects/store'
import { useTopicStore } from '~/views/topics/store'
import type { QuestionBankCreateDto } from '../types'
import type { TopicDto } from '~/views/topics/types'
import QuestionCard from '~/views/question-bank/components/questions/form/QuestionCard.vue'

const questionBankStore = useQuestionBankStore()
const question = computed({
  get: () => questionBankStore.selectedQuestion,
  set: (value) => (questionBankStore.selectedQuestion = value),
})
</script>
<template>
  <AppDialog
    v-model="questionBankStore.isViewDialogOpen"
    :title="$t('question')"
    size="3xl"
    overflow-y="visible"
  >
    <div class="rounded-3xl p-3">
      <QuestionCard v-model="question" only-view is-evaluation :index="0" />
    </div>
  </AppDialog>
</template>
