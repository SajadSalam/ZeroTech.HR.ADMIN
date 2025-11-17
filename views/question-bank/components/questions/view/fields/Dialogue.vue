<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { QuestionType, type Question } from '~/views/question-bank/types/question'
import Matching from './Matching.vue'
import MultiItems from './MultiItems.vue'
import Reorder from './Reorder.vue'

const { t } = useI18n()

const modelValue = defineModel<Question>({
  default: {} as Question,
})

defineProps<{
  customAnswers?: any
}>()

const isQuestionHaveMultipleItems = (question: Question) => {
  return (
    question.type === QuestionType.MultipleChoice ||
    question.type === QuestionType.DropDown ||
    question.type === QuestionType.Radio
  )
}

const subQuestions = computed(() => {
  return modelValue.value?.subQuestions || []
})

const getImageUrl = (image: any) => {
  if (typeof image === 'string') {
    return image
  }
  // For File objects in view mode, we shouldn't encounter them
  // In a real scenario, they should already be converted to URLs
  return ''
}
</script>

<template>
  <div>
    <h1 class="mb-4 text-lg font-semibold">
      {{ $t('sub-questions') }}
    </h1>

    <div
      v-for="(subQuestion, index) in subQuestions"
      :key="subQuestion.id || index"
      class="mb-6 rounded-lg border border-gray-200 p-4"
    >
      <!-- Sub-question header -->
      <div class="mb-4 flex items-center gap-2">
        <Icon name="ph-chat-circle-dots-duotone" size="20" class="text-primary-500" />
        <h2 class="text-lg font-medium">{{ $t('sub-question') }} {{ index + 1 }}</h2>
      </div>

      <!-- Sub-question title -->
      <div class="mb-4">
        <BaseHeading :level="4" class="text-lg font-semibold">
          {{ subQuestion.title }}
        </BaseHeading>
        <div v-if="subQuestion.isAlternateTitleShown && subQuestion.alternateTitle" class="mt-2">
          <BaseHeading :level="5" class="text-base font-medium text-gray-600">
            {{ subQuestion.alternateTitle }}
          </BaseHeading>
        </div>
      </div>

      <!-- Sub-question image if exists -->
      <div v-if="subQuestion.image" class="mb-4">
        <img
          :src="getImageUrl(subQuestion.image)"
          :alt="subQuestion.title"
          class="max-h-64 rounded-lg object-contain"
        />
      </div>

      <!-- Sub-question content based on type -->
      <div class="sub-question-content">
        <!-- Multiple choice, dropdown, radio -->
        <MultiItems
          v-if="isQuestionHaveMultipleItems(subQuestion)"
          :model-value="subQuestion"
          :is-evaluation="true"
        />

        <!-- Article type -->
        <div v-if="subQuestion.type === QuestionType.Article" class="mt-4">
          <BaseHeading :level="5" class="mb-2 text-base font-medium">{{ $t('answer') }}:</BaseHeading>
          <div class="rounded-md bg-gray-50 p-3">
            <p class="whitespace-pre-wrap">{{ subQuestion.correctText || t('no-answer-provided') }}</p>
          </div>
        </div>

        <!-- Fill in the blank -->
        <div v-if="subQuestion.type === QuestionType.Blank" class="mt-4">
          <BaseHeading :level="5" class="mb-2 text-base font-medium">{{ $t('answer') }}:</BaseHeading>
          <BaseTag color="primary" variant="pastel" class="text-sm">
            {{ subQuestion.correctText || t('no-answer-provided') }}
          </BaseTag>
        </div>

        <!-- True or False -->
        <div v-if="subQuestion.type === QuestionType.TrueOrFalse" class="mt-4">
          <BaseHeading :level="5" class="mb-2 text-base font-medium">{{ $t('answer') }}:</BaseHeading>
          <div class="flex items-center gap-3">
            <BaseRadio
              :model-value="subQuestion.correctBoolean"
              :label="$t('true')"
              :value="true"
              disabled
            />
            <BaseRadio
              :model-value="subQuestion.correctBoolean"
              :label="$t('false')"
              :value="false"
              disabled
            />
          </div>
        </div>

        <!-- Matching -->
        <Matching
          v-if="subQuestion.type === QuestionType.Matching"
          :model-value="subQuestion"
          :is-evaluation="true"
        />

        <!-- Reorder -->
        <Reorder
          v-if="subQuestion.type === QuestionType.Reorder"
          :model-value="subQuestion"
          :is-evaluation="true"
        />
      </div>

      <!-- Sub-question metadata -->
      <div class="mt-4 flex flex-wrap gap-2 border-t border-gray-200 pt-3">
        <BaseTag size="sm" color="info" variant="pastel">
          {{ $t('type') }}: {{ $t(QuestionType[subQuestion.type].toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase()) }}
        </BaseTag>
        <BaseTag size="sm" color="warning" variant="pastel">
          {{ $t('difficulty') }}: {{ $t(['easy', 'medium', 'hard'][subQuestion.difficulty - 1]) }}
        </BaseTag>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="!subQuestions.length"
      class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center"
    >
      <Icon name="ph-chat-circle-dots-duotone" size="48" class="mb-4 text-gray-400" />
      <h3 class="mb-2 text-lg font-medium text-gray-600">{{ $t('no-sub-questions') }}</h3>
      <p class="text-sm text-gray-500">{{ $t('this-dialogue-has-no-sub-questions') }}</p>
    </div>
  </div>
</template>

<style scoped>
.sub-question-content {
  border-left: 3px solid #3b82f6;
  padding-left: 1rem;
  margin-left: 0.5rem;
  background: linear-gradient(to right, rgba(59, 130, 246, 0.05), transparent);
  border-radius: 0 0.5rem 0.5rem 0;
}
</style>