<script lang="ts" setup>
import draggable from 'vuedraggable'
import AppInputField from '~/components/app-field/AppInputField.vue'
import CardNoData from '~/components/app-table/components/CardNoData.vue'
import { useEvaluationStore } from '~/views/evaluations/store'
import type { EvaluationDetialedDto } from '~/views/evaluations/types'
import { questionsFakeData } from '~/views/question-bank'
import QuestionCard from '~/views/question-bank/components/questions/view/QuestionCard.vue'
import {
  Difficulty,
  KnowledgeLevel,
  type Question,
  QuestionType,
} from '~/views/question-bank/types/question'
definePageMeta({
  title: 'questions-editor',
  description: 'to-add-or-edit-questions',
})
const route = useRoute()
const questions = ref<Question[]>([...questionsFakeData])

const dragOptions = {
  animation: 200,
  onEnd: (event: any) => {},
}

const removeQuestion = (index: number) => {
  questions.value.splice(index, 1)
}
const details = ref<EvaluationDetialedDto | null>(null)
const evaluttionStore = useEvaluationStore()

onMounted(async () => {
  details.value = (await evaluttionStore.getEvaluationDetialed(
    route.params.examId as string,
    route.params.id as number
  )) as EvaluationDetialedDto
})
</script>
<template>
  <div>
    <div v-if="details !== null" class="flex items-center justify-between rounded-lg bg-white p-5">
      <div>
        <h1 class="fonte-bold text-3xl">
          <span class="font-bold text-primary-500">{{ details.exam.title }}</span>

          <span class="ms-2 text-2xl text-muted-500">
            {{ $t('exam-question-form') }}
          </span>
        </h1>
        <p class="text-gray mt-1 text-xs">
          {{
            $t(
              'it-is-a-special-form-to-enter-the-exam-questions-to-be-summoned-in-the-exam-department'
            )
          }}
        </p>
      </div>
    </div>
    <hr class="my-5" >

    <div
      v-for="(questionGrade, index) in details?.questionGrades"
      :key="questionGrade.id"
      class="my-5 px-10"
    >
      <QuestionCard
        v-model="questionGrade.question"
        :index="index"
        :custom-answers="{
          correctText: questionGrade.correctText,
          correctBoolean: questionGrade.correctBoolean,
          correctOptionIds: questionGrade.correctOptionIds,
        }"
        :show-replcae="false"
        @remove-question="removeQuestion"
      >
        <div class="flex items-center gap-2">
          <AppInputField
            :model-value="questionGrade?.grade"
            disabled
            :label="$t('grade')"
            type="number"
          />
        </div>
      </QuestionCard>
    </div>
    <CardNoData v-if="questions.length === 0" />
  </div>
</template>

<style lang="scss"></style>
