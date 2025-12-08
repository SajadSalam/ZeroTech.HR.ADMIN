<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'

import { useI18n } from 'vue-i18n'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { createValidator } from '~/services/validationWithI18n'
import { Validator } from '~/services/validator'
import { useSubjectStore } from '~/views/subjects/store'
import { useTopicStore } from '~/views/topics/store'
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
    subjectId: '' as string,
    topicIds: [],
    startEditingDatetimeUtc: null,
    endEditingDatetimeUtc: null,
  },
  {
    title: {
      required: createValidator(t, 'title', 'required'),
    },
    subjectId: {
      required: createValidator(t, 'select-subject', 'required'),
    },
    topicIds: {
      required: createValidator(t, 'select-topics', 'required'),
    },
  }
)
const body = validator.validation

watch<string | null>(() => body.value.subjectId.$model as string | null, (value) => {
  if (value) {
    topicsStore.getTopics({ 
      subjectId: value,
      Page: 1,
      PageSize: 500,
      Search: '',
      name: null,
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
  const isBodyValid = await body.value.$validate()
  if (!isBodyValid) return
  await questionBankStore.createQuestionBank(validator.extractBody())
  validator.resetBody()
  questionBankStore.isCreateDialogOpen = false
}
watch(
  () => questionBankStore.isCreateDialogOpen,
  async (val: boolean) => {
    if (val) {
     await validator.resetBody()
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
          v-model="body.subjectId.$model"
          fetch-on-search
          search-key="search"
          :label="$t('select-subject')"
          :items="subjectStore.subjects"
          :errors="body.subjectId.$errors"
          item-label="titleAr"
          item-subtitle="titleEn"
          item-value="id"
          class="col-span-2"
        />
        <AppAutoCompleteField
          v-model="body.topicIds.$model"
          fetch-on-search
          search-key="search"
          multiple
          :label="$t('select-topics')"
          :items="topics"
          :errors="body.topicIds.$errors"
          item-label="titleAr"
          item-subtitle="titleEn"
          item-value="id"
          class="col-span-2"
        />
      </div>
      <h1>
        {{ $t('fill-creation-period-dates-optional') }}
      </h1>
      <div class="my-1 grid gap-3 md:grid-cols-2">
        <AppFieldAppInputField
          v-model="body.startEditingDatetimeUtc.$model"
          :errors="body.startEditingDatetimeUtc.$errors"
          :label="$t('start-date-creation-qustion-bank')"
          :placeholder="$t('enter-start-date')"
          type="date"
        />
        <AppFieldAppInputField
          v-model="body.endEditingDatetimeUtc.$model"
          :errors="body.endEditingDatetimeUtc.$errors"
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
