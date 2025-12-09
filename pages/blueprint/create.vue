<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppInputField from '~/components/app-field/AppInputField.vue'
import axiosIns from '~/services/app-client/axios'
import { useAppToaster } from '~/services/toaster/toaster'
import { createValidator } from '~/services/validationWithI18n'
import { Validator } from '~/services/validator'
import { tableCreateHeaders } from '~/views/blueprint'
import { useBlueprintStore } from '~/views/blueprint/store'
import type { BlueprintCreate, BlueprintItem, CountDetails, TopicDetails, QuestionTypeStats, DifficultyStats } from '~/views/blueprint/types/index'
import type { QuestionBankDto } from '~/views/question-bank/types'

type SelectedTopic = {
    topicId: string
    questionType: number | null
    difficulty: number | null
    numberOfQuestions: number
    grade: number
    difficultyCount?: number // Store the count when difficulty is selected
}

type QuestionBank = QuestionBankDto & {
    selectedTopics: SelectedTopic[]
}
definePageMeta({
    title: 'blueprints',
    description: 'create-and-manage-blueprints',
})
const questionBankId = ref<string | null>(null)
const questionBanks = ref<QuestionBank[]>([])
const countDetails = ref<Record<string, CountDetails>>({})
const existingQuestionBanksIds = ref<string[]>([])
const { t } = useI18n()
const blueprintStore = useBlueprintStore()
const router = useRouter()

const validator = new Validator<BlueprintCreate>(
    {
        title: '',
        successGrade: 0,
        fullGrade: 0,
        description: '',
        displayResult: true,
        moveBetweenQuestion: true,
        randomizeAnswer: true,
        randomizeChoices: true,
        items: [],
        totalQuestionsGrade: 0,
    },
    {
        title: {
            required: createValidator(t, 'title', 'required'),
        },
        successGrade: {
            required: createValidator(t, 'half-success-grade', 'required'),
            minValue: createValidator(t, 'half-success-grade', 'minValue', 1),
        },
        fullGrade: {
            required: createValidator(t, 'success-grade', 'required'),
            minValue: createValidator(t, 'success-grade', 'minValue', 1),
        },
        totalQuestionsGrade: {
            required: createValidator(t, 'maximum-grade', 'required'),
            minValue: createValidator(t, 'maximum-grade', 'minValue', 1),
        },
    }
)

const body = validator.validation
const isLoading = ref(false)

const setQuestionBanks = async (questionBank: QuestionBankDto[]) => {
    for (const qb of questionBank) {
        if (existingQuestionBanksIds.value.includes(qb.id) && questionBank.length > existingQuestionBanksIds.value.length) {
            continue
        }
        if (!existingQuestionBanksIds.value.includes(qb.id)) {
            const response = await blueprintStore.getCountByQuestionBankId(qb.id)
            if (response) {
                countDetails.value[qb.id] = response
            }
            existingQuestionBanksIds.value.push(qb.id)
            questionBanks.value.push({
                ...qb,
                selectedTopics: [],
            })
        }
        // handle removing question banks
        if (existingQuestionBanksIds.value.includes(qb.id) && questionBank.length !== existingQuestionBanksIds.value.length) {
            existingQuestionBanksIds.value = existingQuestionBanksIds.value.filter((id: string) => id == qb.id)
            questionBanks.value = questionBanks.value.filter((QB: QuestionBankDto) => QB.id == qb.id)
            countDetails.value = Object.fromEntries(Object.entries(countDetails.value).filter(([key]) => key == qb.id))
        }
    }
}
const addTopic = (index: number) => {
    questionBanks.value[index].selectedTopics.push({
        topicId: '',
        questionType: null,
        difficulty: null,
        numberOfQuestions: 1,
        grade: 1,
    })
}

