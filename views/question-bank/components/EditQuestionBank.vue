<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'

import { useI18n } from 'vue-i18n'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { createValidator } from '~/services/validationWithI18n'
import { Validator } from '~/services/validator'
import { useQuestionBankStore } from '../store/index'
import type { QuestionBank } from '../types'
import { useToast } from '~/composables/toaster'

const questionBankStore = useQuestionBankStore()
const { t } = useI18n()
const questionBank = computed(() => questionBankStore.selectedQuestionBank)

const validator = new Validator<QuestionBank>(
    {
        title: questionBank.value?.title || '',
        creationEndDate: questionBank.value?.creationEndDate || null,
        creationStartDate: questionBank.value?.creationStartDate || null,
        categories: null,
    },
    {
        title: {
            required: createValidator(t, 'title', 'required'),
        },
    }
)
const body = validator.validation

watchDeep(questionBank, (value) => {
    if (value) {
        body.value.title.$model = value.title
        body.value.creationStartDate.$model = value.creationStartDate
        body.value.creationEndDate.$model = value.creationEndDate
        body.value.categories.$model = value.categories?.map((x) => x.id)
    }
})

const updateQuestionBank = async () => {
    const bodyData = validator.extractBody()
    if(bodyData.creationStartDate && bodyData.creationEndDate) {
        // check if creationStartDate is before creationEndDate
        if(new Date(bodyData.creationStartDate) > new Date(bodyData.creationEndDate)) {
            useToast({
                message: t('creation-start-date-before-creation-end-date'),
                isError: true,
            })
            return
        }
    }
    try {
        questionBankStore.isLoading = true
        const isValid = await body.value.$validate()
        if (!isValid) return
        await questionBankStore.updateQuestionBank(bodyData)
        validator.resetBody()
        questionBankStore.isEditDialogOpen = false
    } catch (error) {
        console.log(error, 'error')
    } finally {
        questionBankStore.isLoading = false
    }
}
</script>
<template>
    <AppDialog v-model="questionBankStore.isEditDialogOpen" :title="$t('edit-question-bank')" size="2xl"
        overflow-y="visible">
        <div class="rounded-3xl p-3">
            <div class="grid gap-3 md:grid-cols-1">
                <AppInputField v-model="body.title.$model" :errors="body.title.$errors" :label="$t('title')"
                    class="col-span-2" />
                <AppAutoCompleteField v-model="body.categories.$model" fetch-on-search search-key="name"
                    :label="$t('select-categories')" get-url="/category/lookup" without-data multiple item-label="title" item-value="id"
                    class="col-span-2" />
            </div>

            <h1 class="mt-5 text-lg font-semibold">
                {{ $t('fill-creation-period-dates-optional') }}
            </h1>
            <div class="my-1 grid gap-3 md:grid-cols-2">
                <AppFieldAppInputField v-model="body.creationStartDate.$model" :errors="body.creationStartDate.$errors"
                    :label="$t('start-date')" :placeholder="$t('enter-start-date')" type="date" />
                <AppFieldAppInputField v-model="body.creationEndDate.$model" :errors="body.creationEndDate.$errors"
                    :label="$t('end-date')" :placeholder="$t('enter-end-date')" type="date" />
            </div>
            <BaseButton color="primary" :disabled="questionBankStore.isLoading" class="mt-5 w-full gap-1"
                @click="updateQuestionBank">
                <Icon name="ph:upload-simple-duotone" class="size-5" />
                {{ $t('save-change') }}
            </BaseButton>
        </div>
    </AppDialog>
</template>
