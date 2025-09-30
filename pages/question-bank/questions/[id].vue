<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import draggable from 'vuedraggable'
import CardNoData from '~/components/app-table/components/CardNoData.vue'
import { useAppToaster } from '~/services/toaster/toaster'
import { useAuthStore } from '~/views/auth/store/auth'
import AddTopic from '~/views/question-bank/components/AddTopic.vue'
import DeleteTopic from '~/views/question-bank/components/DeleteTopic.vue'
import ImportQuestions from '~/views/question-bank/components/ImportQuestions.vue'
import QuestionCard from '~/views/question-bank/components/questions/form/QuestionCard.vue'
import { useQuestionBankStore } from '~/views/question-bank/store'
import type { QuestionBankTopicDto } from '~/views/question-bank/types'
import {
    AuditStatus,
    QuestionType,
    type Question,
} from '~/views/question-bank/types/question'
const { t } = useI18n()
const toaster = useAppToaster()

const showImportModal = ref(false)

definePageMeta({
  title: 'questions-editor',
  description: 'to-add-or-edit-questions',
})
const questionBankStore = useQuestionBankStore()
const route = useRoute()
const { hasPrivilege } = useAuthStore()

const questions = ref<Question[]>([])
const creationStartDate = ref<string | null>(null) // Start date for question creation
const creationEndDate = ref<string | null>(null) // End date for question creation
const isEditingAllowed = ref<boolean>(true) // Flag to check if editing is allowed

const filteredQuestions = computed({
  get() {
    return questions.value.filter((x: Question) => x.topicId === selectedTab.value)
  },
  set(value: Question[]) {
    questions.value = value
  },
})

const validateEditingRules = () => {
  if (hasPrivilege('ums:ems:question-bank:update')) {
    isEditingAllowed.value = true
    return
  }

  const now = new Date()

  if (creationStartDate.value && new Date(creationStartDate.value) > now) {
    isEditingAllowed.value = false
    useToast({
      message: t('you_cannot_update_questions_outside_the_allowed_time_window'),
      isError: true,
    })
    return
  }

  if (creationEndDate.value && new Date(creationEndDate.value) < now) {
    isEditingAllowed.value = false
    useToast({
      message: t('you_cannot_update_questions_outside_the_allowed_time_window'),
      isError: true,
    })
    return
  }

  isEditingAllowed.value = true
}

const addQuestion = () => {
  if (!isEditingAllowed.value) {
    useToast({
      message: t('you_cannot_add_questions_outside_the_allowed_time_window'),
      isError: true,
    })
    return
  }
  questions.value.push({
    type: null,
    title: '',
    correctBoolean: false,
    correctText: '',
    difficulty: null,
    knowledgeLevel: null,
    isContentShown: true,
    options: [],
    image: '',
    order: questions.value.length + 1,
    topicId: selectedTab.value,
    // generate a random guid
    clientId: generateGuid(),
  })
}
const dragOptions = {
  animation: 200,
  onEnd: (event: any) => {},
}

const removeQuestion = (clientId: string) => {
  questions.value = questions.value.filter((x) => x.clientId != clientId)
}
const fetchQuestionBank = async () => {
  await questionBankStore.getQuestionBank(route.params.id as string)
  questions.value =
    questionBankStore.selectedQuestionBank?.questions.map((x: Question) => {
      return {
        ...x,
        isContentShown: true,
        order: x.order,
        clientId: generateGuid(),
      }
    }) || []

    questions.value.forEach((x: Question) => {
      if (x.type === QuestionType.Dialogue) {
        x.subQuestions = x.subQuestions.map(( subQuestion: Question,index: number) => {
          return {
            ...subQuestion,
            order: index + 1,
            clientId: generateGuid(),
          }
        })
      }
    })
  topicTabs.value = questionBankStore.selectedQuestionBank?.questionBankTopics.map(
    (x: QuestionBankTopicDto) => {
      return { label: x.topic.name, value: x.topicId }
    }
  ) as { label: string; value: string }[]
  selectedTab.value = topicTabs.value[0].value

  // Fetch creationStartDate and creationEndDate from the Question Bank
  creationStartDate.value = questionBankStore.selectedQuestionBank?.creationStartDate || null
  creationEndDate.value = questionBankStore.selectedQuestionBank?.creationEndDate || null

  validateEditingRules()
}
const topicTabs = ref<{ label: string; value: string }[]>([])
const selectedTab = ref<string>('')
// watchDeep(
//     () => questionBankStore.selectedQuestionBank,
//     () => {
//         fetchQuestionBank()
//     },
// )
onMounted(() => {
  fetchQuestionBank()
})
const saveChanges = async () => {
  if (!isEditingAllowed.value) {
    useToast({
      message: t('you_cannot_save_changes_outside_the_allowed_time_window'),
      isError: true,
    })
    return
  }
  if (!validateQuestions()) {
    return
  }

  questionBankStore.saveQuestions(route.params.id as string, questions.value)
}

const updateQuestion = (updatedQuestion: Question) => {
  if (!isEditingAllowed.value) {
    useToast({
      message: t('you_cannot_update_questions_outside_the_allowed_time_window'),
      isError: true,
    })
    return
  }

  const index = questions.value.findIndex((x: Question) => x.clientId === updatedQuestion.clientId)
  questions.value[index] = updatedQuestion
}

