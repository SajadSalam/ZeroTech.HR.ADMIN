<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppInputField from '~/components/app-field/AppInputField.vue'
import type { QuestionGrades } from '~/views/evaluations/types'
import { difficultyOptions } from '~/views/question-bank'
import { questionTypeOptions } from '~/views/question-bank/types/index'
import { AuditStatus, QuestionType, type Question } from '~/views/question-bank/types/question'
import QuestionForm from './QuestionForm.vue'
const props = defineProps<{
  index: number
  isEvaluation?: boolean
  evaluation?: QuestionGrades
  onlyView?: boolean
  topicName?: string
}>()
const emit = defineEmits(['removeQuestion', 'duplicate'])
const element = defineModel<Question>()
const { t } = useI18n()

</script>

<template>
  <BaseCard class="pa-5 my-4 rounded-lg !border-0 !border-s-4 !border-primary-500" :key="modelValue.id">
    <div class="flex items-center justify-between gap-2">
      <div class="flex justify-between w-[50%]">
          <div class="flex items-center gap-2">

            <BaseButtonIcon
                color="muted"
                variant="outline"
                @click="element.isContentShown = !element.isContentShown"
                >
                <Icon
                name="tabler-chevron-down"
                size="20"
                class="transition-all duration-500"
                :class="element.isContentShown ? 'rotate-180 transform' : ''"
                />
              </BaseButtonIcon>
              <Icon name="ph-dots-nine-bold" size="20" />
              <h1 class="text-2xl font-bold">{{ $t('question') }} {{ modelValue?.sequence }}</h1>
              <span
              v-if="topicName"
              class="border-s-2 border-primary-300 ps-2 text-sm font-medium text-primary-600"
              >
              {{ topicName }}
            </span>
        </div>
        <div class="">
          <BaseTag
          variant="pastel"
          :color="
            element.auditStatus != AuditStatus.Pending
              ? element.auditStatus == AuditStatus.Rejected
                ? 'danger'
                : 'success'
              : 'warning'
          "
          so
        >
          {{ $t(AuditStatus[element.auditStatus ?? 1]) }}
        </BaseTag>
        </div>
      </div>

      <div class="w-[50%] " v-if="element.isContentShown">
        <h1 v-if="element.type !== QuestionType.Dialogue" class="text-2xl font-bold mx-4">
          {{ $t('question-answers') }} 
        </h1>
        <h1 v-else class="text-2xl font-bold">
          {{ $t('sub-questions') }} 
        </h1>
        

      </div>
    </div>

    <div
      class="pa-0 mt-3 max-h-0 overflow-hidden transition-all duration-500 relative"
      :class="{
        'max-h-full': element.isContentShown,
        hidden: !element.isContentShown,
      }"
    >
      <hr class=" absolute top-0 bg-gray-100 w-full rotate-90">
      <QuestionForm v-model="element" :is-evaluation="isEvaluation" />


      
      <div v-if="!isEvaluation" class="flex justify-end gap-2 mt-8">
        <BaseButtonIcon color="none" @click="emit('removeQuestion', index)">
          <Icon name="tabler-trash" class="text-danger-500" size="20" />
        </BaseButtonIcon>
        <!-- <BaseButtonIcon color="none" @click="emit('duplicate', item)">
                    <Icon
                        name="tabler-copy"
                        class="text-primary-500"
                        size="20"
                    ></Icon>
                </BaseButtonIcon> -->
      </div>
      <div v-if="isEvaluation && !onlyView" class="flex items-center gap-2">
        <AppInputField :value="evaluation?.grade" :label="$t('grade')" type="number" />
      </div>
    </div>

    <p v-if="modelValue?.auditStatus == AuditStatus.Rejected">
      <span class="font-bold">{{ $t('rejection-reason') }}: </span>
      <span>
        {{ modelValue.rejectReason ?? 'لا يوجد' }}
      </span>
    </p>
  </BaseCard>
</template>
