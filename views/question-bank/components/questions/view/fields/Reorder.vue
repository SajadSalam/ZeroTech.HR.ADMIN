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
    <h1 class="my-3">
      {{ $t('question-answers') }}
    </h1>
    <draggable v-model="modelValue.orderItems" item-key="order" class="my-5" :options="dragOptions">
      <template #item="{ index }">
        <div class="my-3 flex w-full items-center gap-5">
          <BaseButtonIcon color="none" variant="outline" class="drag-handle">
            <Icon name="ph-dots-nine-bold" size="20" />
          </BaseButtonIcon>

          <BaseInput
            v-model="modelValue.orderItems[index].title"
            :placeholder="$t('enter-the-text')"
            disabled
          />
        </div>
      </template>
    </draggable>
  </div>
</template>

<style scoped></style>
