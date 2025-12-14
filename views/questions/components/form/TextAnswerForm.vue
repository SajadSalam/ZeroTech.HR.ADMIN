<script setup lang="ts">
import { QuestionType } from '../../types'
import type { QuestionTextAnswerPatternRequest } from '../../types/request'

interface Props {
  patterns: QuestionTextAnswerPatternRequest[]
  questionType: QuestionType
  disabled?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:patterns': [patterns: QuestionTextAnswerPatternRequest[]]
  'add-pattern': []
  'remove-pattern': [index: number]
}>()

const localPatterns = computed({
  get: () => props.patterns,
  set: (value) => emit('update:patterns', value),
})

const isFillInBlank = computed(() => props.questionType === QuestionType.FillInBlank)

const canRemove = computed(() => props.patterns.length > 1)

const updatePatternText = (index: number, pattern: string) => {
  const updated = [...localPatterns.value]
  updated[index] = { ...updated[index], pattern }
  localPatterns.value = updated
}

// Check if pattern looks like a regex
const isRegexPattern = (pattern: string): boolean => {
  const regexIndicators = ['*', '+', '?', '^', '$', '[', ']', '(', ')', '{', '}', '|', '\\']
  return regexIndicators.some((indicator) => pattern.includes(indicator))
}

// Test if a regex pattern is valid
const isValidRegex = (pattern: string): boolean => {
  try {
    new RegExp(pattern)
    return true
  } catch {
    return false
  }
}

// Pattern status for display
const getPatternStatus = (pattern: string): 'valid' | 'regex' | 'invalid' | 'empty' => {
  if (!pattern.trim()) return 'empty'
  if (isRegexPattern(pattern)) {
    return isValidRegex(pattern) ? 'regex' : 'invalid'
  }
  return 'valid'
}
</script>

