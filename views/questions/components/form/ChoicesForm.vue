<script setup lang="ts">
import { QuestionType } from '../../types'
import type { QuestionChoiceRequest } from '../../types/request'

interface Props {
  choices: QuestionChoiceRequest[]
  questionType: QuestionType
  disabled?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:choices': [choices: QuestionChoiceRequest[]]
  'add-choice': []
  'remove-choice': [index: number]
  'set-correct': [index: number]
}>()

const localChoices = computed({
  get: () => props.choices,
  set: (value) => emit('update:choices', value),
})

const isSingleChoice = computed(() => {
  return (
    props.questionType === QuestionType.SingleChoice ||
    props.questionType === QuestionType.TrueFalse
  )
})

const isTrueFalse = computed(() => props.questionType === QuestionType.TrueFalse)

const canRemove = computed(() => {
  if (isTrueFalse.value) return false
  return props.choices.length > 2
})

const updateChoiceText = (index: number, text: string) => {
  const updated = [...localChoices.value]
  updated[index] = { ...updated[index], text }
  localChoices.value = updated
}

const toggleCorrect = (index: number) => {
  if (props.disabled) return
  
  const updated = [...localChoices.value]
  
  if (isSingleChoice.value) {
    // For single choice, only one can be correct
    updated.forEach((choice, i) => {
      updated[i] = { ...choice, isCorrect: i === index }
    })
  } else {
    // For multiple choice, toggle the selected one
    updated[index] = { ...updated[index], isCorrect: !updated[index].isCorrect }
  }
  
  localChoices.value = updated
}

const getChoiceLabel = (index: number): string => {
  return String.fromCharCode(65 + index) // A, B, C, D...
}
</script>

<template>
  <div class="choices-form space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-muted-700 dark:text-muted-200">
        {{ $t('answer-choices') }}
      </h3>
      <div v-if="!isTrueFalse" class="flex items-center gap-2">
        <BaseTag color="info" variant="pastel" class="text-xs">
          {{ isSingleChoice ? $t('single-choice') : $t('multiple-choice') }}
        </BaseTag>
      </div>
    </div>

    <p class="text-sm text-muted-500">
      {{ isSingleChoice ? $t('select-one-correct-answer') : $t('select-multiple-correct-answers') }}
    </p>

    <TransitionGroup name="list" tag="div" class="space-y-3">
      <div
        v-for="(choice, index) in localChoices"
        :key="index"
        class="group relative flex items-start gap-3 rounded-xl border-2 p-4 transition-all duration-300"
        :class="{
          'border-success-500 bg-success-50 dark:bg-success-500/10': choice.isCorrect,
          'border-muted-200 bg-white hover:border-muted-300 dark:border-muted-700 dark:bg-muted-800 dark:hover:border-muted-600': !choice.isCorrect,
        }"
      >
        <!-- Choice Letter Badge -->
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors"
          :class="{
            'bg-success-500 text-white': choice.isCorrect,
            'bg-muted-100 text-muted-600 dark:bg-muted-700 dark:text-muted-300': !choice.isCorrect,
          }"
        >
          {{ getChoiceLabel(index) }}
        </div>

        <!-- Choice Input -->
        <div class="flex-1">
          <BaseInput
            :model-value="choice.text"
            :placeholder="$t('enter-choice-text')"
            :disabled="disabled || isTrueFalse"
            class="w-full"
            @update:model-value="updateChoiceText(index, $event as string)"
          />
        </div>

        <!-- Correct Answer Toggle -->
        <div class="flex shrink-0 items-center gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200"
            :class="{
              'bg-success-500 text-white shadow-lg shadow-success-500/30': choice.isCorrect,
              'bg-muted-100 text-muted-400 hover:bg-success-100 hover:text-success-500 dark:bg-muted-700 dark:hover:bg-success-500/20': !choice.isCorrect,
            }"
            :disabled="disabled"
            :title="choice.isCorrect ? $t('correct-answer') : $t('mark-as-correct')"
            @click="toggleCorrect(index)"
          >
            <Icon
              :name="choice.isCorrect ? 'ph:check-circle-fill' : 'ph:circle'"
              class="size-6"
            />
          </button>

          <!-- Remove Button -->
          <button
            v-if="canRemove"
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-muted-400 opacity-0 transition-all duration-200 hover:bg-danger-100 hover:text-danger-500 group-hover:opacity-100 dark:hover:bg-danger-500/20"
            :disabled="disabled"
            :title="$t('remove-choice')"
            @click="$emit('remove-choice', index)"
          >
            <Icon name="ph:trash" class="size-5" />
          </button>
        </div>
      </div>
    </TransitionGroup>

    <!-- Add Choice Button -->
    <div v-if="!isTrueFalse" class="pt-2">
      <BaseButton
        color="primary"
        variant="pastel"
        :disabled="disabled"
        class="w-full"
        @click="$emit('add-choice')"
      >
        <Icon name="ph:plus-circle" class="me-2 size-5" />
        {{ $t('add-choice') }}
      </BaseButton>
    </div>

    <!-- Validation Hints -->
    <div
      v-if="!localChoices.some((c) => c.isCorrect)"
      class="flex items-center gap-2 rounded-lg bg-warning-50 p-3 text-sm text-warning-600 dark:bg-warning-500/10 dark:text-warning-400"
    >
      <Icon name="ph:warning" class="size-5" />
      {{ $t('select-one-correct-answer') }}
    </div>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>

