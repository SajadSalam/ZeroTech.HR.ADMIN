<script setup lang="ts">
import { useBlueprintForm } from '~/views/blueprint/composables/useBlueprintForm'
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import type { QuestionBankDto } from '~/views/question-bank/types'

// Get shared form instance - all components share the same reactive state
const {
    body,
    setQuestionBanks,
    resetQuestionBanks,
    questionBanks,
} = useBlueprintForm()

const parseQuestionBanks = (qb: QuestionBankDto[]) => {
    if (qb.length === 0) {
        resetQuestionBanks()
        return
    }
    const isAddition = qb.length > questionBanks.value.length
    const changedItem = isAddition
        ? qb.find(item => !questionBanks.value.some((existing: QuestionBankDto) => existing.id === item.id))
        : questionBanks.value.find((item: QuestionBankDto) => !qb.some(newItem => newItem.id === item.id))

    if (changedItem) {
        setQuestionBanks(changedItem, isAddition)
    }
}
</script>

<template>
    <AppInputField v-model="body.title.$model" :errors="body.title.$errors" :placeholder="$t('wirting-title')"
        :label="$t('title')" />
    <div class="my-2 grid grid-cols-3 gap-5">
        <AppInputField v-model="body.fullGrade.$model" :errors="body.fullGrade.$errors"
            :placeholder="$t('full-grade')" :label="$t('full-grade')" />
        <AppInputField v-model="body.successGrade.$model" :errors="body.successGrade.$errors"
            :placeholder="$t('success-grade')" :label="$t('success-grade')" />
        <AppInputField v-model="body.totalQuestionsGrade.$model" :errors="body.totalQuestionsGrade.$errors"
            :placeholder="$t('total-questions-grade')" :label="$t('total-questions-grade')" />
    </div>
    <AppAutoCompleteField fetch-on-search search-key="name" get-url="/question-banks" item-label="title" item-value="id"
        multiple :label="$t('question-banks')" :placeholder="$t('question-banks')"
        @update:object-value="parseQuestionBanks($event)" />
    <p class="text-muted-500">
        {{ $t('choice-at-least-one-question-bank-to-add-settings-for-the-blueprint') }}
    </p>
</template>