<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'

import { useI18n } from 'vue-i18n'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { createValidator } from '~/services/validationWithI18n'
import { Validator } from '~/services/validator'
import { useQuestionBankStore } from '../store/index'
import type { QuestionBankCreateDto } from '../types'
import { useToast } from '~/composables/toaster'
import { useSubjectStore } from '~/views/subjects/store'
import { useTopicStore } from '~/views/topics/store'

const questionBankStore = useQuestionBankStore()
const subjectStore = useSubjectStore()
const topicStore = useTopicStore()
const { t } = useI18n()
const questionBank = computed(() => questionBankStore.selectedQuestionBank)

const validator = new Validator<QuestionBankCreateDto>(
    {
        title: questionBank.value?.title || '',
        subjectId: questionBank.value?.subject?.id || '',
        topicIds: questionBank.value?.questionBankTopics?.map((x) => x.topicId) || [],
        startEditingDatetimeUtc: questionBank.value?.startEditingDatetimeUtc || null,
        endEditingDatetimeUtc: questionBank.value?.endEditingDatetimeUtc || null,
    },
    {
        title: {
            required: createValidator(t, 'title', 'required'),
        },
        subjectId: {
            required: createValidator(t, 'select-subject', 'required'),
        },
        topicIds: {
            required: createValidator(t, 'select-topics', 'required'),
        },
    }
)
const body = validator.validation

watchDeep(questionBank, (value) => {
    if (value) {
        body.value.title.$model = value.title
        body.value.subjectId.$model = value.subject?.id || ''
        body.value.topicIds.$model = value.questionBankTopics?.map((x) => x.topicId) || []
        body.value.startEditingDatetimeUtc.$model = value.startEditingDatetimeUtc
        body.value.endEditingDatetimeUtc.$model = value.endEditingDatetimeUtc
        if (value.subject?.id) {
            topicStore.getTopics({
                subjectId: value.subject.id,
                Page: 1,
                PageSize: 500,
                Search: '',
                name: null,
            })
        }
    }
})

watch<string | null>(() => body.value.subjectId.$model as string | null, (value) => {
    if (value) {
        topicStore.getTopics({
            subjectId: value,
            Page: 1,
            PageSize: 500,
            Search: '',
            name: null,
        })
    }
})

const topics = computed(() => topicStore.topics)

const updateQuestionBank = async () => {
    const bodyData = validator.extractBody()
    if(bodyData.startEditingDatetimeUtc && bodyData.endEditingDatetimeUtc) {
        if(new Date(bodyData.startEditingDatetimeUtc) > new Date(bodyData.endEditingDatetimeUtc)) {
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
                <AppAutoCompleteField
                    v-model="body.subjectId.$model"
                    fetch-on-search
                    search-key="search"
                    :label="$t('select-subject')"
                    :items="subjectStore.subjects"
                    :errors="body.subjectId.$errors"
                    item-label="titleAr"
                    item-subtitle="titleEn"
                    item-value="id"
                    class="col-span-2"
                />
                <AppAutoCompleteField
                    v-model="body.topicIds.$model"
                    fetch-on-search
                    search-key="search"
                    multiple
                    :label="$t('select-topics')"
                    :items="topics"
                    :errors="body.topicIds.$errors"
                    item-label="titleAr"
                    item-subtitle="titleEn"
                    item-value="id"
                    class="col-span-2"
                />
            </div>

            <h1 class="mt-5 text-lg font-semibold">
                {{ $t('fill-creation-period-dates-optional') }}
            </h1>
            <div class="my-1 grid gap-3 md:grid-cols-2">
                <AppFieldAppInputField v-model="body.startEditingDatetimeUtc.$model" :errors="body.startEditingDatetimeUtc.$errors"
                    :label="$t('start-date-creation-qustion-bank')" :placeholder="$t('enter-start-date')" type="date" />
                <AppFieldAppInputField v-model="body.endEditingDatetimeUtc.$model" :errors="body.endEditingDatetimeUtc.$errors"
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
