<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { useTopicStore } from '~/views/topics/store'
import { useQuestionForm } from './useQuestionForm'
import ChoicesForm from './ChoicesForm.vue'
import OrderingForm from './OrderingForm.vue'
import MatchingForm from './MatchingForm.vue'
import TextAnswerForm from './TextAnswerForm.vue'
import type { QuestionDto } from '../../types'
import type { QuestionRequest } from '../../types/request'

interface Props {
  questionBankId?: string
  topicId?: string
  editData?: QuestionDto | null
  isLoading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: QuestionRequest]
  cancel: []
}>()

// Initialize form composable
const {
  body,
  questionTypeOptions,
  difficultyOptions,
  requiresChoices,
  requiresOrdering,
  requiresMatching,
  requiresTextAnswer,
  addChoice,
  removeChoice,
  addOrderingItem,
  removeOrderingItem,
  addMatchingPair,
  removeMatchingPair,
  addExtraRightItem,
  removeRightItem,
  addTextAnswerPattern,
  removeTextAnswerPattern,
  validate,
  extractFormData,
  resetForm,
  fillForm,
  QuestionType,
} = useQuestionForm(props.questionBankId, props.topicId)

// Topic store for topic selection
const topicStore = useTopicStore()

// Computed for edit mode
const isEditMode = computed(() => !!props.editData)

// Local error state for validation messages
const validationErrors = ref<string[]>([])

// Fill form when edit data changes
watch(
  () => props.editData,
  (data) => {
    if (data) {
      fillForm({
        questionBankId: data.questionBankId,
        topicId: data.topicId,
        titleEn: data.titleEn,
        titleAr: data.titleAr,
        questionType: String(data.questionType),
        difficulty: String(data.difficulty),
        isActive: data.isActive,
        explanation: data.explanation || '',
        choices: data.choices?.map((c) => ({ text: c.text, isCorrect: c.isCorrect })),
        orderingItems: data.orderingItems?.map((i) => ({
          text: i.text,
          correctOrderIndex: i.correctOrderIndex,
        })),
        matchingLeftItems: data.matchingLeftItems?.map((i) => ({
          text: i.text,
          correctRightItemId: i.correctRightItemId,
          order: i.order,
        })),
        matchingRightItems: data.matchingRightItems?.map((i) => ({
          id: i.id,
          text: i.text,
        })),
        textAnswerPatterns: data.textAnswerPatterns?.map((p) => ({ pattern: p.pattern })),
      })
    }
  },
  { immediate: true }
)

// Submit handler
const handleSubmit = async () => {
  validationErrors.value = []
  
  const { isValid, errors } = await validate()
  
  if (!isValid) {
    validationErrors.value = errors
    return
  }
  
  emit('submit', extractFormData())
}

// Cancel handler
const handleCancel = () => {
  resetForm()
  emit('cancel')
}

// Get icon for question type
const getQuestionTypeIcon = (type: number | null): string => {
  switch (type) {
    case QuestionType.SingleChoice:
      return 'ph:radio-button'
    case QuestionType.MultipleChoice:
      return 'ph:check-square'
    case QuestionType.TrueFalse:
      return 'ph:toggle-right'
    case QuestionType.Ordering:
      return 'ph:list-numbers'
    case QuestionType.Matching:
      return 'ph:arrows-left-right'
    case QuestionType.ShortAnswer:
      return 'ph:text-aa'
    case QuestionType.FillInBlank:
      return 'ph:text-indent'
    default:
      return 'ph:question'
  }
}
</script>

