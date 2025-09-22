<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppInputField from '~/components/app-field/AppInputField.vue'
import { useAppToaster } from '~/services/toaster/toaster'
import { createValidator } from '~/services/validationWithI18n'
import { Validator } from '~/services/validator'
import { tableCreateHeaders } from '~/views/blueprint/index'
import { useBlueprintStore } from '~/views/blueprint/store'
import type { Blueprint, BlueprintQuestionBank } from '~/views/blueprint/types/index'
import { difficultyOptions } from '~/views/question-bank'
import { useQuestionBankStore } from '~/views/question-bank/store'
import {
    questionTypeOptions,
    type QuestionBankDto,
    type QuestionBankTopicDto,
} from '~/views/question-bank/types/index'
import { Difficulty } from '~/views/question-bank/types/question'
import type { TopicDto } from '~/views/topics/types'
definePageMeta({
    title: 'blueprints',
    description: 'create-and-manage-blueprints',
})

const { t } = useI18n()

const questionBankStore = useQuestionBankStore()

const addTopic = (index: number) => {
    body.value.questionBanks.$model[index].topics.push({
        topicId: '',
        questionType: null,
        difficulty: Difficulty.Easy,
        knowledgeLevelId: '',
        numberOfQuestions: 1,
        grade: 1,
    })
}

const removeTopic = (questionBankIndex: number, topicIndex: number) => {
    body.value.questionBanks.$model[questionBankIndex].topics.splice(topicIndex, 1)
}

const topics = ref<{ questionBankId: string; topics: TopicDto[] }[]>([])
const questionBanks = ref<QuestionBankDto[]>([])

watchDeep(
    () => questionBanks.value,
    async () => {
        const existingIds = new Set(questionBanks.value.map((qb: QuestionBankDto) => qb.id))
        const bodyQuestionBanks = body.value.questionBanks.$model as BlueprintQuestionBank[]

        questionBanks.value.forEach(async ({ id }: { id: string }) => {
            if (!bodyQuestionBanks.some((qb: BlueprintQuestionBank) => qb.questionBankId === id)) {
                bodyQuestionBanks.push({ questionBankId: id, topics: [] })
                await questionBankStore.getQuestionBank(id)

                const topicsBank: TopicDto[] =
                    questionBankStore.selectedQuestionBank?.questionBankTopics.map(
                        (topic: QuestionBankTopicDto) => topic.topic
                    ) as TopicDto[]
                topics.value.push({ questionBankId: id, topics: topicsBank })
            }
        })

        body.value.questionBanks.$model = bodyQuestionBanks.filter((qb: BlueprintQuestionBank) =>
            existingIds.has(qb.questionBankId)
        )

        topics.value = topics.value.filter((topic: { questionBankId: string; topics: TopicDto[] }) =>
            existingIds.has(topic.questionBankId)
        )
    }
)
const quesitonBankById = (id: string): QuestionBankDto => {
    return questionBanks.value.find((qb: QuestionBankDto) => qb.id === id) as QuestionBankDto
}

const topicsByQuestionBankId = (id: string): TopicDto[] => {
    return topics.value.find(
        (topic: { questionBankId: string; topics: TopicDto[] }) => topic.questionBankId === id
    )?.topics as TopicDto[]
}
const blueprintStore = useBlueprintStore()
const router = useRouter()

