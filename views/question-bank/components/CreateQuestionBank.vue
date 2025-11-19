<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'

import { useI18n } from 'vue-i18n'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { createValidator } from '~/services/validationWithI18n'
import { Validator } from '~/services/validator'
import { useSubjectStore } from '~/views/subjects/store'
import { useTopicStore } from '~/views/topics/store'
import type { TopicDto } from '~/views/topics/types'
import { useQuestionBankStore } from '../store/index'
import type { QuestionBankCreateDto } from '../types'

const questionBankStore = useQuestionBankStore()
const subjectStore = useSubjectStore()
const topicsStore = useTopicStore()
const { t } = useI18n()
subjectStore.getSubjects()

const validator = new Validator<QuestionBankCreateDto>(
  {
    title: '',
    topicIds: [],
    creationEndDate: null as string | null,
    creationStartDate: null as string | null,
    categories: null as string[] | null,
  },
  {
    title: {
      required: createValidator(t, 'title', 'required'),
    },
    topicIds: {
      required: createValidator(t, 'select-topics', 'required'),
    },
  }
)
const body = validator.validation

// Separate validation for subject since it's not part of the QuestionBankCreateDto
const subjectValidator = new Validator(
  {
    subjectId: null as string | null,
  },
  {
    subjectId: {
      required: createValidator(t, 'select-subject', 'required'),
    },
  }
)
const subjectValidation = subjectValidator.validation

watch(() => subjectValidation.value.subjectId.$model, (value: string | null) => {
  if (value) {
    topicsStore.getTopics({ 
      subjectId: value,
      pageNumber: 1,
      pageSize: 500
    })
  }
})

const topics = computed(() => topicsStore.topics)

const isLoading = computed({
    get: () => {
        return subjectStore.isLoading || questionBankStore.isLoading
    },
    set: (value: boolean) => {
        questionBankStore.isLoading = value
    }
})

const createQuestionBank = async () => {
  if(isLoading.value) return
  const isSubjectValid = await subjectValidation.value.$validate()
  const isBodyValid = await body.value.$validate()
  
  if (!isSubjectValid || !isBodyValid) return
  
  await questionBankStore.createQuestionBank(validator.extractBody())
  validator.resetBody()
  subjectValidator.resetBody()
  questionBankStore.isCreateDialogOpen = false
}
watch(
  () => questionBankStore.isCreateDialogOpen,
  async (val: boolean) => {
    if (val) {
     await subjectValidator.resetBody()

     await validator.resetBody()
    //   body.value.topicIds.$model = []
    //   body.value.topicIds.$errors = []
    //   body.value.categories.$model = []
    //   body.value.categories.$errors = []
    }
  }
)
</script>
<template>
  <AppDialog
    v-model="questionBankStore.isCreateDialogOpen"
    :title="$t('create-question-bank')"
    size="2xl"
    overflow-y="visible"
  >
    <div class="rounded-3xl p-3">
      <div class="grid gap-3 md:grid-cols-1">
        <AppInputField
          v-model="body.title.$model"
          :errors="body.title.$errors"
          :label="$t('title')"
          class="col-span-2"
        />
        <AppAutoCompleteField
          v-model="subjectValidation.subjectId.$model"
          fetch-on-search
          search-key="name"
          :label="$t('select-subject')"
          :items="subjectStore.subjects"
          :errors="subjectValidation.subjectId.$errors"
          item-label="name"
          item-value="id"
          class="col-span-2"
        />
        <AppAutoCompleteField
          v-model="body.topicIds.$model"
          fetch-on-search
          search-key="name"
          multiple
          :label="$t('select-topics')"
          :items="topics"
          :errors="body.topicIds.$errors"
          item-label="name"
          item-value="id"
          class="col-span-2"
        />
        <AppAutoCompleteField
          v-model="body.categories.$model"
          fetch-on-search
          search-key="name"
          :label="$t('select-categories')"
          get-url="/category/lookup"
          without-data
          multiple
          item-label="title"
          item-value="id"
          class="col-span-2"
        />
      </div>
      <h1>
        {{ $t('fill-creation-period-dates-optional') }}
      </h1>
      <div class="my-1 grid gap-3 md:grid-cols-2">
        <AppFieldAppInputField
          v-model="body.creationStartDate.$model"
          :errors="body.creationStartDate.$errors"
          :label="$t('start-date-creation-qustion-bank')"
          :placeholder="$t('enter-start-date')"
          type="date"
        />
        <AppFieldAppInputField
          v-model="body.creationEndDate.$model"
          :errors="body.creationEndDate.$errors"
          :label="$t('end-date')"
          :placeholder="$t('enter-end-date')"
          type="date"
        />
      </div>
      <BaseButton
        color="primary"
        :disabled="isLoading"
        :loading="isLoading"
        class="mt-5 w-full gap-1"
        @click="createQuestionBank"
      >
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        {{ $t('save-change') }}
      </BaseButton>
    </div>
  </AppDialog>
</template>