<template>
  <div class="question-form space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-muted-800 dark:text-white">
          {{ isEditMode ? $t('edit-question') : $t('create-question') }}
        </h2>
        <p class="mt-1 text-sm text-muted-500">
          {{ $t('question-form-description') }}
        </p>
      </div>
      <div
        v-if="body.questionType.$model"
        class="flex items-center gap-2 rounded-xl bg-primary-500/10 px-4 py-2"
      >
        <Icon
          :name="getQuestionTypeIcon(body.questionType.$model)"
          class="size-6 text-primary-500"
        />
        <span class="font-medium text-primary-600 dark:text-primary-400">
          {{ questionTypeOptions.find((o) => o.value === body.questionType.$model)?.label }}
        </span>
      </div>
    </div>

    <!-- Validation Errors -->
    <div
      v-if="validationErrors.length > 0"
      class="rounded-xl bg-danger-50 p-4 dark:bg-danger-500/10"
    >
      <div class="flex items-start gap-3">
        <Icon name="ph:warning-circle" class="mt-0.5 size-5 shrink-0 text-danger-500" />
        <div>
          <h4 class="font-medium text-danger-700 dark:text-danger-300">
            {{ $t('validation-errors') }}
          </h4>
          <ul class="mt-2 list-inside list-disc space-y-1 text-sm text-danger-600 dark:text-danger-400">
            <li v-for="(error, index) in validationErrors" :key="index">
              {{ error }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Basic Information Section -->
    <div class="rounded-2xl border border-muted-200 bg-white p-6 shadow-sm dark:border-muted-700 dark:bg-muted-800">
      <div class="mb-4 flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/10">
          <Icon name="ph:info" class="size-5 text-primary-500" />
        </div>
        <h3 class="text-lg font-semibold text-muted-700 dark:text-muted-200">
          {{ $t('basic-information') }}
        </h3>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <!-- Topic Selection -->
        <AppAutoCompleteField
          v-model="body.topicId.$model"
          :label="$t('topic')"
          :items="topicStore.topics"
          :errors="body.topicId.$errors"
          item-label="titleAr"
          item-subtitle="titleEn"
          item-value="id"
          :disabled="isLoading"
          class="md:col-span-2"
        />

        <!-- Question Type -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-muted-700 dark:text-muted-200">
            {{ $t('question-type') }} *
          </label>
          <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            <button
              v-for="option in questionTypeOptions"
              :key="option.value"
              type="button"
              class="flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all duration-200"
              :class="{
                'border-primary-500 bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400':
                  body.questionType.$model === option.value,
                'border-muted-200 bg-white text-muted-600 hover:border-muted-300 dark:border-muted-700 dark:bg-muted-800 dark:text-muted-300 dark:hover:border-muted-600':
                  body.questionType.$model !== option.value,
              }"
              :disabled="isLoading"
              @click="body.questionType.$model = option.value"
            >
              <Icon :name="getQuestionTypeIcon(option.value)" class="size-6" />
              <span class="text-xs font-medium">{{ option.label }}</span>
            </button>
          </div>
          <p v-if="body.questionType.$errors.length" class="text-sm text-danger-500">
            {{ body.questionType.$errors[0].$message }}
          </p>
        </div>

        <!-- Difficulty -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-muted-700 dark:text-muted-200">
            {{ $t('difficulty') }} *
          </label>
          <div class="flex gap-2">
            <button
              v-for="option in difficultyOptions"
              :key="option.value"
              type="button"
              class="flex-1 rounded-xl border-2 px-4 py-3 text-center font-medium transition-all duration-200"
              :class="{
                'border-success-500 bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400':
                  body.difficulty.$model === option.value && option.value === 1,
                'border-warning-500 bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-400':
                  body.difficulty.$model === option.value && option.value === 2,
                'border-danger-500 bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-400':
                  body.difficulty.$model === option.value && option.value === 3,
                'border-muted-200 bg-white text-muted-600 hover:border-muted-300 dark:border-muted-700 dark:bg-muted-800 dark:text-muted-300':
                  body.difficulty.$model !== option.value,
              }"
              :disabled="isLoading"
              @click="body.difficulty.$model = option.value"
            >
              {{ option.label }}
            </button>
          </div>
          <p v-if="body.difficulty.$errors.length" class="text-sm text-danger-500">
            {{ body.difficulty.$errors[0].$message }}
          </p>
        </div>
      </div>
    </div>

    <!-- Question Content Section -->
    <div class="rounded-2xl border border-muted-200 bg-white p-6 shadow-sm dark:border-muted-700 dark:bg-muted-800">
      <div class="mb-4 flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-info-500/10">
          <Icon name="ph:text-t" class="size-5 text-info-500" />
        </div>
        <h3 class="text-lg font-semibold text-muted-700 dark:text-muted-200">
          {{ $t('question-content') }}
        </h3>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <!-- Title English -->
        <AppInputField
          v-model="body.titleEn.$model"
          :label="$t('title-en')"
          :errors="body.titleEn.$errors"
          :placeholder="$t('enter-title')"
          :disabled="isLoading"
        />

        <!-- Title Arabic -->
        <AppInputField
          v-model="body.titleAr.$model"
          :label="$t('title-ar')"
          :errors="body.titleAr.$errors"
          :placeholder="$t('enter-title')"
          :disabled="isLoading"
          class-name="text-right"
        />

        <!-- Explanation -->
        <AppTextAreaField
          v-model="body.explanation.$model"
          :label="$t('explanation') + ' (' + $t('optional') + ')'"
          :placeholder="$t('enter-explanation')"
          :disabled="isLoading"
          class="md:col-span-2"
        />

        <!-- Is Active Toggle -->
        <div class="flex items-center gap-3 md:col-span-2">
          <label class="relative inline-flex cursor-pointer items-center">
            <input
              v-model="body.isActive.$model"
              type="checkbox"
              class="peer sr-only"
              :disabled="isLoading"
            >
            <div
              class="peer h-6 w-11 rounded-full bg-muted-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-muted-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none rtl:peer-checked:after:-translate-x-full dark:border-muted-600 dark:bg-muted-700"
            />
          </label>
          <span class="text-sm font-medium text-muted-700 dark:text-muted-200">
            {{ $t('question-active') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Type-Specific Section -->
    <div
      v-if="body.questionType.$model"
      class="rounded-2xl border border-muted-200 bg-white p-6 shadow-sm dark:border-muted-700 dark:bg-muted-800"
    >
      <div class="mb-4 flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-success-500/10">
          <Icon :name="getQuestionTypeIcon(body.questionType.$model)" class="size-5 text-success-500" />
        </div>
        <h3 class="text-lg font-semibold text-muted-700 dark:text-muted-200">
          {{ $t('answer-configuration') }}
        </h3>
      </div>

      <!-- Choices Form (SingleChoice, MultipleChoice, TrueFalse) -->
      <ChoicesForm
        v-if="requiresChoices"
        v-model:choices="body.choices.$model"
        :question-type="body.questionType.$model"
        :disabled="isLoading"
        @add-choice="addChoice"
        @remove-choice="removeChoice"
      />

      <!-- Ordering Form -->
      <OrderingForm
        v-if="requiresOrdering"
        v-model:items="body.orderingItems.$model"
        :disabled="isLoading"
        @add-item="addOrderingItem"
        @remove-item="removeOrderingItem"
      />

      <!-- Matching Form -->
      <MatchingForm
        v-if="requiresMatching"
        v-model:left-items="body.matchingLeftItems.$model"
        v-model:right-items="body.matchingRightItems.$model"
        :disabled="isLoading"
        @add-pair="addMatchingPair"
        @remove-pair="removeMatchingPair"
        @add-right-item="addExtraRightItem"
        @remove-right-item="removeRightItem"
      />

      <!-- Text Answer Form (ShortAnswer, FillInBlank) -->
      <TextAnswerForm
        v-if="requiresTextAnswer"
        v-model:patterns="body.textAnswerPatterns.$model"
        :question-type="body.questionType.$model"
        :disabled="isLoading"
        @add-pattern="addTextAnswerPattern"
        @remove-pattern="removeTextAnswerPattern"
      />
    </div>

    <!-- Form Actions -->
    <div class="flex items-center justify-end gap-3 border-t border-muted-200 pt-6 dark:border-muted-700">
      <BaseButton
        color="muted"
        variant="pastel"
        :disabled="isLoading"
        @click="handleCancel"
      >
        <Icon name="ph:x" class="me-2 size-5" />
        {{ $t('cancel') }}
      </BaseButton>
      <BaseButton
        color="primary"
        :disabled="isLoading"
        :loading="isLoading"
        @click="handleSubmit"
      >
        <Icon name="ph:check" class="me-2 size-5" />
        {{ isEditMode ? $t('update-question') : $t('create-question') }}
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
/* RTL support for Arabic input */
.text-right :deep(input) {
  text-align: right;
  direction: rtl;
}
</style>

