<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'

import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { difficultyOptions } from '~/views/question-bank'
import { questionTypeOptions } from '~/views/question-bank/types/index'
import { QuestionType } from '~/views/questions/types'
import { tableCreateHeaders } from '..'
import { useBlueprintStore } from '../store/index'
import { DegreeDisplayType, type Blueprint } from '../types'

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
  <div>
    d
  </div>
</template>

<style>

</style>