// Get available question types for a specific topic
const getAvailableQuestionTypes = (qbIndex: number, topicIndex: number) => {
    const qb = questionBanks.value[qbIndex]
    const topic = qb.selectedTopics[topicIndex]
    const countDetail = countDetails.value[qb.id]
    
    if (!topic.topicId || !countDetail) return []
    
    const topicDetail = countDetail.topics.find((t: TopicDetails) => t.id === topic.topicId)
    if (!topicDetail) return []
    
    return topicDetail.types || []
}

// Get available difficulties for a specific question type
const getAvailableDifficulties = (qbIndex: number, topicIndex: number) => {
    const qb = questionBanks.value[qbIndex]
    const topic = qb.selectedTopics[topicIndex]
    const countDetail = countDetails.value[qb.id]
    
    if (!topic.topicId || !topic.questionType || !countDetail) return []
    
    const topicDetail = countDetail.topics.find((t: TopicDetails) => t.id === topic.topicId)
    if (!topicDetail) return []
    
    const questionTypeDetail = topicDetail.types.find((t: QuestionTypeStats) => t.value === topic.questionType)
    if (!questionTypeDetail) return []
    
    return questionTypeDetail.difficulty || []
}

const onTopicChange = (qbIndex: number, topicIndex: number, topicId: string | null) => {
    const topic = questionBanks.value[qbIndex].selectedTopics[topicIndex]
    
    // Update topicId (handle null/empty string from clearing selection)
    topic.topicId = topicId || ''
    
    // Reset child fields when topic changes or is cleared
    topic.questionType = null
    topic.difficulty = null
    topic.difficultyCount = undefined
}

const onQuestionTypeChange = (qbIndex: number, topicIndex: number, questionType: number | null) => {
    const topic = questionBanks.value[qbIndex].selectedTopics[topicIndex]
    
    // Update questionType (handle null from clearing selection)
    topic.questionType = questionType
    
    // Reset child fields when questionType changes or is cleared
    topic.difficulty = null
    topic.difficultyCount = undefined
}

const onDifficultyChange = (qbIndex: number, topicIndex: number, difficulty: number | null) => {
    const topic = questionBanks.value[qbIndex].selectedTopics[topicIndex]
    const qb = questionBanks.value[qbIndex]
    const countDetail = countDetails.value[qb.id]
    
    // Update difficulty (handle null from clearing selection)
    topic.difficulty = difficulty
    
    // Find and save the count for this difficulty (only if all required fields are set)
    if (difficulty && countDetail && topic.topicId && topic.questionType) {
        const topicDetail = countDetail.topics.find((t: TopicDetails) => t.id === topic.topicId)
        if (topicDetail) {
            const questionTypeDetail = topicDetail.types.find((t: QuestionTypeStats) => t.value === topic.questionType)
            if (questionTypeDetail) {
                const difficultyDetail = questionTypeDetail.difficulty.find((d: DifficultyStats) => d.value === difficulty)
                if (difficultyDetail) {
                    topic.difficultyCount = difficultyDetail.count
                    // Reset numberOfQuestions to 1 or max if current value exceeds limit
                    if (topic.numberOfQuestions > difficultyDetail.count) {
                        topic.numberOfQuestions = Math.min(1, difficultyDetail.count)
                    }
                }
            }
        }
    } else {
        // Clear count if difficulty is cleared
        topic.difficultyCount = undefined
        topic.numberOfQuestions = 1
    }
}