const removeTopic = (topic: QuestionBankTopicDto) => {
  questionBankStore.selectedTopic = topic
  questionBankStore.isDeleteTopicOpen = true
}
const validateQuestions = (): boolean => {
  const missingFields = questions.value.filter((question: Question) => {
    return !question.type || !question.difficulty || !question.knowledgeLevelId
  })
  if (missingFields.length > 0) {
    toaster.show('danger', t('please-fill-in-the-required-fields'))
    return false
  }
  return true
}
const currentTopicName = computed(() => {
  return (
    questionBankStore.selectedQuestionBank?.questionBankTopics.find(
      (topic) => topic.topicId === selectedTab.value
    )?.topic?.name || ''
  )
})
</script>
<template>
  <div v-if="!questionBankStore.isLoading" class="min-h-screen mb-30">
    <div class="rounded-lg bg-white p-5">
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center fonte-bold text-3xl">
            <p class="font-bold text-primary-500">
              {{ questionBankStore.selectedQuestionBank?.title || 'Questions' }}
            </p>

            <p class="ms-2 text-2xl text-muted-500">
              {{ $t('exam-question-form') }}
            </p>
        </div>
          <p class="text-gray mt-1 text-xs">
            {{
              $t(
                'it-is-a-special-form-to-enter-the-exam-questions-to-be-summoned-in-the-exam-department'
              )
            }}
          </p>
          <p v-if="!isEditingAllowed && creationStartDate" class="text-gray mt-1 text-xs">
            {{ $t('creation-start-date') + ': ' + (creationStartDate ?? '').split('T')[0] }}
          </p>
          <p v-if="!isEditingAllowed && creationEndDate" class="text-gray mt-1 text-xs">
            {{ $t('creation-end-date') + ': ' + (creationEndDate ?? '').split('T')[0] }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <BaseButton
            size="lg"
            color="primary"
            :disabled="!isEditingAllowed"
            @click="questionBankStore.importDialogOpen = true"
            v-if="hasPrivilege('ums:ems:question-bank:bulk-radio-upload')"
          >
            <Icon name="tabler-file-upload" size="20" />
            {{ $t('import-questions') }}
          </BaseButton>
          <BaseButton color="primary" size="lg" @click="saveChanges" v-if="hasPrivilege('ums:ems:question:bulk-create')">
            <Icon name="tabler-file-check" size="20" />
            {{ $t('save-changes') }}
          </BaseButton>
        </div>
      </div>

      <div class="mt-2 flex items-center gap-2">
        <div
          v-for="tab in questionBankStore.selectedQuestionBank?.questionBankTopics"
          :key="tab.topicId"
          class="flex items-center gap-2"
        >
          <div
            class="transition-all-500 flex cursor-pointer pb-2 text-center"
            :class="{
              'border-b-4 border-primary-500 font-bold': selectedTab == tab.topicId,
            }"
            @click="selectedTab = tab.topicId"
          >
            {{ tab.topic!.name }}
          </div>
          <Icon
            name="material-symbols:close-rounded"
            class="text-red size-5 cursor-pointer"
            @click="removeTopic(tab)"
          />

          <div class="w-[1px] bg-gray h-8" />
        </div>
        <BaseButton
          :disabled="!isEditingAllowed"
          color="primary"
          variant="pastel"
          @click="questionBankStore.isAddTopicOpen = true"
        >
          <Icon name="ph:plus-circle-fill" class="me-1 size-8" />
          {{ $t('add') }}
        </BaseButton>
      </div>
    </div>
    <hr class="my-5" >
    <draggable
      v-model="filteredQuestions"
      item-key="order"
      class="my-5 px-10"
      :options="dragOptions"
      target=".drag-handle"
    >
      <template #item="data">
        <div>
          <QuestionCard
            :is-evaluation="data.element.auditStatus == AuditStatus.Approved"
            :only-view="data.element.auditStatus == AuditStatus.Approved"
            :model-value="questions.find((x) => x.clientId === data.element.clientId)"
            :index="data.index"
            :topic-name="currentTopicName"
            @remove-question="removeQuestion(data.element.clientId)"
            @update:model-value="(updatedQuestion: Question) => updateQuestion(updatedQuestion)"
          />
        </div>
      </template>
    </draggable>
    <CardNoData v-if="questions.length === 0" />
    <div class="w-[75%] start-75 fixed bottom-5">
      <BaseButton class="w-full" color="primary" size="lg"  @click="addQuestion">
        <Icon name="tabler-plus" size="20" />
        {{ $t('add-questions') }}
      </BaseButton>
    </div>
  </div>
  <AppLoading v-else />
  <DeleteTopic @update="fetchQuestionBank()" />
  <AddTopic @update="fetchQuestionBank()" :subject-id="questionBankStore.selectedQuestionBank?.subject.id" />
  <ImportQuestions
    :question-bank-id="route.params.id as string"
    :topic-id="selectedTab"
    :is-editing-allowed="isEditingAllowed"
    @questions-imported="fetchQuestionBank"
  />
</template>

<style lang="scss"></style>
