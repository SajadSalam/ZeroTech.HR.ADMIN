<script setup lang="ts">
import { useBlueprintForm, type QuestionBank } from '~/views/blueprint/composables/useBlueprintForm'


const {
    body,
    questionBanks,
    calculateTotalGrade,
} = useBlueprintForm()

const totalGrade = computed(() => {
    return calculateTotalGrade()
})

const totalTopicRows = computed(() => {
    return questionBanks.value.reduce((sum: number, qb: QuestionBank) => sum + qb.selectedTopics.length, 0)
})

</script>

<template>
    <div v-if="questionBanks.length > 0"
        class="my-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
        <h3 class="text-lg font-semibold text-green-700 mb-3">{{ $t('blueprint-summary') }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center">
                <p class="text-2xl font-bold text-blue-600">{{ questionBanks.length }}</p>
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
                    'text-green-600': totalGrade === Number(body.totalQuestionsGrade.$model) && Number(body.totalQuestionsGrade.$model) > 0,
                    'text-red-600': totalGrade !== Number(body.totalQuestionsGrade.$model) && Number(body.totalQuestionsGrade.$model) > 0,
                    'text-gray-600': Number(body.totalQuestionsGrade.$model) === 0
                }">
                    {{ totalGrade }} / {{ body.totalQuestionsGrade.$model || 0 }}
                </p>
                <p class="text-sm text-gray-600">{{ $t('total-calculated-grade') }}</p>
            </div>
        </div>
        <div v-if="totalGrade !== Number(body.totalQuestionsGrade.$model) && Number(body.totalQuestionsGrade.$model) > 0"
            class="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-700 text-sm">
            <Icon name="ph:warning" class="inline mr-1" />
            {{ $t('grade-mismatch-warning') }}
        </div>
    </div>
</template>