<template>
  <div class="text-answer-form space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-muted-700 dark:text-muted-200">
        {{ isFillInBlank ? $t('accepted-answers') : $t('answer-patterns') }}
      </h3>
      <BaseTag color="info" variant="pastel" class="text-xs">
        {{ $t('text-matching') }}
      </BaseTag>
    </div>

    <p class="text-sm text-muted-500">
      {{ isFillInBlank ? $t('fill-in-blank-instructions') : $t('short-answer-instructions') }}
    </p>

    <!-- Info Box for Regex Support -->
    <div class="flex items-start gap-3 rounded-xl bg-info-50 p-4 dark:bg-info-500/10">
      <Icon name="ph:info" class="mt-0.5 size-5 shrink-0 text-info-500" />
      <div class="text-sm text-info-700 dark:text-info-300">
        <p class="font-medium">{{ $t('pattern-matching-support') }}</p>
        <p class="mt-1 text-info-600 dark:text-info-400">
          {{ $t('pattern-matching-hint') }}
        </p>
        <div class="mt-2 space-y-1 text-xs">
          <div class="flex items-center gap-2">
            <code class="rounded bg-info-100 px-1.5 py-0.5 dark:bg-info-500/20">answer</code>
            <span>{{ $t('exact-match-example') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <code class="rounded bg-info-100 px-1.5 py-0.5 dark:bg-info-500/20">answer|ans</code>
            <span>{{ $t('alternative-match-example') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <code class="rounded bg-info-100 px-1.5 py-0.5 dark:bg-info-500/20">^\d+$</code>
            <span>{{ $t('regex-match-example') }}</span>
          </div>
        </div>
      </div>
    </div>

    <TransitionGroup name="list" tag="div" class="space-y-3">
      <div
        v-for="(pattern, index) in localPatterns"
        :key="index"
        class="group relative flex items-start gap-3 rounded-xl border-2 p-4 transition-all duration-300"
        :class="{
          'border-success-500 bg-success-50 dark:bg-success-500/10': getPatternStatus(pattern.pattern) === 'valid',
          'border-primary-500 bg-primary-50 dark:bg-primary-500/10': getPatternStatus(pattern.pattern) === 'regex',
          'border-danger-500 bg-danger-50 dark:bg-danger-500/10': getPatternStatus(pattern.pattern) === 'invalid',
          'border-muted-200 bg-white dark:border-muted-700 dark:bg-muted-800': getPatternStatus(pattern.pattern) === 'empty',
        }"
      >
        <!-- Pattern Number Badge -->
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg"
          :class="{
            'bg-success-500 shadow-success-500/30': getPatternStatus(pattern.pattern) === 'valid',
            'bg-primary-500 shadow-primary-500/30': getPatternStatus(pattern.pattern) === 'regex',
            'bg-danger-500 shadow-danger-500/30': getPatternStatus(pattern.pattern) === 'invalid',
            'bg-muted-400 shadow-muted-400/30': getPatternStatus(pattern.pattern) === 'empty',
          }"
        >
          {{ index + 1 }}
        </div>

        <div class="flex-1 space-y-2">
          <!-- Pattern Input -->
          <BaseInput
            :model-value="pattern.pattern"
            :placeholder="isFillInBlank ? $t('enter-accepted-answer') : $t('enter-answer-pattern')"
            :disabled="disabled"
            class="w-full font-mono"
            @update:model-value="updatePatternText(index, $event as string)"
          />

          <!-- Pattern Status -->
          <div class="flex items-center gap-2 text-xs">
            <template v-if="getPatternStatus(pattern.pattern) === 'valid'">
              <Icon name="ph:check-circle" class="size-4 text-success-500" />
              <span class="text-success-600 dark:text-success-400">
                {{ $t('exact-text-match') }}
              </span>
            </template>
            <template v-else-if="getPatternStatus(pattern.pattern) === 'regex'">
              <Icon name="ph:brackets-curly" class="size-4 text-primary-500" />
              <span class="text-primary-600 dark:text-primary-400">
                {{ $t('regex-pattern-valid') }}
              </span>
            </template>
            <template v-else-if="getPatternStatus(pattern.pattern) === 'invalid'">
              <Icon name="ph:x-circle" class="size-4 text-danger-500" />
              <span class="text-danger-600 dark:text-danger-400">
                {{ $t('invalid-regex-pattern') }}
              </span>
            </template>
            <template v-else>
              <Icon name="ph:circle" class="size-4 text-muted-400" />
              <span class="text-muted-400">
                {{ $t('enter-pattern') }}
              </span>
            </template>
          </div>
        </div>

        <!-- Remove Button -->
        <button
          v-if="canRemove"
          type="button"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-transparent text-muted-400 opacity-0 transition-all duration-200 hover:bg-danger-100 hover:text-danger-500 group-hover:opacity-100 dark:hover:bg-danger-500/20"
          :disabled="disabled"
          :title="$t('remove-pattern')"
          @click="$emit('remove-pattern', index)"
        >
          <Icon name="ph:trash" class="size-5" />
        </button>
      </div>
    </TransitionGroup>

    <!-- Add Pattern Button -->
    <div class="pt-2">
      <BaseButton
        color="primary"
        variant="pastel"
        :disabled="disabled"
        class="w-full"
        @click="$emit('add-pattern')"
      >
        <Icon name="ph:plus-circle" class="me-2 size-5" />
        {{ $t('add-answer-pattern') }}
      </BaseButton>
    </div>

    <!-- Fill in Blank Preview -->
    <div v-if="isFillInBlank" class="rounded-xl bg-muted-100 p-4 dark:bg-muted-800/50">
      <h4 class="mb-3 text-sm font-semibold text-muted-600 dark:text-muted-300">
        {{ $t('accepted-answers-preview') }}
      </h4>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(pattern, index) in localPatterns.filter((p) => p.pattern.trim())"
          :key="index"
          class="rounded-lg bg-white px-3 py-1.5 text-sm font-mono shadow-sm dark:bg-muted-700"
          :class="{
            'text-success-600 dark:text-success-400': getPatternStatus(pattern.pattern) === 'valid',
            'text-primary-600 dark:text-primary-400': getPatternStatus(pattern.pattern) === 'regex',
          }"
        >
          {{ pattern.pattern }}
        </span>
        <span
          v-if="localPatterns.every((p) => !p.pattern.trim())"
          class="text-sm text-muted-400"
        >
          {{ $t('no-patterns-defined') }}
        </span>
      </div>
    </div>

    <!-- Validation Warning -->
    <div
      v-if="localPatterns.length === 0"
      class="flex items-center gap-2 rounded-lg bg-warning-50 p-3 text-sm text-warning-600 dark:bg-warning-500/10 dark:text-warning-400"
    >
      <Icon name="ph:warning" class="size-5" />
      {{ $t('at-least-one-pattern-required') }}
    </div>

    <div
      v-else-if="localPatterns.some((p) => getPatternStatus(p.pattern) === 'invalid')"
      class="flex items-center gap-2 rounded-lg bg-danger-50 p-3 text-sm text-danger-600 dark:bg-danger-500/10 dark:text-danger-400"
    >
      <Icon name="ph:warning" class="size-5" />
      {{ $t('fix-invalid-patterns') }}
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

