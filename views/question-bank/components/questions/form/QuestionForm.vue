<script lang="ts" setup>
import AppInputWithFile from '~/components/app-field/AppInputWithFile.vue'
import AppInputField from '~/components/app-field/AppInputField.vue'
import { QuestionType, type Question } from '~/views/question-bank/types/question'
import Dialogue from './fields/Dialogue.vue'
import Matching from './fields/Matching.vue'
import MultiItems from './fields/MultiItems.vue'
import Reorder from './fields/Reorder.vue'

const element = defineModel<Question>({
  default: {} as Question,
})
defineProps<{
  isEvaluation?: boolean
}>()
const isQuestionHaveMultipleItems = computed(() => {
  return (
    element.value!.type === QuestionType.MultipleChoice ||
    element.value!.type === QuestionType.DropDown ||
    element.value!.type === QuestionType.Radio
  )
})
watch(
  () => element.value.type,
  () => {
    if (!element.value?.options) {
      element.value.options = []
    }
    if (!isQuestionHaveMultipleItems.value) {
      element.value.options = []
    } else {
      if (element.value?.options?.length === 0) {
        element.value.options.push({
          isCorrect: false,
          title: '',
          image: null,
          order: element.value.options.length,
        })
      }
    }
    if (element.value?.type == QuestionType.Matching) {
      element.value.matchingPairs = []
      element.value.matchingPairs.push({
        left: '',
        right: '',
      })
    }
    if (element.value?.type == QuestionType.Reorder) {
      element.value.orderItems = []
    }
    if (element.value?.type == QuestionType.Dialogue) {
      element.value.subQuestions = []
    }
  }
)
</script>

<template>
  <AppInputWithFile
    v-model:input="element.title"
    v-model:file="element.image"
    :disabled="isEvaluation"
    :label="$t('question-title')"
    class=""
  />
  
  <!-- Alternate title section for main question -->
  <div class="mb-4 mt-2 ">
    <BaseCheckbox
      v-model="element.isAlternateTitleShown"
      :disabled="isEvaluation"
      :label="$t('show-alternate-title')"
      class="mb-2"
    />
    <AppInputField
      v-if="element.isAlternateTitleShown"
      v-model="element.alternateTitle"
      :disabled="isEvaluation"
      :label="$t('alternate-title')"
      :placeholder="$t('enter-alternate-title')"
    />
  </div>
  <div  class="question-form w-[50%] mt-3 flex flex-col gap-5"
    :class="{
      'w-full': element.type === QuestionType.Article || element.type === QuestionType.Dialogue,
    }">
    <MultiItems
      v-if="isQuestionHaveMultipleItems"
      v-model="element"
      :is-evaluation="isEvaluation"
    />
    <BaseTextarea
      v-if="element.type === QuestionType.Article"
      v-model="element.correctText"
      :label="$t('answer')"
      :disabled="isEvaluation"
    />
    <BaseInput
      v-if="element.type === QuestionType.Blank"
      v-model="element.correctText"
      :label="$t('answer')"
      :disabled="isEvaluation"
    />
    <div v-if="element.type === QuestionType.TrueOrFalse" class="mt-5 flex items-center gap-5">
      <BaseRadio
        v-model="element.correctBoolean"
        :label="$t('true')"
        :value="true"
        :disabled="isEvaluation"
      />
      <BaseRadio
        v-model="element.correctBoolean"
        :label="$t('false')"
        :value="false"
        :disabled="isEvaluation"
      />
      <!-- <BaseListbox
                v-model="element.correctBoolean"
                :items="[true, false]"
                :disabled="isEvaluation"
                :label="$t('select-the-correct-answer')"
            /> -->
    </div>
    <Matching
      v-if="element?.type === QuestionType.Matching"
      v-model="element"
      :is-evaluation="isEvaluation"
    />
    <Reorder
      v-if="element?.type === QuestionType.Reorder"
      v-model="element"
      :is-evaluation="isEvaluation"
    />
    <Dialogue
      v-if="element?.type === QuestionType.Dialogue"
      v-model="element"
      :is-evaluation="isEvaluation"
    />
  </div>
</template>
