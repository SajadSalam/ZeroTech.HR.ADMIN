<script lang="ts" setup>
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppInputWithFile from '~/components/app-field/AppInputWithFile.vue'
import { QuestionType } from '~/views/question-bank/types/question'
import type { Question } from '~/views/question-bank/types/question'
defineOptions({
  inheritAttrs: false,
})
const modelValue = defineModel<Question>()

const correctOptions = computed(() => {
  const correct = modelValue.value?.options.filter((x) => x.isCorrect)
  if (!correct) {
    return null
  }
  if (modelValue.value.type == QuestionType.MultipleChoice) {
    return correct.map((x) => x.id)
  } else {
    return correct[0].id
  }
})
</script>

<template>
  <div>
    <h1 class="my-3">
      {{ $t('question-answers') }}
    </h1>
    <div
      v-for="(item, index) in modelValue?.options"
      v-if="modelValue?.type !== QuestionType.DropDown"
      :key="item.title"
      class="my-3 flex items-center gap-3"
    >
      <BaseCheckbox
        v-if="modelValue?.type === QuestionType.MultipleChoice"
        disabled
        :model-value="correctOptions"
        :value="item.id"
      />
      <BaseRadio
        v-if="modelValue?.type === QuestionType.Radio"
        disabled
        :model-value="correctOptions"
        :value="item.id"
      />
      <BaseHeading disabled size="lg" class="text-2xl font-bold"
        >{{ index + 1 }}. {{ item.title }}</BaseHeading
      >
    </div>
    <AppAutoCompleteField
      v-if="modelValue?.type === QuestionType.DropDown"
      :model-value="correctOptions"
      :items="modelValue.options"
      item-label="title"
      item-value="id"
    />
  </div>
</template>
