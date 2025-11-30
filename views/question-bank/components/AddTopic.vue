<script setup lang="ts">
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { useQuestionBankStore } from '~/views/question-bank/store/index'
import { useSubjectStore } from '~/views/subjects/store'
import { useTopicStore } from '~/views/topics/store'
import type { QuestionBankTopicUpdate } from '../types'
import { useAuthStore } from '~/views/auth/store/auth'

const questionBankStore = useQuestionBankStore()
const subjectStore = useSubjectStore()
const topicsStore = useTopicStore()
const { hasPrivilege } = useAuthStore()
if (hasPrivilege('ums:ems:question:bulk-create')){
  subjectStore.getSubjects()
}
const subjectId = computed(() => props.subjectId)
const emit = defineEmits(['update'])
const route = useRoute()
const { id } = route.params
const props = defineProps<{
  subjectId: string
}>()
const body = ref<QuestionBankTopicUpdate>({
  topicId: '',
})
const addTopic = () => {
  questionBankStore.addTopic(id as string, body.value)
  questionBankStore.isAddTopicOpen = false
  emit('update')
}
watch(subjectId, (value: string) => {
  if (value) {
    if (hasPrivilege('ums:ems:question:bulk-create')){
      topicsStore.getTopics({ subjectId: value, pageNumber: 1, pageSize: 500 })
    }
  }
})
const topics = computed(() => topicsStore.topics)
watch(
  () => questionBankStore.isAddTopicOpen,
  () => {
    body.value.topicId = ''
  }
)
</script>
<template>
  <AppDialog
    v-model="questionBankStore.isAddTopicOpen"
    :title="$t('add-topic')"
    size="lg"
    overflow-y="visible"
    :loading="questionBankStore.isLoading"
  >
    <!-- <AppAutoCompleteField
      v-model="subjectId"
      fetch-on-search
      search-key="name"
      :label="$t('select-subject')"
      :items="subjectStore.subjects"
      item-label="name"
      item-value="id"
      class="col-span-2"
    /> -->
    <AppAutoCompleteField
      v-model="body.topicId"
      fetch-on-search
      search-key="name"
      :label="$t('select-topics')"
      :items="topics"
      item-label="name"
      item-value="id"
      class="col-span-2"
    />

    <BaseButton color="primary" class="mt-5 w-full gap-1" @click="addTopic">
      <Icon name="ph:upload-simple-duotone" class="size-5" />
      {{ $t('save') }}
    </BaseButton>
  </AppDialog>
</template>
