<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppInputWithFile from '~/components/app-field/AppInputWithFile.vue'
import { difficultyOptions } from '~/views/question-bank'
import { questionTypeOptions } from '~/views/question-bank/types/index'
import { Difficulty, QuestionType, type Question } from '~/views/question-bank/types/question'
import Matching from './Matching.vue'
import MultiItems from './MultiItems.vue'
import Reorder from './Reorder.vue'
import { useKnowledgelevelStore } from '~/views/knowledgelevel/store'

const { t } = useI18n()

const modelValue = defineModel<Question>({
  default: {} as Question,
})

defineProps<{
  isEvaluation?: boolean
}>()

// Initialize subQuestions if not present
if (!modelValue.value?.subQuestions) {
  modelValue.value!.subQuestions = []
}

const addSubQuestion = () => {
  if (!modelValue.value?.subQuestions) {
    modelValue.value!.subQuestions = []
  }

  const newSubQuestion: Question = {
    id: crypto.randomUUID(),
    title: '',
    alternateTitle: '',
    isAlternateTitleShown: false,
    image: null,
    order: modelValue.value.subQuestions.length + 1,
    type: QuestionType.MultipleChoice,
    options: [
      {
        // id: crypto.randomUUID(),
        title: '',
        alternateTitle: '',
        isAlternateTitleShown: false,
        image: null,
        order: 1,
        isCorrect: false,
      }
    ],
    correctBoolean: false,
    correctText: '',
    knowledgeLevelId: '',
    knowledgeLevelSimplifiedIntId: 0,
    difficulty: Difficulty.Easy,
    topicId: modelValue.value.topicId,
    parentQuestionId: modelValue.value.id,
    isContentShown: true,
    matchingPairs: [],
    orderItems: [],
    subQuestions: []
  }

  modelValue.value?.subQuestions.push(newSubQuestion)
}

const removeSubQuestion = (index: number) => {
  modelValue.value?.subQuestions!.splice(index, 1)
  // Reorder remaining sub-questions
  modelValue.value?.subQuestions!.forEach((subQ, idx) => {
    subQ.order = idx + 1
  })
}

const duplicateSubQuestion = (question: Question) => {
  if (!modelValue.value?.subQuestions) return
  
  const duplicatedQuestion: Question = {
    ...JSON.parse(JSON.stringify(question)),
    id: crypto.randomUUID(),
    order: modelValue.value.subQuestions.length + 1,
  }
  
  // Generate new IDs for options
  if (duplicatedQuestion.options) {
    duplicatedQuestion.options = duplicatedQuestion.options.map(option => ({
      ...option,
      id: crypto.randomUUID(),
    }))
  }
  
  modelValue.value?.subQuestions.push(duplicatedQuestion)
}

const isQuestionHaveMultipleItems = (question: Question) => {
  return (
    question.type === QuestionType.MultipleChoice ||
    question.type === QuestionType.DropDown ||
    question.type === QuestionType.Radio
  )
}

// Watch for sub-question type changes to initialize appropriate data
const watchSubQuestionType = (subQuestion: Question, newType: QuestionType) => {
  if (!subQuestion.options) {
    subQuestion.options = []
  }
  
  if (!isQuestionHaveMultipleItems(subQuestion)) {
    subQuestion.options = []
  } else {
    if (subQuestion.options.length === 0) {
      subQuestion.options.push({
        id: crypto.randomUUID(),
        title: '',
        alternateTitle: '',
        isAlternateTitleShown: false,
        image: null,
        order: 1,
        isCorrect: false,
      })
    }
  }
  
  if (newType === QuestionType.Matching) {
    subQuestion.matchingPairs = []
    subQuestion.matchingPairs.push({
      left: '',
      right: '',
    })
  }
  
  if (newType === QuestionType.Reorder) {
    subQuestion.orderItems = []
  }
}

const knowledgeLevelStore = useKnowledgelevelStore()
const knowledgeLevels = computed(() => knowledgeLevelStore.knowledgelevels)
</script>

