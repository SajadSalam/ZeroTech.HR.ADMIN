<script lang="ts" setup>
import ReplaceQuestion from '~/views/exams/components/ReplaceQuestion.vue'
import { useExamStore } from '~/views/exams/store'
import type { ExamDetailed } from '~/views/exams/types'
import QuestionCard from '~/views/question-bank/components/questions/view/QuestionCard.vue'
import type { QuestionDto } from '~/views/questions/types'

definePageMeta({
    title: 'exam-view',
    description: 'to-view-exam-like-student',
})

const examStore = useExamStore()
const route = useRoute()
const examId = computed(() => route.params.id)
const exam = ref<ExamDetailed | null>(null)
const questions = ref<QuestionDto[]>([])
const isEvaluation = ref(true)
const activeTab = ref(null)

const getExam = async () => {
    exam.value = (await examStore.getById(examId.value.toString())) as ExamDetailed
    questions.value = exam.value.questions.map((question: QuestionDto) => {
        return {
            ...question,
            isContentShown: true,
        }
    })
    activeTab.value = exam.value?.availableDates?.[0]?.date
    getQuestions()
}
const getQuestions = async () => {
    questions.value = await examStore.getQuestions(examId.value, activeTab.value)
}

const reshuffleQuestions = async () => {
    await examStore.reshuffleQuestions(examId.value, activeTab.value)
    getQuestions()
}

onMounted(() => {
    getExam()
    
})
const openReplaceDialog = (question: QuestionDto) => {
    examStore.questionId = question.id
    examStore.isQuestionReplaceDialogOpen = true
}

watchDeep(activeTab, () => {
    getQuestions()
})

</script>

<template>
    <div>
        <div v-if="exam != null">
            <div class="flex items-center justify-between rounded-lg bg-white p-5">
                <div>
                    <h1 class="fonte-bold text-3xl">
                        <span class="font-bold text-primary-500">
                            {{ exam.title }}
                        </span>

                        <span class="ms-2 text-2xl text-muted-500">
                            {{ $t('exam-question-form') }}
                        </span>
                    </h1>
                    <p class="text-gray mt-1 text-xs">
                        {{
                            $t(
                                'it-is-a-special-form-to-enter-the-exam-questions-to-be-summoned-in-the-exam-department'
                            )
                        }}
                    </p>
                    <BaseTabs v-if="exam.availableDates" class="mt-5"
                :tabs="exam.availableDates.map((day) => ({ label: day.date, value: day.date }))" v-model="activeTab" />
                </div>
                <BaseButton color="primary" @click="reshuffleQuestions" :loading="examStore.isLoading">
                    {{ $t('reshuffle-questions') }} ليوم <span class="font-bold me-1" dir="ltr">{{ activeTab }}</span>
                </BaseButton>
            </div>


            
        </div>



        <hr class="my-5">
        <div v-if="!examStore.isLoading" item-key="order" class="my-5 px-10">
            <QuestionCard v-for="(item, index) in questions" :key="index" v-model="questions[index]" :index="index"
                show-replcae :is-evaluation="isEvaluation" @replace="openReplaceDialog" />
        </div>
        <div v-else>
            <AppLoading />
        </div>
        <CardNoData v-if="questions.length === 0" />
    </div>
    <ReplaceQuestion @refresh="getExam" />
</template>

<style></style>
