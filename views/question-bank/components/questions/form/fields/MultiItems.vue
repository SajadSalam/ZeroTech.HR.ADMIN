<script lang="ts" setup>
import AppInputWithFile from '~/components/app-field/AppInputWithFile.vue'
import { QuestionType } from '~/views/question-bank/types/question'
import type { Question } from '~/views/question-bank/types/question'
defineOptions({
  inheritAttrs: false,
})
defineProps<{
  isEvaluation?: boolean
}>()
const modelValue = defineModel<Question>()
const addItem = () => {
  if (!modelValue.value?.options) {
    modelValue.value!.options = []
  }

  modelValue.value?.options.push({
    isCorrect: false,
    title: '',
    image: '',
    order: modelValue.value.options.length,
  })
}
const removeItem = (index: number) => {
  modelValue.value?.options!.splice(index, 1)
}
const changeCorrect = (item: any) => {
  item.isCorrect = !item.isCorrect
  if (modelValue.value.type !== QuestionType.MultipleChoice) {
    modelValue.value?.options.forEach((option) => {
      if (option !== item) {
        option.isCorrect = false
      }
    })
  }
}
</script>

<template>
  <div>
    <h1 class="my-3">
      {{ $t('question-answers') }}
    </h1>
    <div
      v-for="(item, index) in modelValue?.options"
      :key="`option-${index}`"
      class="my-3 flex items-center gap-3"
    >
      <AppInputWithFile
        v-model:input="item.title"
        v-model:file="item.image"
        label=""
        class=""
        type="text"
        :disabled="isEvaluation"
      />
      <div class="flex items-center">
        <BaseButtonIcon
          :color="item.isCorrect ? 'success' : 'none'"
          variant="outline"
          :disabled="isEvaluation"
          @click="changeCorrect(item)"
        >
          <Icon name="ph-check" size="20" />
        </BaseButtonIcon>
        <BaseButtonIcon
          :color="!item.isCorrect ? 'danger' : 'none'"
          variant="outline"
          :disabled="isEvaluation"
          @click="changeCorrect(item)"
        >
          <Icon name="ph-x" size="20" />
        </BaseButtonIcon>
        <BaseButton
          v-if="!isEvaluation"
          color="danger"
          variant="outline"
          class="mx-2"
          size="sm"
          @click="removeItem(index)"
        >
          <Icon name="tabler-circle-x" class="me-1 text-danger-500" size="20" />
          <span class="text-nowrap text-xs">{{ $t('delete-option') }}</span>
        </BaseButton>
      </div>
    </div>

    <BaseButton
      v-if="!isEvaluation"
      variant="outline"
      color="primary"
      size="sm"
      class="mt-5"
      @click="addItem"
    >
      <Icon name="tabler-plus" size="20" />
      {{ $t('add-more-answers') }}
    </BaseButton>
  </div>
</template>
