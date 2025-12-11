<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import QuestionCard from '~/components/question-bank/QuestionCard.vue'
import AddTopic from '~/views/question-bank/components/AddTopic.vue'
import { useQuestionBankStore } from '~/views/question-bank/store'
import type { QuestionBankDto } from '~/views/question-bank/types'
import { QuestionForm } from '~/views/questions/components/form'
import { useQuestionStore } from '~/views/questions/store'
import type { QuestionDto } from '~/views/questions/types'
import type { QuestionRequest } from '~/views/questions/types/request'
import { useTopicStore } from '~/views/topics/store'
import ImportQuestions from '~/views/questions/components/ImportQuestions.vue'
definePageMeta({
  title: 'questions',
  description: 'questions-description',
})

const route = useRoute()
const { t } = useI18n()

const questionBankId = route.params.id as string
const questionBank = ref<QuestionBankDto | null>(null)
const questionBankStore = useQuestionBankStore()
const questionStore = useQuestionStore()
const topicStore = useTopicStore()

// View mode: 'list' | 'create' | 'edit'
const viewMode = ref<'list' | 'create' | 'edit'>('list')
const editingQuestion = ref<QuestionDto | null>(null)

// Delete dialog state
const isDeleteDialogOpen = ref(false)
const deletingQuestionId = ref<string | null>(null)

// Get questions for a topic
const getQuestions = async (topicId: string) => {
  await questionStore.getQuestions({
    questionBankId: questionBankId,
    topicId: topicId,
  })
}

// Load initial data
onMounted(async () => {
  questionBank.value = await questionBankStore.getById(questionBankId)
  selectedTab.value = questionBank.value?.topics?.[0]?.id ?? null

  // Load topics for the subject
  if (questionBank.value?.subjectId) {
    await topicStore.getTopics({
      subjectId: questionBank.value.subjectId,
      Page: 1,
      PageSize: 500,
      Search: '',
      name: null,
    })
  }
})

const selectedTab = ref<string | null>(null)

// Remove topic from question bank
const removeTopic = async (topicId: string) => {
  await questionBankStore.removeTopic(questionBankId, topicId)
  questionBank.value = await questionBankStore.getById(questionBankId)
}

// Watch tab changes to load questions
watch(selectedTab, (value: string | null) => {
  if (value) {
    getQuestions(value)
  }
})

// Switch to create mode
const showCreateForm = () => {
  editingQuestion.value = null
  viewMode.value = 'create'
}

// Switch to edit mode
const showEditForm = async (question: QuestionDto) => {
  try {
    // Fetch full question details by ID
    const fullQuestion = await questionStore.getQuestionById(question.id)
    editingQuestion.value = fullQuestion
    viewMode.value = 'edit'
  } catch (error) {
    // Error is already handled by the store
    console.error('Failed to fetch question details:', error)
  }
}

// Go back to list
const showList = () => {
  viewMode.value = 'list'
  editingQuestion.value = null
}

// Handle form submission
const handleFormSubmit = async (data: QuestionRequest) => {
  try {
    // Ensure questionBankId is set
    data.questionBankId = questionBankId

    if (viewMode.value === 'edit' && editingQuestion.value) {
      questionStore.selectedQuestionId = editingQuestion.value.id
      await questionStore.updateQuestion(data)
    } else {
      await questionStore.createQuestion(data)
    }

    // Go back to list and refresh
    showList()
    if (selectedTab.value) {
      await getQuestions(selectedTab.value)
    }
  } catch (error) {
    // Error handling
  }
}

// Handle form cancel
const handleFormCancel = () => {
  showList()
}

// Open delete confirmation
const openDeleteDialog = (questionId: string) => {
  deletingQuestionId.value = questionId
  isDeleteDialogOpen.value = true
}

// Confirm delete question
const confirmDelete = async () => {
  if (!deletingQuestionId.value) return

  try {
    await questionStore.deleteQuestion(deletingQuestionId.value)
    isDeleteDialogOpen.value = false
    deletingQuestionId.value = null

    // Refresh questions list
    if (selectedTab.value) {
      await getQuestions(selectedTab.value)
    }
  } catch (error) {
    // Error handling
  }
}
const importQuestions = () => {
  questionBankStore.importDialogOpen = true
}
// Check if in form mode
const isFormMode = computed(() => viewMode.value === 'create' || viewMode.value === 'edit')
</script>

