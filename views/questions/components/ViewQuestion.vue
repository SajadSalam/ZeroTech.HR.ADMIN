<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { QuestionType, type Question, type QuestionDto } from '../types';
import {
    getDifficultyConfig,
    getQuestionTypeIcon,
    getQuestionTypeLabel,
    questionTypeFromString
} from '../utils';

const props = defineProps<{
  question: Question | QuestionDto
}>()

const { t, locale } = useI18n()

const questionType = computed(() => {
  return typeof props.question.questionType === 'string' 
    ? questionTypeFromString(props.question.questionType)
    : props.question.questionType
})

const displayTitle = computed(() => {
  if (locale.value === 'ar') {
    return props.question.titleAr || props.question.titleEn
  }
  return props.question.titleEn || props.question.titleAr
})

// Get correct answer for True/False questions
const getTrueFalseAnswer = computed(() => {
  if (questionType.value !== QuestionType.TrueFalse) return null
  const correctChoice = props.question.choices?.find(c => c.isCorrect)
  return correctChoice?.text
})

// Sort matching items by order
const sortedMatchingLeftItems = computed(() => {
  if (questionType.value !== QuestionType.Matching) return []
  return [...(props.question.matchingLeftItems || [])].sort((a, b) => a.order - b.order)
})

// Get right item text by ID
const getRightItemText = (rightItemId: string) => {
  const item = props.question.matchingRightItems?.find(i => i.id === rightItemId)
  return item?.text || ''
}

// Sort ordering items by correct order
const sortedOrderingItems = computed(() => {
  if (questionType.value !== QuestionType.Ordering) return []
  return [...(props.question.orderingItems || [])].sort((a, b) => a.correctOrderIndex - b.correctOrderIndex)
})
</script>

