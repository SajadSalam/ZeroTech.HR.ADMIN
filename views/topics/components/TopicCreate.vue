<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'
import { Validator } from '~/services/validator'
import { createValidator } from '~/services/validationWithI18n'
import { useTopicStore } from '../store'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { UserRoles } from '~/utils/constants/enum'
import type { Topic, TopicCreateDto } from '../types'
import { useI18n } from 'vue-i18n'

const topicStore = useTopicStore()
const { t } = useI18n()

const validator = new Validator<TopicCreateDto>(
  {
    titleAr: '',
    titleEn: '',
    subjectId: '',
  },
  {
    titleAr: {
      required: createValidator(t, 'topic-name', 'required'),
    },
  }
)

const body = validator.validation

const isLoading = computed(() => {
  return topicStore.isLoading
})

const createTopic = async () => {
  const isValid = await body.value.$validate()

  if (!isValid) return
  await topicStore.createTopic(validator.extractBody())
  validator.resetBody()
  topicStore.isCreateDialogOpen = false
}
watch(
  () => topicStore.isCreateDialogOpen,
  (val: boolean) => {
    if (val) {
      validator.resetBody()
    }
  }
)
</script>
<template>
  <AppDialog
    v-model="topicStore.isCreateDialogOpen"
    :title="$t('create-topic')"
    size="md"
    overflow-y="visible"
  >
    <div class="rounded-3xl p-3">
      <div class="flex flex-col gap-4">
        <AppInputField
          v-model="body.titleAr.$model"
          :errors="body.titleAr.$errors"
          size="md"
          :label="$t('topic-name')"
        />
        <AppInputField
          v-model="body.titleEn.$model"
          :errors="body.titleEn.$errors"
          size="md"
          :label="$t('topic-name-en')"
        />
        <AppAutoCompleteField
          v-model="body.subjectId.$model"
          fetch-on-search
          search-key="name"
          :errors="body.subjectId.$errors"
          size="md"
          :label="$t('subject')"
          get-url="/subjects/lookup"
          without-data
          item-label="title"
          item-value="id"
        />
      </div>
    </div>
    <template #actions>
      <BaseButton color="primary" class="gap-1" :loading="isLoading" @click="createTopic">
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        {{ $t('create-new-topic') }}
      </BaseButton>
    </template>
  </AppDialog>
</template>
