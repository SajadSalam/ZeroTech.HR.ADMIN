<script lang="ts" setup>
import { questionsFakeData } from '~/views/question-bank'
import QuestionCard from '~/views/question-bank/components/questions/view/QuestionCard.vue'
import type { Question } from '~/views/question-bank/types/question'

definePageMeta({
  title: 'exam-view',
  description: 'to-view-exam-like-student',
})
const questions = ref<Question[]>([...questionsFakeData])
</script>

<template>
  <div>
    <div class="flex items-center justify-between rounded-lg bg-white p-5">
      <div>
        <h1 class="fonte-bold text-3xl">
          <span class="font-bold text-primary-500">Physics</span>

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
    <div item-key="order" class="my-5 px-10">
      <QuestionCard
        v-for="(item, index) in questions"
        :key="index"
        v-model="questions[index]"
        :index="index"
      />
    </div>
    <CardNoData v-if="questions.length === 0" />
  </div>
</template>

<style></style>
