<script lang="ts" setup>
import AppFileUploaderButton from '~/components/app-field/AppFileUploaderButton.vue'

import { type Question, QuestionType } from '~/views/question-bank/types/question'
import AppInputWithFile from '~/components/app-field/AppInputWithFile.vue'
import MultiItems from './fields/MultiItems.vue'
import Matching from './fields/Matching.vue'
import Reorder from './fields/Reorder.vue'
import { difficultyOptions } from '~/views/question-bank'
import type { QuestionCustomAnswerProps } from '~/views/question-bank/types'

const element = defineModel<Question>({
  default: {} as Question,
})

const props = defineProps<{
  customAnswers?: QuestionCustomAnswerProps
}>()

const correctText = ref(props.customAnswers?.correctText ?? element.value?.correctText)
const correctBoolean = ref(props.customAnswers?.correctBoolean ?? element.value?.correctBoolean)
const isQuestionHaveMultipleItems = computed(() => {
  return (
    element.value!.type === QuestionType.MultipleChoice ||
    element.value!.type === QuestionType.DropDown ||
    element.value!.type === QuestionType.Radio
  )
})
watchDeep(element, () => {
  if (element.value.options) {
    element.value.options.forEach((option) => {
      option.isCorrect = props.customAnswers?.correctOptionIds?.find((x) => x == option.id) != null
    })
  }
})
</script>

<template>
  <BaseHeading :level="3" class="text-2xl font-bold">{{ element.title }}</BaseHeading>
  <div
    class="question-form w-50% mt-3 flex flex-col gap-5"
    :class="{
      'w-full': element.type === QuestionType.Article,
    }"
  >
    <MultiItems v-if="isQuestionHaveMultipleItems" v-model="element" is-evaluation />
    <BaseTextarea
      v-if="element.type === QuestionType.Article"
      v-model="element.correctText"
      :label="$t('answer')"
    />
    <BaseInput
      v-if="element.type === QuestionType.Blank"
      v-model="element.correctText"
      disabled
      :label="$t('answer')"
    />
    <div v-if="element.type === QuestionType.TrueOrFalse" class="mt-5 flex items-center gap-5">
      <BaseRadio v-model="correctBoolean" :label="$t('true')" :value="true" disabled />
      <BaseRadio v-model="correctBoolean" :label="$t('false')" :value="false" disabled />
    </div>
    <Matching v-if="element?.type === QuestionType.Matching" v-model="element" is-evaluation />
    <Reorder v-if="element?.type === QuestionType.Reorder" v-model="element" is-evaluation />
  </div>
</template>
<style lang="scss">
.question-form {
}
</style>