const validator = new Validator<Blueprint>(
    {
        questionBanks: [],
        displayResult: false,
        moveBetweenQuestion: false,
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

const calculateTotalGrade = (): number => {
    return (body.value.questionBanks.$model as QuestionBankDto[]).reduce(
        (sum: number, questionBank) =>
            sum +
            questionBank.topics.reduce(
                (topicSum: number, topic) => topicSum + topic.grade * topic.numberOfQuestions,
                0
            ),
        0
    )
}

const submit = async () => {
    const isValid = await body.value.$validate()
    if (!isValid) return
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
        await blueprintStore.create(validator.extractBody())
        router.push('/blueprint')
    } catch (error) { }
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
        <AppAutoCompleteField fetch-on-search search-key="search" get-url="/question-bank" item-label="title"
            item-value="id" multiple :label="$t('question-banks')" :placeholder="$t('question-banks')"
            :errors="body.questionBanks.$errors" @update:object-value="questionBanks = $event" />
        <p class="text-muted-500">
            {{ $t('choice-at-least-one-question-bank-to-add-settings-for-the-blueprint') }}
        </p>
        <BaseCard v-for="(questionBank, questionBankIndex) in body.questionBanks.$model"
            :key="questionBank.questionBankId" class="pa-3 my-2">
            <BaseHeading>
                {{ $t('bluebrint-settings-for-question-bank') }} (
                {{ quesitonBankById(questionBank.questionBankId).title }} )
            </BaseHeading>
            <AppTable hide-no-data :headers="tableCreateHeaders($t)"
                :items="body.questionBanks.$model[questionBankIndex].topics" class="mt-3">
                <template #data-topicId="{ index }">
                    <AppAutoCompleteField v-model="body.questionBanks.$model[questionBankIndex].topics[index].topicId"
                        :items="topicsByQuestionBankId(questionBank.questionBankId)" item-label="name"
                        item-value="id" />
                </template>
                <template #data-questionType="{ index }">
                    <AppAutoCompleteField
                        v-model="body.questionBanks.$model[questionBankIndex].topics[index].questionType" :items="questionTypeOptions($t).filter((option) =>
                            quesitonBankById(questionBank.questionBankId).questionTypes.includes(option.value)
                        )
                            " item-label="label" item-value="value" />
                </template>
                <template #data-difficulty="{ index }">
                    <div class="flex items-center gap-2">
                        <AppAutoCompleteField
                            v-model="body.questionBanks.$model[questionBankIndex].topics[index].difficulty"
                            :items="difficultyOptions($t)" item-label="label" item-value="value" />
                        <BaseButtonIcon size="sm" color="none" class="text-red-500"
                            @click="removeTopic(questionBankIndex, index)">
                            <Icon name="tabler-circle-x" class="size-8" />
                        </BaseButtonIcon>
                    </div>
                </template>
                <template #data-knowledgeLevelId="{ index }">
                    <AppAutoCompleteField
                        v-model="body.questionBanks.$model[questionBankIndex].topics[index].knowledgeLevelId"
                        :placeholder="$t('select-a-knowledge')" get-url="/knowledgelevel" item-label="name"
                        item-value="id" />
                </template>
                <template #data-numberOfQuestions="{ index }">
                    <AppInputField
                        v-model="body.questionBanks.$model[questionBankIndex].topics[index].numberOfQuestions"
                        type="number" required :label="$t('number-of-questions')" />
                </template>
                <template #data-grade="{ index }">
                    <AppInputField v-model="body.questionBanks.$model[questionBankIndex].topics[index].grade"
                        type="number" required :label="$t('grade')" />
                </template>
            </AppTable>
            <div class="flex justify-end">
                <BaseButton color="primary" class="gap-1" variant="pastel" @click="addTopic(questionBankIndex)">
                    <Icon name="ph:upload-simple-duotone" class="size-5" />
                    {{ $t('add-settings') }}
                </BaseButton>
            </div>
        </BaseCard>

        <h2 class="mt-5 text-lg font-bold">
            {{ $t('more-settings') }}
        </h2>
        <p class="text-sm text-muted-500">
            {{ $t('select-the-options-of-the-exam') }}
        </p>
        <div class="my-3 grid gap-5 md:grid-cols-6">
            <BaseTag :color="body.displayResult.$model ? 'primary' : 'muted'" variant="pastel" size="lg"
                class="pa-3 flex cursor-pointer items-center gap-2 text-lg"
                @click="body.displayResult.$model = !body.displayResult.$model">
                <div class="h-2 w-2 rounded-full" :class="{
                    'bg-primary-500': body.displayResult.$model,
                    'bg-muted-300': !body.displayResult.$model,
                }" />
                {{ $t('display-result') }}
            </BaseTag>
            <BaseTag :color="body.moveBetweenQuestion.$model ? 'primary' : 'muted'" variant="pastel" size="lg"
                class="pa-3 flex cursor-pointer items-center gap-2 text-lg"
                @click="body.moveBetweenQuestion.$model = !body.moveBetweenQuestion.$model">
                <div class="h-2 w-2 rounded-full" :class="{
                    'bg-primary-500': body.moveBetweenQuestion.$model,
                    'bg-muted-300': !body.moveBetweenQuestion.$model,
                }" />
                {{ $t('move-between-questions') }}
            </BaseTag>
            <BaseTag :color="body.randomizeAnswer.$model ? 'primary' : 'muted'" variant="pastel" size="lg"
                class="pa-3 flex cursor-pointer items-center gap-2 text-lg"
                @click="body.randomizeAnswer.$model = !body.randomizeAnswer.$model">
                <div class="h-2 w-2 rounded-full" :class="{
                    'bg-primary-500': body.randomizeAnswer.$model,
                    'bg-muted-300': !body.randomizeAnswer.$model,
                }" />
                {{ $t('randomize-answers') }}
            </BaseTag>
            <BaseTag :color="body.randomizeChoices.$model ? 'primary' : 'muted'" variant="pastel" size="lg"
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

    <BaseButton color="primary" class="w-full gap-1" @click="submit">
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        {{ $t('save-change') }}
    </BaseButton>
</template>

<style>
.max-w-5xl {
    max-width: 75rem !important;
}
</style>