// Get selected items for display
const getSelectedItems = (qbIndex: number) => {
    const qb = questionBanks.value[qbIndex]
    const countDetail = countDetails.value[qb.id]
    
    if (!countDetail) return []
    
    const selectedItems: Array<{
        topicName: string
        questionTypeName: string
        difficultyName: string
        count: number
    }> = []
    
    for (const topic of qb.selectedTopics) {
        // Only include items where topic is selected
        if (!topic.topicId) continue
        
        const topicDetail = countDetail.topics.find((t: TopicDetails) => t.id === topic.topicId)
        if (!topicDetail) continue
        
        const topicName = topicDetail.titleEn
        
        // If only topic is selected, show just the topic
        if (!topic.questionType) {
            selectedItems.push({
                topicName,
                questionTypeName: '-',
                difficultyName: '-',
                count: 0
            })
            continue
        }
        
        const questionTypeDetail = topicDetail.types.find((t: QuestionTypeStats) => t.value === topic.questionType)
        if (!questionTypeDetail) continue
        
        const questionTypeName = questionTypeDetail.name
        
        // If only topic and questionType are selected, show them
        if (!topic.difficulty) {
            selectedItems.push({
                topicName,
                questionTypeName,
                difficultyName: '-',
                count: 0
            })
            continue
        }
        
        const difficultyDetail = questionTypeDetail.difficulty.find((d: DifficultyStats) => d.value === topic.difficulty)
        if (!difficultyDetail) continue
        
        selectedItems.push({
            topicName,
            questionTypeName,
            difficultyName: difficultyDetail.name,
            count: topic.difficultyCount || 0
        })
    }
    
    return selectedItems
}

// Check if any topic is selected
const hasSelectedTopics = (qbIndex: number) => {
    const qb = questionBanks.value[qbIndex]
    return qb.selectedTopics.some((topic: SelectedTopic) => topic.topicId)
}

// Get current question count for validation
const getCurrentQuestionCount = (qbIndex: number, topicIndex: number) => {
    const topic = questionBanks.value[qbIndex].selectedTopics[topicIndex]
    return topic.difficultyCount || 0
}

// Check if numberOfQuestions exceeds available count
const exceedsLimit = (qbIndex: number, topicIndex: number) => {
    const topic = questionBanks.value[qbIndex].selectedTopics[topicIndex]
    const availableCount = getCurrentQuestionCount(qbIndex, topicIndex)
    return availableCount > 0 && topic.numberOfQuestions > availableCount
}

// Remove a topic row
const removeTopic = (qbIndex: number, topicIndex: number) => {
    questionBanks.value[qbIndex].selectedTopics.splice(topicIndex, 1)
}

// Computed: Total number of question banks selected
const totalQuestionBanks = computed(() => {
    return questionBanks.value.length
})

// Computed: Total number of topic rows added
const totalTopicRows = computed(() => {
    return questionBanks.value.reduce((sum: number, qb: QuestionBank) => sum + qb.selectedTopics.length, 0)
})

const calculateTotalGrade = () => {
    let total = 0
    for (const qb of questionBanks.value) {
        for (const topic of qb.selectedTopics) {
            // Only count if difficulty is selected (meaning it's a complete row)
            if (topic.difficulty) {
                total += (topic.grade || 0) * (topic.numberOfQuestions || 0)
            }
        }
    }
    return total
}

const validateQuestionCounts = () => {
    for (let qbIndex = 0; qbIndex < questionBanks.value.length; qbIndex++) {
        const qb = questionBanks.value[qbIndex]
        for (let topicIndex = 0; topicIndex < qb.selectedTopics.length; topicIndex++) {
            if (exceedsLimit(qbIndex, topicIndex)) {
                const toaster = useAppToaster()
                toaster.show('danger', t('number-of-questions-exceeds-available-count'))
                return false
            }
        }
    }
    return true
}

const buildBlueprintItems = (): BlueprintItem[] => {
    const items: BlueprintItem[] = []
    
    for (const qb of questionBanks.value) {
        for (const topic of qb.selectedTopics) {
            if (topic.topicId && topic.questionType !== null && topic.difficulty !== null) {
                items.push({
                    questionBankId: qb.id,
                    topicId: topic.topicId,
                    questionType: topic.questionType,
                    difficulty: topic.difficulty,
                    numberOfQuestions: topic.numberOfQuestions,
                    gradePerQuestion: topic.grade,
                })
            }
        }
    }
    
    return items
}