<template>
  <div class="w-full"> 
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-lg font-semibold">
        {{ $t('sub-questions') }}
      </h1>
      <BaseButton
        v-if="!isEvaluation"
        variant="outline"
        color="primary"
        size="sm"
        @click="addSubQuestion"
      >
        <Icon name="tabler-plus" size="20" />
        {{ $t('add-sub-question') }}
      </BaseButton>
    </div>

    <div
      v-for="(subQuestion, index) in modelValue?.subQuestions"
      :key="subQuestion.id || index"
      class="mb-6 rounded-lg border border-gray-200 p-4 w-full"
    >
      <!-- Sub-question header -->
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Icon name="ph-dots-nine-bold" size="20" />
          <h2 class="text-lg font-medium">{{ $t('sub-question') }} {{ index + 1 }}</h2>
        </div>
        <div v-if="!isEvaluation" class="flex items-center gap-2">
          <BaseButton
            variant="outline"
            color="primary"
            size="sm"
            @click="duplicateSubQuestion(subQuestion)"
          >
            <Icon name="tabler-copy" size="16" />
          </BaseButton>
          <BaseButton
            variant="outline"
            color="danger"
            size="sm"
            @click="removeSubQuestion(index)"
          >
            <Icon name="tabler-trash" size="16" />
          </BaseButton>
        </div>
      </div>

       <!-- Sub-question type and difficulty selectors -->
       <div class="mb-4 grid gap-3 md:grid-cols-3">
         <AppAutoCompleteField
           v-model="modelValue.subQuestions![index].type"
           :items="questionTypeOptions($t).filter(opt => opt.value !== QuestionType.Dialogue)"
           :placeholder="$t('select-a-question-type')"
           item-label="label"
           item-value="value"
           :disabled="isEvaluation"
           @update:model-value="(newValue) => watchSubQuestionType(modelValue.subQuestions![index], newValue)"
         />
         <AppAutoCompleteField
           v-model="modelValue.subQuestions![index].difficulty"
           :items="difficultyOptions($t)"
           :placeholder="$t('select-a-difficulty')"
           item-label="label"
           item-value="value"
           :disabled="isEvaluation"
         />
            <AppAutoCompleteField
           v-model="modelValue.subQuestions![index].knowledgeLevelId"
           :placeholder="$t('select-a-knowledge')"
           :disabled="isEvaluation"
           :items="knowledgeLevels"
           item-label="name"
           item-value="id"
         />
       </div>

       <!-- Sub-question title and content -->
       <AppInputWithFile
         v-model:input="modelValue.subQuestions![index].title"
         v-model:file="modelValue.subQuestions![index].image"
         :disabled="isEvaluation"
         :label="$t('sub-question-title')"
         class="mb-4"
         type="text"
       />

       <!-- Alternate title section -->
       <div class="mb-4">
         <BaseCheckbox
           v-model="modelValue.subQuestions![index].isAlternateTitleShown"
           :disabled="isEvaluation"
           :label="$t('show-alternate-title')"
           class="mb-2"
         />
         <AppInputField
           v-if="subQuestion.isAlternateTitleShown"
           v-model="modelValue.subQuestions![index].alternateTitle"
           :disabled="isEvaluation"
           :label="$t('alternate-title')"
           :placeholder="$t('enter-alternate-title')"
         />
       </div>

       <!-- Sub-question specific form fields based on type -->
       <div class="sub-question-content">
         <!-- Multiple choice, dropdown, radio -->
         <MultiItems
           v-if="isQuestionHaveMultipleItems(subQuestion)"
           v-model="modelValue.subQuestions![index]"
           :is-evaluation="isEvaluation"
         />

         <!-- Article type -->
         <BaseTextarea
           v-if="subQuestion.type === QuestionType.Article"
           v-model="modelValue.subQuestions![index].correctText"
           :label="$t('answer')"
           :disabled="isEvaluation"
         />

         <!-- Fill in the blank -->
         <BaseInput
           v-if="subQuestion.type === QuestionType.Blank"
           v-model="modelValue.subQuestions![index].correctText"
           :label="$t('answer')"
           :disabled="isEvaluation"
         />

         <!-- True or False -->
         <div v-if="subQuestion.type === QuestionType.TrueOrFalse" class="mt-3 flex items-center gap-5">
           <BaseRadio
             v-model="modelValue.subQuestions![index].correctBoolean"
             :label="$t('true')"
             :value="true"
             :disabled="isEvaluation"
           />
           <BaseRadio
             v-model="modelValue.subQuestions![index].correctBoolean"
             :label="$t('false')"
             :value="false"
             :disabled="isEvaluation"
           />
         </div>

         <!-- Matching -->
         <Matching
           v-if="subQuestion.type === QuestionType.Matching"
           v-model="modelValue.subQuestions![index]"
           :is-evaluation="isEvaluation"
         />

         <!-- Reorder -->
         <Reorder
           v-if="subQuestion.type === QuestionType.Reorder"
           v-model="modelValue.subQuestions![index]"
           :is-evaluation="isEvaluation"
         />
       </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="!modelValue?.subQuestions?.length"
      class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center"
    >
      <Icon name="ph-chat-circle-dots-duotone" size="48" class="mb-4 text-gray-400" />
      <h3 class="mb-2 text-lg font-medium text-gray-600">{{ $t('no-sub-questions') }}</h3>
      <p class="mb-4 text-sm text-gray-500">{{ $t('add-sub-questions-to-create-dialogue') }}</p>
      <BaseButton
        v-if="!isEvaluation"
        variant="outline"
        color="primary"
        @click="addSubQuestion"
      >
        <Icon name="tabler-plus" size="20" />
        {{ $t('add-first-sub-question') }}
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.sub-question-content {
  border-left: 3px solid #e5e7eb;
  padding-left: 1rem;
  margin-left: 0.5rem;
}
</style>