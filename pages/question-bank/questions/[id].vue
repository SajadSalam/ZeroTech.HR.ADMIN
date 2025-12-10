<script lang="ts" setup>
import AddTopic from '~/views/question-bank/components/AddTopic.vue'
definePageMeta({
    title: 'questions',
    description: 'questions-description',
})
import { useQuestionBankStore } from '~/views/question-bank/store'
import type { QuestionBankDto } from '~/views/question-bank/types'
import { useQuestionStore } from '~/views/questions/store'
const route = useRoute()
const questionBankId = route.params.id as string
const questionBank = ref<QuestionBankDto | null>(null)
const questionBankStore = useQuestionBankStore()
const questionStore = useQuestionStore()

const getQuestions = async (topicId: string) => {
    await questionStore.getQuestions({
        questionBankId: questionBankId as string,
        topicId: topicId,
    })
}
onMounted(async () => {
    questionBank.value = await questionBankStore.getById(questionBankId as string)
    selectedTab.value = questionBank.value?.topics?.[0]?.id
})

const selectedTab = ref<string | null>(null)
const removeTopic = async (topicId: string) => {
    await questionBankStore.removeTopic(questionBankId, topicId)
    questionBank.value = await questionBankStore.getById(questionBankId as string)
}
watch(selectedTab, (value: string | null) => {
    if (value) {
        getQuestions(value)
    }
})
</script>

<template>
 <div v-if="!questionBankStore.isLoading" class="min-h-screen mb-30">
    <div class="rounded-lg bg-white p-5">
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center fonte-bold text-3xl">
            <p class="font-bold text-primary-500">
              {{ questionBank?.title || 'Questions' }}
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
        </div>
        <div class="flex items-center gap-2">
          <BaseButton
            size="lg"
            color="primary"
          >
            <Icon name="tabler-file-upload" size="20" />
            {{ $t('import-questions') }}
          </BaseButton>
          <BaseButton color="primary" size="lg">
            <Icon name="tabler-file-check" size="20" />
            {{ $t('save-changes') }}
          </BaseButton>
        </div>
      </div>

      <div class="mt-2 flex items-center gap-2">
        <div
          v-for="tab in questionBank?.topics"
          :key="tab.id"
          class="flex items-center gap-2"
        >
          <div
            class="transition-all-500 flex cursor-pointer  text-center"
            :class="{
              'border-b-4 border-primary-500 font-bold': selectedTab == tab.id,
            }"
            @click="selectedTab = tab.id"
          >
            {{ tab.titleAr }}
          </div>
          <Icon
            name="material-symbols:close-rounded"
            class="text-red size-5 cursor-pointer"
            @click="removeTopic(tab.id)"
          />

          <div class="w-[1px] bg-gray h-8" />
        </div>
        <BaseButton
          color="primary"
          variant="pastel"
          @click="questionBankStore.isAddTopicOpen = true"
        >
          <Icon name="ph:plus-circle-fill" class="me-1 size-8" />
          {{ $t('add-topic') }}
        </BaseButton>
      </div>
    </div>
    <hr class="my-5" >
    </div>
    <AddTopic :subject-id="questionBank?.subjectId as string" @update="getQuestions" />
</template>