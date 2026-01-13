<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'
import { Validator } from '~/services/validator'
import { requiredValidator } from '~/services/validation'
import { useTopicStore } from '../store'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { UserRoles } from '~/utils/constants/enum'
import type { Topic, TopicCreateDto } from '../types'

const topicStore = useTopicStore()

const selectedTopic = computed(() => topicStore.selectedTopic)
const validator = new Validator<TopicCreateDto>(
  {
    name: selectedTopic.value?.name as string,
    subjectId: selectedTopic.value?.subjectId as string,
  },
  {
    name: {
      required: requiredValidator('Topic name'),
    },
    subjectId: {
      required: requiredValidator('Subject'),
    },
  }
)

const body = validator.validation

const isLoading = computed(() => {
  return topicStore.isLoading
})

const updateTopic = async () => {
  const isValid = await body.value.$validate()
  if (!isValid) return
  await topicStore.updateTopic(validator.extractBody())
  validator.resetBody()
  topicStore.isEditDialogOpen = false
}

watch(
  () => topicStore.isEditDialogOpen,
  (value) => {
    if (!value) {
      validator.resetBody()
    } else {
      validator.fillBody({
        name: selectedTopic.value?.name as string,
        subjectId: selectedTopic.value?.subjectId as string,
      })
    }
  }
)
</script>
<template>
  <AppDialog
    v-model="topicStore.isEditDialogOpen"
    :title="$t('edit-topic')"
    size="xl"
    overflow-y="visible"
  >
    <div class="rounded-3xl p-3">
      <div class="flex flex-col gap-4">
        <AppInputField
          v-model="body.name.$model"
          :errors="body.name.$errors"
          size="md"
          :label="$t('topic-name')"
        />
        <AppAutoCompleteField
          v-model="body.subjectId.$model"
          fetch-on-search
          search-key="name"
          :errors="body.subjectId.$errors"
          size="md"
          :label="$t('subject')"
          get-url="/subjects"
          item-label="name"
          item-value="id"
        />
      </div>
    </div>
    <template #actions>
      <BaseButton color="primary" class="gap-1" :loading="isLoading" @click="updateTopic">
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        {{ $t('save-changes') }}
      </BaseButton>
    </template>
  </AppDialog>
</template>
