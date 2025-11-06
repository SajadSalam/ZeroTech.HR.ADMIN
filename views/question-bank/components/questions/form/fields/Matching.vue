<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'
import type { Question } from '~/views/question-bank/types/question'

const modelValue = defineModel<Question>({
  default: {} as Question,
})
defineProps<{
  isEvaluation?: boolean
}>()
const addItem = () => {
  if (!modelValue.value?.matchingPairs) {
    modelValue.value!.matchingPairs = []
  }

  modelValue.value?.matchingPairs.push({
    left: '',
    right: '',
  })
}
const removeItem = (index: number) => {
  modelValue.value?.matchingPairs!.splice(index, 1)
}

const alphabetIndex = (index: number) => {
  return String.fromCharCode(65 + index)
}
</script>

<template>
  <div class="bg-[#F8F8F8] border-blue-500">
    <h1 class="my-3">
      {{ $t('question-answers') }}
    </h1>
    <div
      v-for="(item, index) in modelValue?.matchingPairs"
      :key="`matching${index}`"
      class="my-3 flex items-center gap-3"
    >
      <div>
        <p class="text-white">-</p>
        <BaseButtonIcon
          v-if="!isEvaluation"
          color="none"
          variant="outline"
          @click="removeItem(index)"
        >
          <Icon name="ph-dots-nine-bold" size="20" />
        </BaseButtonIcon>
      </div>
      <div>
        <p>{{ index + 1 }}.</p>
        <AppInputField
          v-model="item.left"
          :disabled="isEvaluation"
          :placeholder="$t('enter-the-text')"
        />
      </div>
      <div>
        <p>{{ alphabetIndex(index) }}.</p>
        <AppInputField
          v-model="item.right"
          :disabled="isEvaluation"
          :placeholder="$t('enter-the-text')"
        />
      </div>
      <div>
        <p class="text-white">-</p>
        <BaseButtonIcon
          v-if="!isEvaluation"
          color="none"
          class="text-danger-500"
          variant="outline"
          @click="removeItem(index)"
        >
          <Icon name="tabler:trash" size="20" />
        </BaseButtonIcon>
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

<style scoped></style>
