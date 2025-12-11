<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import type { QuestionDto } from '~/views/questions/types';
import { getDifficultyConfig, getQuestionTypeIcon, getQuestionTypeLabel } from '~/views/questions/utils';

defineProps<{
  question: QuestionDto
}>()

defineEmits<{
  edit: [question: QuestionDto]
  delete: [questionId: string]
}>()

const { t } = useI18n()
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
    </div>

    <!-- Question Stats -->
    <div class="mt-4 flex items-center gap-4 border-t border-muted-100 pt-4 dark:border-muted-700">
      <!-- Choices count for choice-based questions -->
      <div
        v-if="question.choices?.length"
        class="flex items-center gap-1 text-xs text-muted-400"
      >
        <Icon name="ph:list-bullets" class="size-4" />
        {{ question.choices.length }} {{ $t('choices') }}
      </div>

      <!-- Ordering items count -->
      <div
        v-if="question.orderingItems?.length"
        class="flex items-center gap-1 text-xs text-muted-400"
      >
        <Icon name="ph:list-numbers" class="size-4" />
        {{ question.orderingItems.length }} {{ $t('items') }}
      </div>

      <!-- Matching items count -->
      <div
        v-if="question.matchingLeftItems?.length"
        class="flex items-center gap-1 text-xs text-muted-400"
      >
        <Icon name="ph:arrows-left-right" class="size-4" />
        {{ question.matchingLeftItems.length }} {{ $t('pairs') }}
      </div>

      <!-- Text patterns count -->
      <div
        v-if="question.textAnswerPatterns?.length"
        class="flex items-center gap-1 text-xs text-muted-400"
      >
        <Icon name="ph:text-aa" class="size-4" />
        {{ question.textAnswerPatterns.length }} {{ $t('patterns') }}
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