<template>
  <div class="space-y-6">
    <!-- Question Header -->
    <div class="rounded-lg border border-muted-200 bg-muted-50 p-6 dark:border-muted-700 dark:bg-muted-800/50">
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500">
            <Icon :name="getQuestionTypeIcon(questionType)" class="size-6" />
          </div>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-sm font-semibold text-primary-500">
                {{ getQuestionTypeLabel(questionType, t) }}
              </span>
              <BaseTag
                :color="getDifficultyConfig(question.difficulty, t).color as any"
                variant="pastel"
                size="sm"
              >
                {{ getDifficultyConfig(question.difficulty, t).label }}
              </BaseTag>
            </div>
            <p class="text-xs text-muted-400">
              {{ t('created-by') }}: {{ question.creator?.name || t('unknown') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Question Title -->
      <div class="prose prose-primary dark:prose-invert max-w-none">
        <h3 class="text-lg font-semibold text-muted-800 dark:text-muted-100 mb-2">
          {{ displayTitle }}
        </h3>
        <div v-if="question.titleEn && question.titleAr && displayTitle !== question.titleEn" class="text-sm text-muted-500 mb-2">
          {{ question.titleEn }}
        </div>
      </div>

      <!-- Topic Info -->
      <div v-if="question.topic" class="mt-3 flex items-center gap-2 text-sm text-muted-500">
        <Icon name="ph-bookmark" class="size-4" />
        <span>{{ question.topic.titleAr || question.topic.titleEn }}</span>
      </div>
    </div>

    <!-- Question Content Based on Type -->
    
    <!-- Single Choice / Multiple Choice -->
    <div v-if="questionType === QuestionType.SingleChoice || questionType === QuestionType.MultipleChoice" 
         class="space-y-3">
      <h4 class="text-sm font-semibold text-muted-700 dark:text-muted-300 mb-3">
        {{ questionType === QuestionType.SingleChoice ? t('choices') : t('multiple-choices') }}
      </h4>
      <div class="grid grid-cols-2 gap-4">
        <div
        v-for="(choice, index) in question.choices"
        :key="choice.id || index"
        class="flex items-start gap-3 rounded-lg border p-4 transition-all"
        :class="choice.isCorrect 
          ? 'border-success-500 bg-success-50 dark:bg-success-500/10' 
          : 'border-muted-200 bg-white dark:border-muted-700 dark:bg-muted-800'"
      >
        <div class="flex-shrink-0 mt-0.5">
          <Icon 
            :name="choice.isCorrect ? 'ph-check-circle-fill' : 'ph-circle'" 
            class="size-5"
            :class="choice.isCorrect ? 'text-success-500' : 'text-muted-400'"
          />
        </div>
        <div class="flex items-center justify-between w-full">
          <p class="text-sm" :class="choice.isCorrect ? 'font-semibold text-success-700 dark:text-success-400' : 'text-muted-600 dark:text-muted-300'">
            {{ choice.text }}
          </p>
          <span v-if="choice.isCorrect" class="mt-1 inline-flex items-center gap-1 text-xs text-success-600 dark:text-success-400">
            <Icon name="ph-check" class="size-3" />
            {{ t('correct-answer') }}
          </span>
        </div>
      </div>
      </div>
    </div>

    <!-- True/False -->
    <div v-else-if="questionType === QuestionType.TrueFalse" class="space-y-3">
      <h4 class="text-sm font-semibold text-muted-700 dark:text-muted-300 mb-3">
        {{ t('true-false-answer') }}
      </h4>
      <div class="grid grid-cols-2 gap-4">
        <div
          class="flex items-center gap-3 rounded-lg border p-4 transition-all"
          :class="getTrueFalseAnswer === 'True' || getTrueFalseAnswer === 'true'
            ? 'border-success-500 bg-success-50 dark:bg-success-500/10' 
            : 'border-muted-200 bg-white dark:border-muted-700 dark:bg-muted-800'"
        >
          <Icon 
            :name="getTrueFalseAnswer === 'True' || getTrueFalseAnswer === 'true' ? 'ph-check-circle-fill' : 'ph-circle'" 
            class="size-5"
            :class="getTrueFalseAnswer === 'True' || getTrueFalseAnswer === 'true' ? 'text-success-500' : 'text-muted-400'"
          />
          <span class="font-semibold" :class="getTrueFalseAnswer === 'True' || getTrueFalseAnswer === 'true' ? 'text-success-700 dark:text-success-400' : 'text-muted-600 dark:text-muted-300'">
            {{ t('true') }}
          </span>
        </div>
        <div
          class="flex items-center gap-3 rounded-lg border p-4 transition-all"
          :class="getTrueFalseAnswer === 'False' || getTrueFalseAnswer === 'false'
            ? 'border-success-500 bg-success-50 dark:bg-success-500/10' 
            : 'border-muted-200 bg-white dark:border-muted-700 dark:bg-muted-800'"
        >
          <Icon 
            :name="getTrueFalseAnswer === 'False' || getTrueFalseAnswer === 'false' ? 'ph-check-circle-fill' : 'ph-circle'" 
            class="size-5"
            :class="getTrueFalseAnswer === 'False' || getTrueFalseAnswer === 'false' ? 'text-success-500' : 'text-muted-400'"
          />
          <span class="font-semibold" :class="getTrueFalseAnswer === 'False' || getTrueFalseAnswer === 'false' ? 'text-success-700 dark:text-success-400' : 'text-muted-600 dark:text-muted-300'">
            {{ t('false') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Ordering -->
    <div v-else-if="questionType === QuestionType.Ordering" class="space-y-3">
      <h4 class="text-sm font-semibold text-muted-700 dark:text-muted-300 mb-3">
        {{ t('correct-order') }}
      </h4>
      <div class="grid grid-cols-2 gap-4">
      <div
        v-for="(item, index) in sortedOrderingItems"
        :key="item.id || index"
        class="flex items-center gap-3 rounded-lg border border-muted-200 bg-white p-4 dark:border-muted-700 dark:bg-muted-800"
      >
        <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-500/10 text-sm font-bold text-primary-500">
          {{ index + 1 }}
        </div>
        <p class="text-sm text-muted-600 dark:text-muted-300">
          {{ item.text }}
        </p>
      </div>
      </div>
    </div>

    <!-- Matching -->
    <div v-else-if="questionType === QuestionType.Matching" class="space-y-3">
      <h4 class="text-sm font-semibold text-muted-700 dark:text-muted-300 mb-3">
        {{ t('matching-pairs') }}
      </h4>
      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="(leftItem, index) in sortedMatchingLeftItems"
          :key="leftItem.id || index"
          class="rounded-lg border border-muted-200 bg-white p-4 dark:border-muted-700 dark:bg-muted-800"
        >
          <div class="flex items-center gap-4">
            <div class="flex-1">
              <div class="mb-1 text-xs font-medium text-muted-400">{{ t('left-item') }}</div>
              <p class="text-sm font-semibold text-muted-700 dark:text-muted-200">
                {{ leftItem.text }}
              </p>
            </div>
            <Icon name="ph-arrows-left-right" class="size-5 text-primary-500 flex-shrink-0" />
            <div class="flex-1">
              <div class="mb-1 text-xs font-medium text-muted-400">{{ t('right-item') }}</div>
              <p class="text-sm font-semibold text-muted-700 dark:text-muted-200">
                {{ getRightItemText(leftItem.correctRightItemId) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Short Answer / Fill in Blank -->
    <div v-else-if="questionType === QuestionType.ShortAnswer || questionType === QuestionType.FillInBlank" 
         class="space-y-3">
      <h4 class="text-sm font-semibold text-muted-700 dark:text-muted-300 mb-3">
        {{ questionType === QuestionType.ShortAnswer ? t('acceptable-answers') : t('acceptable-patterns') }}
      </h4>
      <div
        v-for="(pattern, index) in question.textAnswerPatterns"
        :key="pattern.id || index"
        class="flex items-center gap-3 rounded-lg border border-success-500 bg-success-50 p-4 dark:bg-success-500/10"
      >
        <Icon name="ph-check-circle-fill" class="size-5 text-success-500 flex-shrink-0" />
        <code class="flex-1 text-sm font-mono text-success-700 dark:text-success-400">
          {{ pattern.pattern }}
        </code>
      </div>
    </div>

    <!-- Explanation -->
    <div v-if="question.explanation" class="rounded-lg border border-info-200 bg-white p-4 dark:border-info-700 dark:bg-info-500/10">
      <div class="flex items-start gap-3">
        <Icon name="ph-lightbulb" class="size-5 text-info-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 class="text-sm font-semibold text-info-700 dark:text-info-400 mb-2">
            {{ t('explanation') }}
          </h4>
          <p class="text-sm text-info-600 dark:text-info-300">
            {{ question.explanation }}
          </p>
        </div>
      </div>
    </div>

    <!-- Question Metadata -->
    <div class="rounded-lg border border-muted-200 bg-muted-50 p-4 dark:border-muted-700 dark:bg-muted-800/50">
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-muted-400">{{ t('created-at') }}:</span>
          <span class="ms-2 font-medium text-muted-700 dark:text-muted-200">
            {{ question.createdAtUtc ? new Date(question.createdAtUtc).toLocaleDateString() : '-' }}
          </span>
        </div>
        <div>
          <span class="text-muted-400">{{ t('updated-at') }}:</span>
          <span class="ms-2 font-medium text-muted-700 dark:text-muted-200">
            {{ question.updateAtUtc ? new Date(question.updateAtUtc).toLocaleDateString() : '-' }}
          </span>
        </div>
        <div v-if="question.auditor">
          <span class="text-muted-400">{{ t('auditor') }}:</span>
          <span class="ms-2 font-medium text-muted-700 dark:text-muted-200">
            {{ question.auditor.name }}
          </span>
        </div>
        <div v-if="question.auditDate">
          <span class="text-muted-400">{{ t('audit-date') }}:</span>
          <span class="ms-2 font-medium text-muted-700 dark:text-muted-200">
            {{ new Date(question.auditDate).toLocaleDateString() }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

