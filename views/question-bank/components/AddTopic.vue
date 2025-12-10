<script setup lang="ts">
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { useQuestionBankStore } from '~/views/question-bank/store/index'
import { useTopicStore } from '~/views/topics/store'
const questionBankStore = useQuestionBankStore()
const topicsStore = useTopicStore()

const subjectId = computed(() => props.subjectId)
const emit = defineEmits(['update'])
const route = useRoute()
const { id } = route.params
const props = defineProps<{
  subjectId: string
}>()
const body = ref<{topicId: string}>({
  topicId: '',
})
const addTopic = () => {
  questionBankStore.addTopic(id as string, body.value.topicId)
  questionBankStore.isAddTopicOpen = false
  emit('update')
}
watch(subjectId, (value: string) => {
  if (value) {
    topicsStore.getTopics({ subjectId: value, pageNumber: 1, pageSize: 500 })
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
    <AppAutoCompleteField
      v-model="body.topicId"
      fetch-on-search
      search-key="search"
      :label="$t('select-topics')"
      :items="topics"
      item-label="titleAr"
      item-subtitle="titleEn"
      item-value="id"
      class="col-span-2"
    />

    <BaseButton color="primary" class="mt-5 w-full gap-1" @click="addTopic">
      <Icon name="ph:upload-simple-duotone" class="size-5" />
      {{ $t('save') }}
    </BaseButton>
  </AppDialog>
</template>
