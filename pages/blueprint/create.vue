<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppInputField from '~/components/app-field/AppInputField.vue'
import axiosIns from '~/services/app-client/axios'
import { useAppToaster } from '~/services/toaster/toaster'
import { createValidator } from '~/services/validationWithI18n'
import { Validator } from '~/services/validator'
import { tableCreateHeaders } from '~/views/blueprint/index'
import { useBlueprintStore } from '~/views/blueprint/store'
import type { Blueprint, BlueprintQuestionBank, QuestionBankBlueprintDetails } from '~/views/blueprint/types/index'
import { difficultyOptions } from '~/views/question-bank'
import {
    questionTypeOptions,
    type QuestionBankDto,
} from '~/views/question-bank/types/index'

definePageMeta({
    title: 'blueprints',
    description: 'create-and-manage-blueprints',
})

const { t } = useI18n()
const blueprintStore = useBlueprintStore()
const router = useRouter()

const validator = new Validator<Blueprint>(
    {
        questionBanks: [],
        displayResult: true,
        moveBetweenQuestion: true,
        name: '',
        successGrade: 0,
        maximumGrade: 0,
        randomizeChoices: true,
        randomizeAnswer: true,
        halfSuccessGrade: 0,
    },
    {
        name: {
            required: createValidator(t, 'title', 'required'),
        },
        successGrade: {
            required: createValidator(t, 'success-grade', 'required'),
            minValue: createValidator(t, 'success-grade', 'minValue', 1),
        },
        halfSuccessGrade: {
            required: createValidator(t, 'half-success-grade', 'required'),
            minValue: createValidator(t, 'half-success-grade', 'minValue', 1),
        },
        maximumGrade: {
            required: createValidator(t, 'maximum-grade', 'required'),
            minValue: createValidator(t, 'maximum-grade', 'minValue', 1),
        },
        questionBanks: {
            required: createValidator(t, 'question-bank', 'required'),
        },
    }
)

const body = validator.validation
const questionBanks = ref<QuestionBankDto[]>([])
const questionBankDetails = ref<{ [questionBankId: string]: QuestionBankBlueprintDetails }>({})
const isLoading = ref(false)
// Store real-time question counts from API
const realQuestionCounts = ref<{ [key: string]: number }>({})
// Computed refs for type safety
const questionBanksList = computed(() => body.value.questionBanks.$model as BlueprintQuestionBank[])

const addTopic = (index: number) => {
    questionBanksList.value[index].topics.push({
        topicId: '',
        questionType: null,
        difficulty: null,
        numberOfQuestions: 1,
        grade: 1,
    })
    // Fetch initial count for the new topic
    const newTopicIndex = questionBanksList.value[index].topics.length - 1
    nextTick(() => {
        fetchRealQuestionCount(index, newTopicIndex)
    })
}

const removeTopic = (questionBankIndex: number, topicIndex: number) => {
    questionBanksList.value[questionBankIndex].topics.splice(topicIndex, 1)
    // Fetch updated count
    nextTick(() => {
        fetchRealQuestionCount(questionBankIndex, topicIndex)
    })
}

// Fetch real question count from API
const fetchRealQuestionCount = async (questionBankIndex: number, topicIndex: number) => {
    const topic = questionBanksList.value[questionBankIndex].topics[topicIndex]
    const questionBankId = questionBanksList.value[questionBankIndex].questionBankId

    // Create unique key for this topic's count
    const key = `${questionBankId}-${topicIndex}`

    // Build params object, only including defined values
    const params: any = {
        questionBankId
    }

    if (topic.topicId) params.topicId = topic.topicId
    if (topic.questionType !== null && topic.questionType !== undefined) params.type = topic.questionType
    if (topic.difficulty !== null && topic.difficulty !== undefined) params.difficulty = topic.difficulty

    try {
        const response = await axiosIns.get('/question-bank/question-count', { params })
        realQuestionCounts.value[key] = response.data.count || 0
    } catch (error) {
        console.error('Error fetching question count:', error)
        realQuestionCounts.value[key] = 0
    }
}

