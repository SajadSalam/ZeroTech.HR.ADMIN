<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { useQuestionStore } from '../store'
import type { Question, QuestionOption } from '../types'

const { t } = useI18n()
const questionStore = useQuestionStore()

const selectedQuestion = computed(() => questionStore.selectedQuestion)

const validator = new Validator<Question>(
  {
    title: selectedQuestion.value?.title as string,
    options: selectedQuestion.value?.options || [
      { title: '', isTrueAnswer: false },
      { title: '', isTrueAnswer: false },
      { title: '', isTrueAnswer: false },
      { title: '', isTrueAnswer: false },
    ],
    publishedAt: new Date().toISOString(),
  },
  {
    title: {
      required: requiredValidator('Question title'),
    },
  }
)

const body = validator.validation

const isLoading = computed(() => {
  return questionStore.isLoading
})

const updateOption = (index: number, field: keyof QuestionOption, value: string | boolean) => {
  const newOptions = [...body.value.options.$model]
  newOptions[index] = { ...newOptions[index], [field]: value }
  body.value.options.$model = newOptions
}

const setCorrectAnswer = (index: number) => {
  const newOptions = body.value.options.$model.map((option, i) => ({
    ...option,
    isTrueAnswer: i === index,
  }))
  body.value.options.$model = newOptions
}

const validateOptions = () => {
  const options: QuestionOption[] = body.value.options.$model
  const hasCorrectAnswer = options.some(option => option.isTrueAnswer)
  const allOptionsHaveText = options.every(option => option.title.trim() !== '')
  
  if (!hasCorrectAnswer) {
    alert('Please select a correct answer')
    return false
  }
  
  if (!allOptionsHaveText) {
    alert('Please fill in all options')
    return false
  }
  
  return true
}

const updateQuestion = async () => {
  const isValid = await body.value.$validate()
  if (!isValid) return
  
  if (!validateOptions()) return
  
  await questionStore.updateQuestion(validator.extractBody())
  validator.resetBody()
  questionStore.isEditDialogOpen = false
}

watch(
  () => questionStore.isEditDialogOpen,
  (value) => {
    if (!value) {
      validator.resetBody()
    } else {
      validator.fillBody({
        title: selectedQuestion.value?.title as string,
        options: selectedQuestion.value?.options || [
          { title: '', isTrueAnswer: false },
          { title: '', isTrueAnswer: false },
          { title: '', isTrueAnswer: false },
          { title: '', isTrueAnswer: false },
        ],
        publishedAt: new Date().toISOString(),
      })
    }
  }
)
</script>

<template>
  <AppDialog
    v-model="questionStore.isEditDialogOpen"
    :title="$t('edit-question')"
    size="3xl"
    overflow-y="visible"
  >
    <div class="rounded-3xl p-3">
      <div class="mb-4">
        <AppTextAreaField
          v-model="body.title.$model"
          :errors="body.title.$errors"
          size="md"
          :label="$t('question-title')"
          rows="3"
        />
      </div>
      
      <div class="space-y-4">
        <h3 class="text-lg font-medium">{{ $t('options') }}</h3>
        
        <div v-for="(option, index) in body.options.$model" :key="index" class="flex items-center gap-3">
          <div class="flex-1">
            <AppInputField
              :model-value="option.title"
              @update:model-value="(value) => updateOption(index, 'title', value)"
              size="md"
              :label="$t('option') + ' ' + (index + 1)"
            />
          </div>
          
          <div class="flex items-center gap-2">
            <input
              type="radio"
              :name="'correct-answer-edit'"
              :checked="option.isTrueAnswer"
              @change="setCorrectAnswer(index)"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-600">{{ $t('correct-answer') }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <template #actions>
      <BaseButton color="primary" class="gap-1" :loading="isLoading" @click="updateQuestion">
        <Icon name="ph:check-circle-duotone" class="size-5" />
        {{ $t('save') }}
      </BaseButton>
    </template>
  </AppDialog>
</template> 