const submit = async () => {
    const isValid = await body.value.$validate()
    if (!isValid) return
    
    if (!validateQuestionCounts()) return

    const totalGrade = calculateTotalGrade()
    const expectedGrade = Number(body.value.totalQuestionsGrade.$model)
    if (totalGrade !== expectedGrade) {
        const toaster = useAppToaster()
        toaster.show('danger', t('total-grade-must-equal-maximum-grade'))
        return
    }
    
    const items = buildBlueprintItems()
    if (items.length === 0) {
        const toaster = useAppToaster()
        toaster.show('danger', t('at-least-one-complete-topic-configuration-required'))
        return
    }
    
    try {
        isLoading.value = true
        const extractedBody = validator.extractBody()
        extractedBody.items = items
        await blueprintStore.create(extractedBody)
        router.push('/blueprint')
    } catch (error) {
        console.error(error)
    } finally {
        isLoading.value = false
    }
}
</script>
<template>
    <div class="mb-2 rounded-3xl bg-white p-3">
        <AppInputField v-model="body.title.$model" :errors="body.title.$errors" :placeholder="$t('wirting-title')"
            :label="$t('title')" />
        <div class="my-2 grid grid-cols-3 gap-5">
            <AppInputField v-model="body.fullGrade.$model" :errors="body.fullGrade.$errors"
                :placeholder="$t('success-grade')" :label="$t('success-grade')" />
            <AppInputField v-model="body.successGrade.$model" :errors="body.successGrade.$errors"
                :placeholder="$t('half-success-grade')" :label="$t('half-success-grade')" />
            <AppInputField v-model="body.totalQuestionsGrade.$model" :errors="body.totalQuestionsGrade.$errors"
                :placeholder="$t('maximum-grade')" :label="$t('maximum-grade')" />
        </div>
        <AppAutoCompleteField fetch-on-search search-key="name" get-url="/question-banks" item-label="title"
            item-value="id" multiple :label="$t('question-banks')" :placeholder="$t('question-banks')"
            @update:object-value="setQuestionBanks($event)" />
        <p class="text-muted-500">
            {{ $t('choice-at-least-one-question-bank-to-add-settings-for-the-blueprint') }}
        </p>
        <BaseCard v-for="(qb, qbIndex) in questionBanks" :key="qbIndex" class="pa-3 my-2">
            <BaseHeading>
                {{ $t('bluebrint-settings-for-question-bank') }} (
                {{ qb.title }} )
            </BaseHeading>
            <div class="my-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div v-if="!hasSelectedTopics(qbIndex)" class="text-center py-2">
                    <p class="text-2xl font-bold text-blue-600">
                        {{ countDetails[qb.id]?.totalCount || 0 }}
                    </p>
                    <p class="text-sm text-gray-600">{{ $t('total-questions-in-question-bank') }}</p>
                </div>
                <div v-else class="space-y-2">
                    <div v-for="(item, index) in getSelectedItems(qbIndex)" :key="index"
                        class="flex items-center justify-between p-2 bg-white rounded-lg border border-blue-100">
                        <div class="flex-1">
                            <p class="font-semibold text-gray-800">{{ item.topicName }}</p>
                            <div class="flex items-center gap-3 mt-1 text-sm text-gray-600">
                                <span>{{ $t('question-type') }}: {{ item.questionTypeName }}</span>
                                <span v-if="item.difficultyName !== '-'">{{ $t('difficulty') }}: {{ item.difficultyName
                                    }}</span>
                                <span v-if="item.count > 0" class="font-medium text-blue-600">
                                    {{ $t('available') }}: {{ item.count }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AppTable hide-no-data :headers="tableCreateHeaders($t)" :items="qb.selectedTopics" class="mt-3">
                <template #data-topicId="{ index }">
                    <AppAutoCompleteField :model-value="qb.selectedTopics[index].topicId"
                        :items="countDetails[qb.id]?.topics || []" item-label="titleEn" item-value="id"
                        :placeholder="$t('topics')" @update:model-value="onTopicChange(qbIndex, index, $event)" />
                </template>
                <template #data-questionType="{ index }">
                    <AppAutoCompleteField :model-value="qb.selectedTopics[index].questionType"
                        :items="getAvailableQuestionTypes(qbIndex, index)" item-label="name" item-value="value"
                        :placeholder="$t('select-a-question-type')" :disabled="!qb.selectedTopics[index].topicId"
                        @update:model-value="onQuestionTypeChange(qbIndex, index, $event)" />
                </template>
                <template #data-difficulty="{ index }">
                    <div class="flex items-center gap-2">
                        <AppAutoCompleteField :key="qb.id + index + 'difficulty'"
                            :model-value="qb.selectedTopics[index].difficulty"
                            :items="getAvailableDifficulties(qbIndex, index)" item-label="name" item-value="value"
                            :placeholder="$t('select-a-difficulty')" :disabled="!qb.selectedTopics[index].questionType"
                            @update:model-value="onDifficultyChange(qbIndex, index, $event)" />
                        <span v-if="qb.selectedTopics[index].difficultyCount !== undefined"
                            class="text-sm text-gray-600">
                            ({{ $t('available') }}: {{ qb.selectedTopics[index].difficultyCount }})
                        </span>
                    </div>
                </template>
                <template #data-numberOfQuestions="{ index }">
                    <div class="space-y-1">
                        <AppInputField v-model="qb.selectedTopics[index].numberOfQuestions" type="number" required
                            :placeholder="$t('number-of-questions')" :disabled="!qb.selectedTopics[index].difficulty"
                            :class="{
                                'border-red-300 focus:border-red-500': exceedsLimit(qbIndex, index)
                            }" />
                        <div v-if="qb.selectedTopics[index].difficulty && qb.selectedTopics[index].difficultyCount !== undefined"
                            class="flex items-center justify-between text-xs">
                            <span :class="{
                                'text-green-600': !exceedsLimit(qbIndex, index),
                                'text-red-600': exceedsLimit(qbIndex, index)
                            }">
                                {{ $t('available') }}: {{ getCurrentQuestionCount(qbIndex, index) }}
                            </span>
                            <span v-if="exceedsLimit(qbIndex, index)" class="text-red-600 font-medium">
                                {{ $t('exceeds-limit') }}
                            </span>
                        </div>
                    </div>
                </template>
                <template #data-grade="{ index }">
                    <div class="flex items-center gap-2">
                        <AppInputField v-model="qb.selectedTopics[index].grade" type="number" required
                            :placeholder="$t('grade-per-question')" :disabled="!qb.selectedTopics[index].difficulty" />
                        <BaseButton @click="removeTopic(qbIndex, index)" color="danger" size="sm" variant="pastel">
                            <Icon name="ph:trash"></Icon>
                            {{ $t('delete') }}
                        </BaseButton>
                    </div>
                </template>
            </AppTable>
            <div class="flex justify-end">
                <BaseButton color="primary" class="gap-1" variant="pastel" @click="addTopic(qbIndex)">
                    <Icon name="ph:upload-simple-duotone" class="size-5" />
                    {{ $t('add-settings') }}
                </BaseButton>
            </div>
        </BaseCard>
        <!-- Reactive Summary -->
        <div v-if="totalQuestionBanks > 0"
            class="my-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <h3 class="text-lg font-semibold text-green-700 mb-3">{{ $t('blueprint-summary') }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="text-center">
                    <p class="text-2xl font-bold text-blue-600">{{ totalQuestionBanks }}</p>
                    <p class="text-sm text-gray-600">{{ $t('question-banks-selected') }}</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl font-bold text-purple-600">
                        {{ totalTopicRows }}
                    </p>
                    <p class="text-sm text-gray-600">{{ $t('total-topic-configurations') }}</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl font-bold" :class="{
                        'text-green-600': calculateTotalGrade() === Number(body.totalQuestionsGrade.$model) && Number(body.totalQuestionsGrade.$model) > 0,
                        'text-red-600': calculateTotalGrade() !== Number(body.totalQuestionsGrade.$model) && Number(body.totalQuestionsGrade.$model) > 0,
                        'text-gray-600': Number(body.totalQuestionsGrade.$model) === 0
                    }">
                        {{ calculateTotalGrade() }} / {{ body.totalQuestionsGrade.$model || 0 }}
                    </p>
                    <p class="text-sm text-gray-600">{{ $t('total-calculated-grade') }}</p>
                </div>
            </div>
            <div v-if="calculateTotalGrade() !== Number(body.totalQuestionsGrade.$model) && Number(body.totalQuestionsGrade.$model) > 0"
                class="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-700 text-sm">
                <Icon name="ph:warning" class="inline mr-1" />
                {{ $t('grade-mismatch-warning') }}
            </div>
        </div>
        <h2 class="mt-5 text-lg font-bold">
            {{ $t('more-settings') }}
        </h2>
        <p class="text-sm text-muted-500">
            {{ $t('select-the-options-of-the-exam') }}
        </p>
        <div class="my-3 grid gap-5 md:grid-cols-6">
            <BaseTag :color="body.displayResult.$model ? 'primary' : 'muted'" variant="pastel" size="md"
                class="pa-3 flex cursor-pointer items-center gap-2 text-lg"
                @click="body.displayResult.$model = !body.displayResult.$model">
                <div class="h-2 w-2 rounded-full" :class="{
                    'bg-primary-500': body.displayResult.$model,
                    'bg-muted-300': !body.displayResult.$model,
                }" />
                {{ $t('display-result') }}
            </BaseTag>
            <BaseTag :color="body.moveBetweenQuestion.$model ? 'primary' : 'muted'" variant="pastel" size="md"
                class="pa-3 flex cursor-pointer items-center gap-2 text-lg"
                @click="body.moveBetweenQuestion.$model = !body.moveBetweenQuestion.$model">
                <div class="h-2 w-2 rounded-full" :class="{
                    'bg-primary-500': body.moveBetweenQuestion.$model,
                    'bg-muted-300': !body.moveBetweenQuestion.$model,
                }" />
                {{ $t('move-between-questions') }}
            </BaseTag>
            <BaseTag :color="body.randomizeAnswer.$model ? 'primary' : 'muted'" variant="pastel" size="md"
                class="pa-3 flex cursor-pointer items-center gap-2 text-lg"
                @click="body.randomizeAnswer.$model = !body.randomizeAnswer.$model">
                <div class="h-2 w-2 rounded-full" :class="{
                    'bg-primary-500': body.randomizeAnswer.$model,
                    'bg-muted-300': !body.randomizeAnswer.$model,
                }" />
                {{ $t('randomize-answers') }}
            </BaseTag>
            <BaseTag :color="body.randomizeChoices.$model ? 'primary' : 'muted'" variant="pastel" size="md"
                class="pa-3 flex cursor-pointer items-center gap-2 text-lg"
                @click="body.randomizeChoices.$model = !body.randomizeChoices.$model">
                <div class="h-2 w-2 rounded-full" :class="{
                    'bg-primary-500': body.randomizeChoices.$model,
                    'bg-muted-300': !body.randomizeChoices.$model,
                }" />
                {{ $t('randomize-choices') }}
            </BaseTag>
        </div>
    </div>
    <BaseButton :loading="isLoading" :disabled="isLoading" color="primary" class="w-full mb-10 gap-1" @click="submit">
        <Icon name="ph:check-circle-duotone" class="size-5" />
        {{ $t('save-change') }}
    </BaseButton>
</template>
