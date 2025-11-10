<script lang="ts" setup>
import AppInputWithFile from '~/components/app-field/AppInputWithFile.vue'
import AppInputField from '~/components/app-field/AppInputField.vue'
import { AuditStatus, QuestionType, type Question } from '~/views/question-bank/types/question'
import Dialogue from './fields/Dialogue.vue'
import Matching from './fields/Matching.vue'
import MultiItems from './fields/MultiItems.vue'
import Reorder from './fields/Reorder.vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import AppFileUploaderButton from '~/components/app-field/AppFileUploaderButton.vue'
import AppFileField from '~/components/app-field/AppFileField.vue'
import { difficultyOptions } from '~/views/question-bank'
import { questionTypeOptions } from '~/views/question-bank/types'
import { useKnowledgelevelStore } from '~/views/knowledgelevel/store'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'

const element = defineModel<Question>({
  default: {} as Question,
})
defineProps<{
  isEvaluation?: boolean
}>()
const isQuestionHaveMultipleItems = computed(() => {
  return (
    element.value!.type === QuestionType.MultipleChoice ||
    element.value!.type === QuestionType.DropDown ||
    element.value!.type === QuestionType.Radio
  )
})
watch(
  () => element.value.type,
  () => {
    if (!element.value?.options) {
      element.value.options = []
    }
    if (!isQuestionHaveMultipleItems.value) {
      element.value.options = []
    } else {
      if (element.value?.options?.length === 0) {
        element.value.options.push({
          isCorrect: false,
          title: '',
          image: null,
          order: element.value.options.length,
        })
      }
    }
    if (element.value?.type == QuestionType.Matching) {
      element.value.matchingPairs = []
      element.value.matchingPairs.push({
        left: '',
        right: '',
      })
    }
    if (element.value?.type == QuestionType.Reorder) {
      element.value.orderItems = []
    }
    if (element.value?.type == QuestionType.Dialogue) {
      element.value.subQuestions = []
    }
  }
)

const knowledgeLevelStore = useKnowledgelevelStore()
const knowledgeLevels = computed(() => knowledgeLevelStore.knowledgelevels)

</script>

<template>
  <div class="grid grid-cols-2 gap-8 ">
    <div class="">
        <!-- <AppInputWithFile
          v-model:input="element.title"
          v-model:file="element.image"
          :disabled="isEvaluation"
          :label="$t('question-title')"
          type="textarea"
          class=""
        /> -->

        <AppTextAreaField
          v-model="element.title"
          :disabled="isEvaluation"
          :label="$t('question-title')"
          class="mx-2"
        />
        
      
      <!-- Alternate title section for main question -->
      <div class="mb-4 mt-2 ">
        <BaseCheckbox
          v-model="element.isAlternateTitleShown"
          :disabled="isEvaluation"
          :label="$t('show-alternate-title')"
          class="mb-2"
        />
        <AppInputField
          v-if="element.isAlternateTitleShown"
          v-model="element.alternateTitle"
          :disabled="isEvaluation"
          :label="$t('alternate-title')"
          :placeholder="$t('enter-alternate-title')"
          class="mx-2"
        />
      </div>


      <div class="w-full  p-2 gap-4 grid grid-cols-3">
        <AppAutoCompleteField
          v-model="element.type"
          :items="questionTypeOptions($t)"
          :placeholder="$t('select-a-question-type')"
          item-label="label"
          item-value="value"
          :id="`${element?.id}-type`"
          :key="`${element?.id}-type`"
          :disabled="isEvaluation"
        />
        <AppAutoCompleteField
          v-model="element.difficulty"
          :items="difficultyOptions($t)"
          :placeholder="$t('select-a-difficulty')"
          item-label="label"
          :key="`${element.id}-difficulty`"
          :disabled="isEvaluation"
          item-value="value"
        />
        <AppAutoCompleteField
          v-model="element.knowledgeLevelId"
          :placeholder="$t('select-a-knowledge')"
          :key="element.id"
          :disabled="isEvaluation"
          :items="knowledgeLevels"
          item-label="name"
          item-value="id"
        />
        <!-- <BaseTag
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
        </BaseTag> -->
        <!-- <BaseButtonIcon
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
        </BaseButtonIcon> -->
      </div>

      <AppFileField
        v-model:file="element.image"
      />

      

      
    </div>
    <div  class="question-form w-[100%] mt-3 flex flex-col gap-5 rounded-xl p-2 "
      :class="{
        'w-full': element.type === QuestionType.Article || element.type === QuestionType.Dialogue,
      }">
      <MultiItems
        v-if="isQuestionHaveMultipleItems"
        v-model="element"
        :is-evaluation="isEvaluation"
      />
      <BaseTextarea
        v-if="element.type === QuestionType.Article"
        v-model="element.correctText"
        :label="$t('answer')"
        :disabled="isEvaluation"
      />
      <BaseInput
        v-if="element.type === QuestionType.Blank"
        v-model="element.correctText"
        :label="$t('answer')"
        :disabled="isEvaluation"
      />
      <div v-if="element.type === QuestionType.TrueOrFalse" class="mt-5 flex flex-col gap-5">
        <p >
          <span class="font-bold"> {{$t('note')}} : </span>
          {{ $t('select-the-correct-answer') }}
        </p>
        <div class="flex items-center gap-5 mt-5">

          <BaseRadio
          v-model="element.correctBoolean"
          :label="$t('true')"
          :value="true"
          :disabled="isEvaluation"
          />
          <BaseRadio
          v-model="element.correctBoolean"
          :label="$t('false')"
          :value="false"
          :disabled="isEvaluation"
          />
        </div>
        <!-- <BaseListbox
                  v-model="element.correctBoolean"
                  :items="[true, false]"
                  :disabled="isEvaluation"
                  :label="$t('select-the-correct-answer')"
              /> -->
      </div>
      <Matching
        v-if="element?.type === QuestionType.Matching"
        v-model="element"
        :is-evaluation="isEvaluation"
      />
      <Reorder
        v-if="element?.type === QuestionType.Reorder"
        v-model="element"
        :is-evaluation="isEvaluation"
      />
      <Dialogue
        v-if="element?.type === QuestionType.Dialogue"
        v-model="element"
        :is-evaluation="isEvaluation"
      />

    </div>
  </div>
</template>
