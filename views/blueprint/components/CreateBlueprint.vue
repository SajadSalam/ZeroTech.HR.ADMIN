<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'

import { useBlueprintStore } from '../store/index'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { tableCreateHeaders } from '..'
import { DegreeDisplayType, type Blueprint } from '../types'
import { QuestionType } from '~/views/question-bank/types/question'
import { questionTypeOptions } from '~/views/question-bank/types/index'
import { difficultyOptions, knowledgeLevelOptions } from '~/views/question-bank'

const questionBankStore = useBlueprintStore()
const subjects = [
  {
    id: 1,
    name: 'Mathematics',
  },
  {
    id: 2,
    name: 'English',
  },
  {
    id: 3,
    name: 'Physics',
  },
  {
    id: 4,
    name: 'Chemistry',
  },
  {
    id: 5,
    name: 'Biology',
  },
]

const body = ref<Blueprint>({
  subjects: [],
  degreeDisplayType: DegreeDisplayType.Letters,
  dispalyResult: false,
  moveBetweenQuestions: false,
  name: '',
  successGrade: 50,
  randmoizeAnswers: true,
  randomizeQuestions: true,
})
const addSubject = () => {
  body.value.subjects.push({
    topic: '',
    difficulty: 1,
    grade: 0,
    knowledge: 1,
    numberOfQuestions: 1,
    questionType: QuestionType.Blank,
  })
}

const removeSubject = (index: number) => {
  body.value.subjects.splice(index, 1)
}

const questionBanks = ref([])
</script>
<template>
  <AppDialog
    v-model="questionBankStore.isCreateDialogOpen"
    :title="$t('create-blueprints')"
    size="3xl"
    overflow-y="visible"
  >
    <div class="rounded-3xl p-3">
      <div class="my-2 grid grid-cols-2 gap-5">
        <AppInputField :placeholder="$t('wirting-title')" :label="$t('title')" />
        <AppInputField :placeholder="$t('wirting-grade')" :label="$t('success-grade')" />
      </div>
      <AppAutoCompleteField
        fetch-on-search
        search-key="name"
        get-url="/question-bank/lookup"
        without-data
        item-label="title"
        item-value="id"
        multiple
        :label="$t('question-bank')"
        :placeholder="$t('subject')"
        @update:object-value="questionBanks = $event"
      />
      <BaseCard v-for="(questionBank, index) in questionBanks" :key="index" class="pa-3 my-2">
        <BaseHeading>
          {{ questionBank.title }}
        </BaseHeading>
        <AppTable
          hide-no-data
          :headers="tableCreateHeaders($t)"
          :items="body.subjects"
          class="mt-3"
        >
          <template #data-topic="{ index }">
            <AppAutoCompleteField
              v-model="body.subjects[index].topic"
              :items="subjects"
              item-label="name"
              item-value="id"
            />
          </template>
          <template #data-questionType="{ index }">
            <AppAutoCompleteField
              v-model="body.subjects[index].questionType"
              :items="questionTypeOptions($t)"
              item-label="label"
              item-value="value"
            />
          </template>
          <template #data-difficulty="{ index }">
            <div class="flex items-center gap-2">
              <AppAutoCompleteField
                v-model="body.subjects[index].difficulty"
                :items="difficultyOptions($t)"
                item-label="label"
                item-value="value"
              />
              <BaseButtonIcon
                size="sm"
                color="none"
                class="text-red-500"
                @click="removeSubject(index)"
              >
                <Icon name="tabler-circle-x" class="size-8" />
              </BaseButtonIcon>
            </div>
          </template>
          <template #data-knowledge="{ index }">
            <AppAutoCompleteField
              v-model="body.subjects[index].knowledge"
              :items="knowledgeLevelOptions($t)"
              item-label="label"
              item-value="value"
            />
          </template>
          <template #data-numberOfQuestions="{ index }">
            <BaseInput v-model="body.subjects[index].numberOfQuestions" type="number" />
          </template>
          <template #data-grade="{ index }">
            <BaseInput v-model="body.subjects[index].grade" type="number" />
          </template>
        </AppTable>
      </BaseCard>
      <div class="flex justify-end">
        <BaseButton color="primary" class="gap-1" variant="pastel" @click="addSubject">
          <Icon name="ph:upload-simple-duotone" class="size-5" />
          {{ $t('add-subject') }}
        </BaseButton>
      </div>
      <h2 class="mt-5 text-lg font-bold">
        {{ $t('more-settings') }}
      </h2>
      <p class="text-sm text-muted-500">
        {{ $t('select-the-options-of-the-exam') }}
      </p>
      <div class="my-3 grid gap-5 md:grid-cols-6">
        <BaseTag
          :color="body.dispalyResult ? 'primary' : 'muted'"
          variant="pastel"
          size="lg"
          class="pa-3 flex cursor-pointer items-center gap-2 text-lg"
          @click="body.dispalyResult = !body.dispalyResult"
        >
          <div
            class="h-2 w-2 rounded-full"
            :class="{
              'bg-primary-500': body.dispalyResult,
              'bg-muted-300': !body.dispalyResult,
            }"
          />
          {{ $t('display-result') }}
        </BaseTag>
        <BaseTag
          :color="body.moveBetweenQuestions ? 'primary' : 'muted'"
          variant="pastel"
          size="lg"
          class="pa-3 flex cursor-pointer items-center gap-2 text-lg"
          @click="body.moveBetweenQuestions = !body.moveBetweenQuestions"
        >
          <div
            class="h-2 w-2 rounded-full"
            :class="{
              'bg-primary-500': body.moveBetweenQuestions,
              'bg-muted-300': !body.moveBetweenQuestions,
            }"
          />
          {{ $t('move-between-questions') }}
        </BaseTag>
        <BaseTag
          :color="body.randmoizeAnswers ? 'primary' : 'muted'"
          variant="pastel"
          size="lg"
          class="pa-3 flex cursor-pointer items-center gap-2 text-lg"
          @click="body.randmoizeAnswers = !body.randmoizeAnswers"
        >
          <div
            class="h-2 w-2 rounded-full"
            :class="{
              'bg-primary-500': body.randmoizeAnswers,
              'bg-muted-300': !body.randmoizeAnswers,
            }"
          />
          {{ $t('randomize-answers') }}
        </BaseTag>
        <BaseTag
          :color="body.randomizeQuestions ? 'primary' : 'muted'"
          variant="pastel"
          size="lg"
          class="pa-3 flex cursor-pointer items-center gap-2 text-lg"
          @click="body.randomizeQuestions = !body.randomizeQuestions"
        >
          <div
            class="h-2 w-2 rounded-full"
            :class="{
              'bg-primary-500': body.randomizeQuestions,
              'bg-muted-300': !body.randomizeQuestions,
            }"
          />
          {{ $t('randomize-choices') }}
        </BaseTag>
      </div>
    </div>
    <template #actions>
      <BaseButton
        color="primary"
        class="gap-1"
        @click="questionBankStore.isCreateDialogOpen = false"
      >
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        {{ $t('save-change') }}
      </BaseButton>
    </template>
  </AppDialog>
</template>

<style>
.max-w-5xl {
  max-width: 75rem !important;
}
</style>
