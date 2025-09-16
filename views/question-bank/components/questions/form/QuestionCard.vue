<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppInputField from '~/components/app-field/AppInputField.vue'
import type { QuestionGrades } from '~/views/evaluations/types'
import { difficultyOptions } from '~/views/question-bank'
import { questionTypeOptions } from '~/views/question-bank/types/index'
import { AuditStatus, type Question } from '~/views/question-bank/types/question'
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
  <BaseCard class="pa-5 my-4 rounded-lg !border-0 !border-s-4 !border-primary-500">
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <Icon name="ph-dots-nine-bold" size="20" />
        <h1 class="text-2xl font-bold">{{ $t('question') }} {{ index + 1 }}</h1>
        <span
          v-if="topicName"
          class="border-s-2 border-primary-300 ps-2 text-sm font-medium text-primary-600"
        >
          {{ topicName }}
        </span>
      </div>
      <div class="w-[60%] flex items-center gap-2">
        <AppAutoCompleteField
          v-model="modelValue.type"
          :items="questionTypeOptions($t)"
          :placeholder="$t('select-a-question-type')"
          item-label="label"
          item-value="value"
          :disabled="isEvaluation"
        />
        <AppAutoCompleteField
          v-model="modelValue.difficulty"
          :items="difficultyOptions($t)"
          :placeholder="$t('select-a-difficulty')"
          item-label="label"
          :disabled="isEvaluation"
          item-value="value"
        />
        <AppAutoCompleteField
          v-model="modelValue.knowledgeLevelId"
          :placeholder="$t('select-a-knowledge')"
          :disabled="isEvaluation"
          get-url="/knowledgelevel"
          item-label="name"
          item-value="id"
        />
        <BaseTag
          variant="pastel"
          :color="
            modelValue.auditStatus != AuditStatus.Pending
              ? modelValue.auditStatus == AuditStatus.Rejected
                ? 'danger'
                : 'success'
              : 'warning'
          "
          so
        >
          {{ $t(AuditStatus[modelValue.auditStatus ?? 1]) }}
        </BaseTag>
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
      </div>
    </div>

    <div
      class="pa-0 mt-3 max-h-0 overflow-hidden transition-all duration-500"
      :class="{
        'max-h-full': element.isContentShown,
        hidden: !element.isContentShown,
      }"
    >
      <QuestionForm v-model="element" :is-evaluation="isEvaluation" />
      <hr class="my-3" >
      <div v-if="!isEvaluation" class="flex justify-end gap-2">
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
    <hr class="my-2" >

    <p v-if="modelValue?.auditStatus == AuditStatus.Rejected">
      <span class="font-bold">{{ $t('rejection-reason') }}: </span>
      <span>
        {{ modelValue.rejectReason ?? 'لا يوجد' }}
      </span>
    </p>
  </BaseCard>
</template>