<template>
  <div v-if="!questionBankStore.isLoading" class="min-h-screen pb-30">
    <!-- Header Section -->
    <div class="rounded-xl bg-white p-6 shadow-sm dark:bg-muted-800">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <!-- Back Button (when in form mode) -->
          <button
            v-if="isFormMode"
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-muted-100 text-muted-600 transition-colors hover:bg-muted-200 dark:bg-muted-700 dark:text-muted-300 dark:hover:bg-muted-600"
            @click="showList"
          >
            <Icon name="ph:arrow-left" class="size-5" />
          </button>

          <div>
            <div class="flex items-center text-3xl">
              <p class="font-bold text-primary-500">
                {{ questionBank?.title || 'Questions' }}
              </p>
              <p class="ms-2 text-2xl text-muted-500">
                {{ isFormMode ? (viewMode === 'edit' ? $t('edit-question') : $t('create-question')) : $t('exam-question-form') }}
              </p>
            </div>
            <p class="mt-1 text-xs text-muted-400">
              {{ isFormMode
                ? $t('fill-in-question-details')
                : $t('it-is-a-special-form-to-enter-the-exam-questions-to-be-summoned-in-the-exam-department')
              }}
            </p>
          </div>
        </div>

        <div v-if="!isFormMode" class="flex items-center gap-2">
          <BaseButton
          @click="importQuestions"
          size="lg" color="primary" variant="pastel">
            <Icon name="tabler-file-upload" class="me-2 size-5" />
            {{ $t('import-questions') }}
          </BaseButton>
          <BaseButton color="primary" size="lg" @click="showCreateForm">
            <Icon name="ph:plus-circle" class="me-2 size-5" />
            {{ $t('add-question') }}
          </BaseButton>
        </div>
      </div>

      <!-- Topics Tabs (only show in list mode) -->
      <div v-if="!isFormMode" class="mt-4 flex items-center gap-2 overflow-x-auto pb-2">
        <div
          v-for="tab in questionBank?.topics"
          :key="tab.id"
          class="flex shrink-0 items-center gap-2"
        >
          <button
            class="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300"
            :class="{
              'bg-primary-500 text-white shadow-lg shadow-primary-500/30': selectedTab === tab.id,
              'bg-muted-100 text-muted-600 hover:bg-muted-200 dark:bg-muted-700 dark:text-muted-300': selectedTab !== tab.id,
            }"
            @click="selectedTab = tab.id"
          >
            {{ tab.titleAr }}
          </button>
          <button
            class="flex h-6 w-6 items-center justify-center rounded-full text-danger-500 transition-colors hover:bg-danger-100 dark:hover:bg-danger-500/20"
            @click="removeTopic(tab.id)"
          >
            <Icon name="ph:x" class="size-4" />
          </button>
          <div class="h-6 w-px bg-muted-200 dark:bg-muted-700" />
        </div>
        <BaseButton
          color="primary"
          variant="pastel"
          size="sm"
          @click="questionBankStore.isAddTopicOpen = true"
        >
          <Icon name="ph:plus-circle" class="me-1 size-5" />
          {{ $t('add-topic') }}
        </BaseButton>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="mt-6">
      <!-- Question Form (Create/Edit Mode) -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
        mode="out-in"
      >
        <div
          v-if="isFormMode"
          class="rounded-2xl bg-white p-6 shadow-sm dark:bg-muted-800"
        >
          <QuestionForm
            :question-bank-id="questionBankId"
            :topic-id="selectedTab ?? undefined"
            :edit-data="editingQuestion"
            :is-loading="questionStore.isLoading"
            @submit="handleFormSubmit"
            @cancel="handleFormCancel"
          />
        </div>

        <!-- Questions List (List Mode) -->
        <div v-else>
          <!-- Loading State -->
          <div v-if="questionStore.isLoading" class="flex items-center justify-center py-20">
            <div class="text-center">
              <Icon name="ph:spinner" class="size-12 animate-spin text-primary-500" />
              <p class="mt-2 text-muted-500">{{ $t('loading') }}</p>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="questionStore.questions.length === 0"
            class="flex flex-col items-center justify-center rounded-xl bg-white py-20 dark:bg-muted-800"
          >
            <Icon name="ph:files" class="size-20 text-muted-300" />
            <h3 class="mt-4 text-lg font-semibold text-muted-700 dark:text-muted-200">
              {{ $t('no-data-found') }}
            </h3>
            <p class="mt-1 text-sm text-muted-400">
              {{ $t('start-by-adding-your-first-question') }}
            </p>
            <BaseButton color="primary" class="mt-4" @click="showCreateForm">
              <Icon name="ph:plus-circle" class="me-2 size-5" />
              {{ $t('add-question') }}
            </BaseButton>
          </div>

          <!-- Questions Grid -->
          <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <QuestionCard
              v-for="question in questionStore.questions"
              :key="question.id"
              :question="question"
              @edit="showEditForm"
              @delete="openDeleteDialog"
            />
          </div>
        </div>
      </Transition>
    </div>

    <!-- Delete Confirmation Dialog -->
    <TairoModal
      :open="isDeleteDialogOpen"
      size="sm"
      class="pa-5"
      @close="isDeleteDialogOpen = false"
    >
      <template #header>
        <div class="flex items-center gap-3 pa-4">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-danger-500/10">
            <Icon name="ph:trash" class="size-5 text-danger-500" />
          </div>
          <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
            {{ $t('delete') }}
          </h3>
        </div>
      </template>

      <div class="p-6">
        <p class="text-muted-600 text-start dark:text-muted-300">
          {{ $t('delete-confirmation') }}
        </p>

        <div class="mt-6 flex justify-end gap-3">
          <BaseButton
            color="muted"
            variant="pastel"
            @click="isDeleteDialogOpen = false"
          >
            {{ $t('cancel') }}
          </BaseButton>
          <BaseButton
            color="danger"
            :loading="questionStore.isLoading"
            @click="confirmDelete"
          >
            <Icon name="ph:trash" class="me-2 size-5" />
            {{ $t('delete') }}
          </BaseButton>
        </div>
      </div>
    </TairoModal>

    <!-- Add Topic Dialog -->
    <AddTopic
      :subject-id="questionBank?.subjectId as string"
      @update="getQuestions"
    />
  </div>

  <!-- Page Loading State -->
  <div v-else class="flex min-h-screen items-center justify-center">
    <div class="text-center">
      <Icon name="ph:spinner" class="size-16 animate-spin text-primary-500" />
      <p class="mt-4 text-muted-500">{{ $t('loading') }}</p>
    </div>
  </div>

  <ImportQuestions
    :question-bank-id="questionBankId"
    :topic-id="selectedTab ?? undefined"
    @close="questionBankStore.importDialogOpen = false"
  />
</template>
