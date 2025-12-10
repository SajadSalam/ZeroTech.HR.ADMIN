<script setup lang="ts">
import { useBlueprintForm } from '~/views/blueprint/composables/useBlueprintForm'
import { tableCreateHeaders } from '~/views/blueprint'
import type { TopicDetails, QuestionTypeStats, DifficultyStats, SelectedTopic } from '~/views/blueprint/types'
import AppTable from '~/components/app-table/AppTable.vue'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppInputField from '~/components/app-field/AppInputField.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const {
    questionBanks,
    countDetails,
} = useBlueprintForm()

const addTopic = (index: number) => {
    questionBanks.value[index].selectedTopics.push({
        topicId: '',
        questionType: null,
        difficulty: null,
        numberOfQuestions: 1,
        grade: 1,
    })
}

const removeTopic = (qbIndex: number, topicIndex: number) => {
    questionBanks.value[qbIndex].selectedTopics.splice(topicIndex, 1)
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
    
    topic.topicId = topicId || ''
    topic.questionType = null
    topic.difficulty = null
    topic.difficultyCount = undefined
}

const onQuestionTypeChange = (qbIndex: number, topicIndex: number, questionType: number | null) => {
    const topic = questionBanks.value[qbIndex].selectedTopics[topicIndex]
    
    topic.questionType = questionType
    
    topic.difficulty = null
    topic.difficultyCount = undefined
}

const onDifficultyChange = (qbIndex: number, topicIndex: number, difficulty: number | null) => {
    const topic = questionBanks.value[qbIndex].selectedTopics[topicIndex]
    const qb = questionBanks.value[qbIndex]
    const countDetail = countDetails.value[qb.id]
    
    topic.difficulty = difficulty
    
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

const validationMessage = (val: number) => { 
    return !val || val % 1 !== 0 ? t('add-proper-number') : (val < 0 ? t('no-negative-numbers-allowed') : '')
}

// Expose exceedsLimit for submit validation
defineExpose({ exceedsLimit })
</script>

<template>
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
                            'text-red-600': exceedsLimit(qbIndex, index) || validationMessage(qb.selectedTopics[index].numberOfQuestions)
                        }">
                            {{ $t('available') }}: {{ getCurrentQuestionCount(qbIndex, index) }}
                        </span>
                        <span v-if="exceedsLimit(qbIndex, index)" class="text-red-600 font-medium">
                            {{ $t('exceeds-limit') }}
                        </span>
                        <span class="text-red-600 font-medium">
                            {{ validationMessage(qb.selectedTopics[index].numberOfQuestions) }}
                        </span>
                    </div>
                </div>
            </template>
            <template #data-grade="{ index }">
                <div class="flex items-center gap-2">
                    <div class="flex flex-col gap-1">
                        <AppInputField v-model="qb.selectedTopics[index].grade" type="number" required
                        :placeholder="$t('grade-per-question')" :disabled="!qb.selectedTopics[index].difficulty" />
                        <span class="text-red-600 font-medium text-xs">
                            {{ validationMessage(qb.selectedTopics[index].grade) }}
                            </span>
                    </div>
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
</template>