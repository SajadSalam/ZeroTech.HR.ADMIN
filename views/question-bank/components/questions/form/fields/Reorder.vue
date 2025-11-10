<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppInputWithFile from '~/components/app-field/AppInputWithFile.vue'
import { QuestionType } from '~/views/question-bank/types/question'
import type { Question } from '~/views/question-bank/types/question'
import draggable from 'vuedraggable'
const dragOptions = {
  animation: 200,
  handle: '.drag-handle',
  onEnd: (event: any) => {},
}
defineProps<{
  isEvaluation?: boolean
}>()
const modelValue = defineModel<Question>()
const addItem = () => {
  if (!modelValue.value?.orderItems) {
    modelValue.value!.orderItems = []
  }

  modelValue.value?.orderItems.push({
    title: '',
    order: modelValue.value?.orderItems.length + 1,
  })
}
const removeItem = (index: number) => {
  modelValue.value?.orderItems!.splice(index, 1)
}
</script>

<template>
  <div>
    <draggable v-model="modelValue.orderItems" item-key="order" class="my-5" :options="dragOptions">
      <template #item="{ index }">
        <div class="my-3 flex w-full items-center gap-5">
          <BaseButtonIcon color="none" variant="outline" class="drag-handle">
            <Icon name="ph-dots-nine-bold" size="20" />
          </BaseButtonIcon>
          {{ index + 1 }}.
          <BaseInput
            v-model="modelValue.orderItems[index].title"
            :disabled="isEvaluation"
            :placeholder="$t('enter-the-text')"
          />
          <BaseButtonIcon
            v-if="!isEvaluation"
            color="none"
            variant="outline"
            @click="removeItem(index)"
          >
            <Icon name="tabler:trash" size="20" class="text-danger-500" />
          </BaseButtonIcon>
        </div>
      </template>
    </draggable>

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
    <p>
      <span class="font-bold">{{ $t('note') }}:</span>
      {{ $t('put-the-correct-order-of-the-answers') }}
    </p>
  </div>
</template>

<style scoped></style>
