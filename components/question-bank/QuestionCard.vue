<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { QuestionType, type QuestionDto } from '~/views/questions/types';
import { getDifficultyConfig, getQuestionTypeIcon, getQuestionTypeLabel, questionTypeFromString } from '~/views/questions/utils';

const props = defineProps<{
  question: QuestionDto
}>()
const question = computed(() => props.question)
defineEmits<{
  edit: [question: QuestionDto]
  delete: [questionId: string]
}>()

const { t } = useI18n()

const choicesMap = computed(() => {
    let choices: {text: string, isCorrect: boolean}[] = []
    console.log(question.value.questionType)

    const questionType = questionTypeFromString(question.value.questionType as string)
  if(questionType === QuestionType.SingleChoice || questionType === QuestionType.MultipleChoice) {
    choices = question.value.choices?.map((choice, index) => {
        return {text: choice.text, isCorrect: choice.isCorrect}
    }) ?? []
  } else if(questionType === QuestionType.Ordering) {
    choices = question.value.orderingItems?.map((item) => 
    {
        return {text: item.text, isCorrect: false}
    }) ?? []
  } else if(questionType === QuestionType.Matching) {
    choices = question.value.matchingRightItems?.map((item, index) => {
        return {text: item.text + ' - ' + question.value.matchingLeftItems?.[index]?.text, isCorrect: false}
    }) ?? []
  } 
  return choices
})
const getQuestionAnswerIcon = (questionType: string | QuestionType, choice: {text: string, isCorrect: boolean}) => {
  const questionTypeEnum = questionTypeFromString(questionType as string)
  if(questionTypeEnum === QuestionType.SingleChoice || questionTypeEnum === QuestionType.MultipleChoice) {
    return choice.isCorrect ? 'ph:check-circle' : 'ph:circle'
  } else if(questionTypeEnum === QuestionType.Ordering) {
    return 'ph:list-numbers'
  } else if(questionTypeEnum === QuestionType.Matching) {
    return 'ph:arrows-left-right'
  } else if(questionType === QuestionType.ShortAnswer) {
    return 'ph:text-aa'
  } else if(questionTypeEnum === QuestionType.FillInBlank) {
    return 'ph:text-aa'
  }
  return 'ph:circle'
}
</script>

<template>
  <div
    class="group rounded-xl border border-muted-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-primary-300 hover:shadow-md dark:border-muted-700 dark:bg-muted-800 dark:hover:border-primary-500"
  >
    <!-- Question Header -->
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500"
        >
          <Icon :name="getQuestionTypeIcon(question.questionType, t)" class="size-5" />
        </div>
        <div>
          <span class="text-xs font-medium text-primary-500">
            {{ getQuestionTypeLabel(question.questionType, t) }}
          </span>
          <BaseTag
            :color="getDifficultyConfig(question.difficulty, t).color as any"
            variant="pastel"
            class="ms-2 text-xs"
          >
            {{ getDifficultyConfig(question.difficulty, t).label }}
          </BaseTag>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          class="flex h-8 w-8 items-center justify-center rounded-lg text-muted-400 transition-colors hover:bg-primary-100 hover:text-primary-500 dark:hover:bg-primary-500/20"
          :title="$t('edit')"
          @click="$emit('edit', question)"
        >
          <Icon name="ph:pencil-simple" class="size-5" />
        </button>
        <button
          class="flex h-8 w-8 items-center justify-center rounded-lg text-muted-400 transition-colors hover:bg-danger-100 hover:text-danger-500 dark:hover:bg-danger-500/20"
          :title="$t('delete')"
          @click="$emit('delete', question.id)"
        >
          <Icon name="ph:trash" class="size-5" />
        </button>
      </div>
    </div>

    <!-- Question Content -->
    <div class="mt-4">
      <h4 class="line-clamp-2 font-semibold text-muted-800 dark:text-white">
        {{ question.titleAr }}
      </h4>
      <p class="mt-1 line-clamp-1 text-sm text-muted-500">
        {{ question.titleEn }}
      </p>
      <p class="mt-2">
        {{$t('choices')}}:
      </p>
      <div class="grid grid-cols-2 gap-2 my-2">
        
        <div v-for="(value, index) in choicesMap" :key="index" class="flex items-center gap-2">
            <Icon :name="getQuestionAnswerIcon(question.questionType, value)" class="size-4" />
            {{ value.text }}
        </div>
      </div>
    </div>

    <!-- Question Stats -->
    <div class="mt-4 flex items-center gap-4 border-t border-muted-100 pt-4 dark:border-muted-700">
      <!-- Choices count for choice-based questions -->
      <div
        v-if="choicesMap.length"
        class="flex items-center gap-1 text-xs text-muted-400"
      >
        <Icon name="ph:list-bullets" class="size-4" />
        {{ choicesMap.length }} {{ $t('choices') }}
      </div>

      <!-- Active status -->
      <div class="ms-auto">
        <span
          class="flex items-center gap-1 text-xs"
          :class="{
            'text-success-500': question.isActive,
            'text-muted-400': !question.isActive,
          }"
        >
          <Icon
            :name="question.isActive ? 'ph:check-circle' : 'ph:circle'"
            class="size-4"
          />
          {{ question.isActive ? $t('active') : $t('inactive') }}
        </span>
      </div>
    </div>
  </div>
</template>

