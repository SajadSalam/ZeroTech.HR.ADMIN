<script lang="ts" setup>
import { defineProps, defineEmits, watch } from 'vue'
import {
  questionTypeOptions,
  type QuestionCustomAnswerProps,
} from '~/views/question-bank/types/index'
import { type Question, QuestionType } from '~/views/question-bank/types/question'
import QuestionForm from './QuestionForm.vue'
import { difficultyOptions } from '~/views/question-bank'
import { useQuestionBankStore } from '~/views/question-bank/store'
import { useI18n } from 'vue-i18n'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { useAuthStore } from '~/views/auth/store/auth'

const props = defineProps<{
  index: number
  showReplcae?: boolean
  customAnswers?: QuestionCustomAnswerProps
}>()
const emit = defineEmits(['removeQuestion', 'duplicate', 'replace'])
const questionBankStore = useQuestionBankStore()
const element = defineModel<Question>()
const { t } = useI18n()
const { hasPrivilege } = useAuthStore()
</script>

<template>
  <BaseCard class="pa-5 my-4 rounded-lg !border-0 !border-s-4 !border-primary-500">
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <h1 class="text-2xl font-bold">{{ $t('question') }} {{ index + 1 }}</h1>
      </div>
      <div class="flex items-center gap-2">
        <BaseButton
          v-if="showReplcae && hasPrivilege('ums:ems:exam:replace-question')"
          color="primary"
          variant="outline"
          @click="emit('replace', element)"
        >
          <Icon name="tabler-replace" class="me-2" size="20" />
          {{ $t('replace-question') }}
        </BaseButton>
      </div>
    </div>

    <div class="pa-0 mt-3 transition-all duration-500 w-full">
      <QuestionForm v-model="element" :custom-answers="customAnswers" />
      <slot />
    </div>
  </BaseCard>
</template>