// Handle cascading resets when selections change
const onTopicChange = (questionBankIndex: number, topicIndex: number) => {
    const topic = questionBanksList.value[questionBankIndex].topics[topicIndex]
    // Reset dependent fields without setting default values
    topic.questionType = null
    topic.difficulty = null
    // Fetch updated count
    fetchRealQuestionCount(questionBankIndex, topicIndex)
}

const onQuestionTypeChange = (questionBankIndex: number, topicIndex: number) => {
    const topic = questionBanksList.value[questionBankIndex].topics[topicIndex]
    // Reset dependent fields without setting default values
    topic.difficulty = null
    // Fetch updated count
    fetchRealQuestionCount(questionBankIndex, topicIndex)
}

const onDifficultyChange = (questionBankIndex: number, topicIndex: number) => {
    // Fetch updated count when difficulty changes
    fetchRealQuestionCount(questionBankIndex, topicIndex)
}

watchDeep(
    () => questionBanks.value,
    async () => {
        const existingIds = new Set(questionBanks.value.map((qb: QuestionBankDto) => qb.id))
        const bodyQuestionBanks = questionBanksList.value

        // Fetch details for new question banks
        for (const { id } of questionBanks.value) {
            if (!bodyQuestionBanks.some((qb: BlueprintQuestionBank) => qb.questionBankId === id)) {
                bodyQuestionBanks.push({ questionBankId: id, topics: [] })

                // Fetch blueprint details for this question bank
                const details = await blueprintStore.getQuestionBankBlueprintDetails(id)
                if (details) {
                    questionBankDetails.value[id] = details
                }
            }
        }

        // Remove question banks that are no longer selected
        body.value.questionBanks.$model = bodyQuestionBanks.filter((qb: BlueprintQuestionBank) =>
            existingIds.has(qb.questionBankId)
        )

        // Remove details for removed question banks
        Object.keys(questionBankDetails.value).forEach(id => {
            if (!existingIds.has(id)) {
                delete questionBankDetails.value[id]
            }
        })
    }
)

const quesitonBankById = (id: string): QuestionBankDto => {
    return questionBanks.value.find((qb: QuestionBankDto) => qb.id === id) as QuestionBankDto
}

// Helper functions for cascading filters
const getTopicsByQuestionBankId = (questionBankId: string) => {
    const details = questionBankDetails.value[questionBankId]
    return details?.topics || []
}

const getQuestionTypesByTopicId = (questionBankId: string, topicId: string) => {
    const details = questionBankDetails.value[questionBankId]
    if (!details || !topicId) return []

    return details.questionTypes
        .filter(qt => qt.topicId === topicId)
        .map(qt => ({
            value: qt.questionType,
            label: questionTypeOptions(t).find(option => option.value === qt.questionType)?.label || '',
            questionCount: qt.questionCount
        }))
}

const getDifficultiesByQuestionType = (questionBankId: string, questionType: number | null) => {
    const details = questionBankDetails.value[questionBankId]
    if (!details || questionType === null) return []

    return details.difficulties
        .map(d => ({
            value: d.difficulty,
            label: difficultyOptions(t).find(option => option.value === d.difficulty)?.label || '',
            questionCount: d.questionCount
        }))
}

// Get current available question count - use real API count when available
const getCurrentQuestionCount = (questionBankIndex: number, topicIndex: number): number => {
    const questionBankId = questionBanksList.value[questionBankIndex]?.questionBankId
    if (!questionBankId) return 0

    const key = `${questionBankId}-${topicIndex}`

    // Return real count from API if available
    if (realQuestionCounts.value[key] !== undefined) {
        return realQuestionCounts.value[key]
    }

    // Fallback to static count from details
    const topic = questionBanksList.value[questionBankIndex]?.topics[topicIndex]
    if (!topic) return 0

    const details = questionBankDetails.value[questionBankId]
    if (!details) return 0

    if (!topic.topicId) {
        return details.subject.questionCount
    }

    if (topic.questionType === null) {
        const topicData = details.topics.find(t => t.id === topic.topicId)
        return topicData?.questionCount || 0
    }

    if (topic.difficulty === null) {
        const questionTypeData = details.questionTypes.find(qt => qt.topicId === topic.topicId && qt.questionType === topic.questionType)
        return questionTypeData?.questionCount || 0
    }

    const difficultyData = details.difficulties.find(d => d.difficulty === topic.difficulty)
    return difficultyData?.questionCount || 0
}

