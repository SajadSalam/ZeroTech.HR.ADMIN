<script setup lang="ts">
import { useBlueprintForm } from '~/views/blueprint/composables/useBlueprintForm'
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'

// Get shared form instance - all components share the same reactive state
const {
    body,
    setQuestionBanks,
} = useBlueprintForm()
</script>

<template>
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
    <AppAutoCompleteField fetch-on-search search-key="name" get-url="/question-banks" item-label="title" item-value="id"
        multiple :label="$t('question-banks')" :placeholder="$t('question-banks')"
        @update:object-value="setQuestionBanks($event)" />
    <p class="text-muted-500">
        {{ $t('choice-at-least-one-question-bank-to-add-settings-for-the-blueprint') }}
    </p>
</template>