const calculateTotalGrade = (): number => {
    return questionBanksList.value.reduce(
        (sum: number, questionBank) =>
            sum +
            questionBank.topics.reduce(
                (topicSum: number, topic) => topicSum + topic.grade * topic.numberOfQuestions,
                0
            ),
        0
    )
}

// Validation for question count limits
const validateQuestionCounts = (): boolean => {
    for (let questionBankIndex = 0; questionBankIndex < questionBanksList.value.length; questionBankIndex++) {
        const questionBank = questionBanksList.value[questionBankIndex]
        for (let topicIndex = 0; topicIndex < questionBank.topics.length; topicIndex++) {
            const topic = questionBank.topics[topicIndex]
            const availableCount = getCurrentQuestionCount(questionBankIndex, topicIndex)

            if (topic.numberOfQuestions > availableCount) {
                useToast({
                    message: t('number-of-questions-exceeds-available-count', {
                        requested: topic.numberOfQuestions,
                        available: availableCount
                    }),
                    isError: true
                })
                return false
            }
        }
    }

    return true
}

const submit = async () => {
    const isValid = await body.value.$validate()
    if (!isValid) return


    // Validate question counts
    if (!validateQuestionCounts()) return

    const totalGrade = calculateTotalGrade()
    const maximumGrade = Number(body.value.maximumGrade.$model)
    if (totalGrade !== maximumGrade) {
        useToast(
            {
                message: t('total-grade-must-equal-maximum-grade'),
                isError: true
            }
        )
        return;
    }
    try {
        isLoading.value = true
        await blueprintStore.create(validator.extractBody())
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
        <AppInputField v-model="body.name.$model" :errors="body.name.$errors" :placeholder="$t('wirting-title')"
            :label="$t('title')" />
        <div class="my-2 grid grid-cols-3 gap-5">
            <AppInputField v-model="body.successGrade.$model" :errors="body.successGrade.$errors"
                :placeholder="$t('wirting-grade')" :label="$t('success-grade')" />
            <AppInputField v-model="body.halfSuccessGrade.$model" :errors="body.halfSuccessGrade.$errors"
                :placeholder="$t('wirting-grade')" :label="$t('half-success-grade')" />
            <AppInputField v-model="body.maximumGrade.$model" :errors="body.maximumGrade.$errors"
                :placeholder="$t('maximum-grade')" :label="$t('maximum-grade')" />
        </div>
        <AppAutoCompleteField fetch-on-search search-key="name" get-url="/question-bank/lookup" without-data item-label="title"
            item-value="id" multiple :label="$t('question-banks')" :placeholder="$t('question-banks')"
            :errors="body.questionBanks.$errors" @update:object-value="questionBanks = $event" />
        <p class="text-muted-500">
            {{ $t('choice-at-least-one-question-bank-to-add-settings-for-the-blueprint') }}
        </p>


        <BaseCard v-for="(questionBank, questionBankIndex) in questionBanksList" :key="questionBank.questionBankId"
            class="pa-3 my-2">
            <BaseHeading>
                {{ $t('bluebrint-settings-for-question-bank') }} (
                {{ quesitonBankById(questionBank.questionBankId).title }} )
            </BaseHeading>
            <!-- Dynamic Question Count Display -->
            <div class="my-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <h4 class="text-sm font-semibold text-blue-700 mb-2">{{ $t('current-available-questions') }}</h4>
                <div v-if="questionBanksList[questionBankIndex].topics.length === 0" class="text-center py-2">
                    <p class="text-2xl font-bold text-blue-600">
                        {{ questionBankDetails[questionBank.questionBankId]?.subject?.questionCount || 0 }}
                    </p>
                    <p class="text-sm text-gray-600">{{ $t('total-questions-in-question-bank') }}</p>
                </div>
                <div v-else class="space-y-2">
                    <div v-for="(topic, topicIndex) in questionBanksList[questionBankIndex].topics" :key="topicIndex"
                        class="bg-white rounded-md p-3 border border-blue-100">
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <p class="text-sm font-medium text-gray-700">
                                    {{ $t('topic') }} {{ topicIndex + 1 }}:
                                    <span v-if="topic.topicId" class="text-blue-600">
                                        {{getTopicsByQuestionBankId(questionBank.questionBankId).find(t => t.id ===
                                            topic.topicId)?.name || $t('unknown-topic')}}
                                    </span>
                                    <span v-else class="text-gray-400 italic">{{ $t('no-topic-selected') }}</span>
                                </p>
                                <div class="mt-1 text-xs text-gray-500 space-x-2">
                                    <p v-if="topic.questionType !== null">
                                        {{ $t('type') }}: {{questionTypeOptions(t).find(qt => qt.value ===
                                            topic.questionType)?.label}}
                                    </p>
                                    <p v-if="topic.difficulty !== null">
                                        {{ $t('difficulty') }}: {{difficultyOptions(t).find(d => d.value ===
                                            topic.difficulty)?.label}}
                                    </p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-lg font-bold" :class="{
                                    'text-green-600': getCurrentQuestionCount(questionBankIndex, topicIndex) >= topic.numberOfQuestions,
                                    'text-red-600': getCurrentQuestionCount(questionBankIndex, topicIndex) < topic.numberOfQuestions,
                                    'text-blue-600': !topic.topicId
                                }">
                                    {{ getCurrentQuestionCount(questionBankIndex, topicIndex) }}
                                </p>
                                <p class="text-xs text-gray-500">{{ $t('available') }}</p>
                                <p v-if="topic.numberOfQuestions > 0" class="text-xs" :class="{
                                    'text-green-600': getCurrentQuestionCount(questionBankIndex, topicIndex) >= topic.numberOfQuestions,
                                    'text-red-600': getCurrentQuestionCount(questionBankIndex, topicIndex) < topic.numberOfQuestions
                                }">
                                    {{ $t('requested') }}: {{ topic.numberOfQuestions }}
                                </p>
                            </div>
                        </div>
                        <div v-if="topic.topicId && getCurrentQuestionCount(questionBankIndex, topicIndex) < topic.numberOfQuestions"
                            class="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
                            <Icon name="ph:warning" class="inline mr-1" />
                            {{ $t('insufficient-questions-warning') }}
                        </div>
                    </div>
                </div>
            </div>

            <AppTable hide-no-data :headers="tableCreateHeaders($t)"
                :items="questionBanksList[questionBankIndex].topics" class="mt-3">
                <template #data-topicId="{ index }">
                    <AppAutoCompleteField v-model="questionBanksList[questionBankIndex].topics[index].topicId"
                        :items="getTopicsByQuestionBankId(questionBank.questionBankId)" item-label="name"
                        item-value="id" :placeholder="$t('topics')"
                        @update:model-value="onTopicChange(questionBankIndex, index)" />
                </template>
                <template #data-questionType="{ index }">
                    <AppAutoCompleteField v-model="questionBanksList[questionBankIndex].topics[index].questionType"
                        :items="getQuestionTypesByTopicId(questionBank.questionBankId, questionBanksList[questionBankIndex].topics[index].topicId)"
                        item-label="label" item-value="value" :placeholder="$t('select-a-question-type')"
                        :disabled="!questionBanksList[questionBankIndex].topics[index].topicId"
                        @update:model-value="onQuestionTypeChange(questionBankIndex, index)" />
                </template>
                <template #data-difficulty="{ index }">
                    <div class="flex items-center gap-2">
                        <AppAutoCompleteField v-model="questionBanksList[questionBankIndex].topics[index].difficulty"
                            :items="getDifficultiesByQuestionType(
                                questionBank.questionBankId,
                                questionBanksList[questionBankIndex].topics[index].questionType
                            )" item-label="label" item-value="value" :placeholder="$t('select-a-difficulty')"
                            :disabled="!questionBanksList[questionBankIndex].topics[index].questionType"
                            @update:model-value="onDifficultyChange(questionBankIndex, index)" />

                    </div>
                </template>
                <template #data-numberOfQuestions="{ index }">
                    <div class="space-y-1">
                        <AppInputField v-model="questionBanksList[questionBankIndex].topics[index].numberOfQuestions"
                            type="number" required :placeholder="$t('number-of-questions')" :class="{
                                'border-red-300 focus:border-red-500': questionBanksList[questionBankIndex].topics[index].topicId &&
                                    getCurrentQuestionCount(questionBankIndex, index) < questionBanksList[questionBankIndex].topics[index].numberOfQuestions
                            }" />
                        <div v-if="questionBanksList[questionBankIndex].topics[index].topicId"
                            class="flex items-center justify-between text-xs">
                            <span :class="{
                                'text-green-600': getCurrentQuestionCount(questionBankIndex, index) >= questionBanksList[questionBankIndex].topics[index].numberOfQuestions,
                                'text-red-600': getCurrentQuestionCount(questionBankIndex, index) < questionBanksList[questionBankIndex].topics[index].numberOfQuestions,
                                'text-gray-500': getCurrentQuestionCount(questionBankIndex, index) >= questionBanksList[questionBankIndex].topics[index].numberOfQuestions
                            }">
                                {{ $t('available') }}: {{ getCurrentQuestionCount(questionBankIndex, index) }}
                            </span>
                            <span
                                v-if="getCurrentQuestionCount(questionBankIndex, index) < questionBanksList[questionBankIndex].topics[index].numberOfQuestions"
                                class="text-red-600 font-medium">
                                {{ $t('exceeds-limit') }}
                            </span>
                        </div>
                    </div>
                </template>
                <template #data-grade="{ index }">
                    <div class="flex items-center gap-2">
                        <AppInputField v-model="questionBanksList[questionBankIndex].topics[index].grade" type="number"
                            required :placeholder="$t('grade')" />
                        <BaseButton @click="removeTopic(questionBankIndex, index)" color="danger" size="sm"
                            variant="pastel">
                            <Icon name="ph:trash"></Icon>
                            حذف
                        </BaseButton>
                    </div>
                </template>
            </AppTable>
            <div class="flex justify-end">
                <BaseButton color="primary" class="gap-1" variant="pastel" @click="addTopic(questionBankIndex)">
                    <Icon name="ph:upload-simple-duotone" class="size-5" />
                    {{ $t('add-settings') }}
                </BaseButton>
            </div>
        </BaseCard>
        <!-- Reactive Summary -->
        <div v-if="questionBanksList.length > 0"
            class="my-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <h3 class="text-lg font-semibold text-green-700 mb-3">{{ $t('blueprint-summary') }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="text-center">
                    <p class="text-2xl font-bold text-blue-600">{{ questionBanksList.length }}</p>
                    <p class="text-sm text-gray-600">{{ $t('question-banks-selected') }}</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl font-bold text-purple-600">
                        {{questionBanksList.reduce((sum, qb) => sum + qb.topics.length, 0)}}
                    </p>
                    <p class="text-sm text-gray-600">{{ $t('total-topic-configurations') }}</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl font-bold" :class="{
                        'text-green-600': calculateTotalGrade() === Number(body.maximumGrade.$model) && Number(body.maximumGrade.$model) > 0,
                        'text-red-600': calculateTotalGrade() !== Number(body.maximumGrade.$model) && Number(body.maximumGrade.$model) > 0,
                        'text-gray-600': Number(body.maximumGrade.$model) === 0
                    }">
                        {{ calculateTotalGrade() }} / {{ body.maximumGrade.$model || 0 }}
                    </p>
                    <p class="text-sm text-gray-600">{{ $t('total-calculated-grade') }}</p>
                </div>
            </div>
            <div v-if="calculateTotalGrade() !== Number(body.maximumGrade.$model) && Number(body.maximumGrade.$model) > 0"
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

<style>
.max-w-5xl {
    max-width: 75rem !important;
}
</style>