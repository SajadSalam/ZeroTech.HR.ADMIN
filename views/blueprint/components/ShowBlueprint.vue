<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { tableDetailHeaders } from '~/views/blueprint/index'
import { useBlueprintStore } from '~/views/blueprint/store'
import { difficultyOptions } from '~/views/question-bank'
import {
    questionTypeOptions,
    type QuestionBankDto,
} from '~/views/question-bank/types/index'
import type { TopicDto } from '~/views/topics/types'
import type { BlueprintDetailes, BlueprintQuestionBank, BlueprintTopic } from '../types'
const { t } = useI18n()

interface Props {
  blueprintId: string | string[]
}

// Get props in <script setup>
const props = defineProps<Props>()

const blueprint = ref<BlueprintDetailes | null>(null)

const blueStore = useBlueprintStore()

const topics = ref<TopicDto[]>([])

const questionBank = ref<QuestionBankDto | null>(null)

const questionBanks = computed(() => {
  return blueprint.value?.questionBankNames
})

const questionsCount = computed(() => {
  if (!blueprint.value?.questionBanks) return 0
  return blueprint.value.questionBanks.reduce((acc: number, qb: BlueprintQuestionBank) => acc + qb.topics.reduce((acc: number, topic: BlueprintTopic) => acc + topic.numberOfQuestions, 0), 0)
})

onMounted(async () => {
  const id = Array.isArray(props.blueprintId) ? props.blueprintId[0] : props.blueprintId
  const result = await blueStore.getById(id)
  if (result) {
    blueprint.value = result
  }
})
</script>
<template>
  <div>
    <!-- Header Section -->
    <div class="mb-5 rounded-lg bg-white p-6 border">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-800">
          {{ blueprint?.title || 'Blueprint Title' }}
        </h1>
        <div class="flex flex-col items-center">
          <span class="text-sm text-gray-500"> {{ $t('maximum-grade') }}</span>
          <div class="rounded-full bg-green-100 px-4 py-1 text-lg font-bold text-green-600">
            {{ blueprint?.fullGrade || 0 }}
          </div>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-sm text-gray-500"> {{ $t('questions') }}</span>
          <div class="rounded-full bg-green-100 px-4 py-1 text-lg font-bold text-green-600">
            {{ questionsCount }}
          </div>
        </div>
      </div>
    </div>

    <div class="mb-5 rounded-lg bg-white p-6 border">
      <h2 class="text-lg font-bold">
        {{ $t('question-banks') }}
      </h2>

      <div class="my-3 grid gap-5 md:grid-cols-6">
        <div v-for="qb in blueprint?.questionBanks" :key="qb.questionBankId">
          <BaseTag
            color="primary"
            variant="pastel"
            size="lg"
            class="pa-3 flex cursor-pointer items-center gap-2 text-lg"
          >
            <div class="h-2 w-2 rounded-full bg-primary-500" />
            {{ qb.questionBankTitle }}
          </BaseTag>
        </div>
      </div>
    </div>

    <div class="mb-5 rounded-lg bg-white p-6 border">
      <h2 class="text-lg font-bold">
        {{ $t('settings') }}
      </h2>

      <div class="my-3 grid gap-5 md:grid-cols-6">
        <BaseTag
          v-if="blueprint?.displayResult"
          :color="blueprint?.displayResult ? 'primary' : 'muted'"
          variant="pastel"
          size="lg"
          class="pa-3 flex cursor-pointer items-center gap-2 text-lg"
        >
          <div
            class="h-2 w-2 rounded-full"
            :class="{
              'bg-primary-500': blueprint?.displayResult,
              'bg-muted-300': !blueprint?.displayResult,
            }"
          />
          {{ $t('display-result') }}
        </BaseTag>
        <BaseTag
          v-if="blueprint?.moveBetweenQuestion"
          :color="blueprint?.moveBetweenQuestion ? 'primary' : 'muted'"
          variant="pastel"
          size="lg"
          class="pa-3 flex cursor-pointer items-center gap-2 text-lg"
        >
          <div
            class="h-2 w-2 rounded-full"
            :class="{
              'bg-primary-500': blueprint?.moveBetweenQuestion,
              'bg-muted-300': !blueprint?.moveBetweenQuestion,
            }"
          />
          {{ $t('move-between-questions') }}
        </BaseTag>
        <BaseTag
          v-if="blueprint?.randomizeAnswer"
          :color="blueprint?.randomizeAnswer ? 'primary' : 'muted'"
          variant="pastel"
          size="lg"
          class="pa-3 flex cursor-pointer items-center gap-2 text-lg"
        >
          <div
            class="h-2 w-2 rounded-full"
            :class="{
              'bg-primary-500': blueprint?.randomizeAnswer,
              'bg-muted-300': !blueprint?.randomizeAnswer,
            }"
          />
          {{ $t('randomize-answers') }}
        </BaseTag>
        <BaseTag
          v-if="blueprint?.randomizeChoices"
          :color="blueprint?.randomizeChoices ? 'primary' : 'muted'"
          variant="pastel"
          size="lg"
          class="pa-3 flex cursor-pointer items-center gap-2 text-lg"
        >
          <div
            class="h-2 w-2 rounded-full"
            :class="{
              'bg-primary-500': blueprint?.randomizeChoices,
              'bg-muted-300': !blueprint?.randomizeChoices,
            }"
          />
          {{ $t('randomize-choices') }}
        </BaseTag>
      </div>
    </div>

    <div class="mb-5 rounded-lg bg-white p-6 border">
      <h2 class="text-lg font-bold">
        {{ $t('question-banks') }}
      </h2>

      <BaseCard
        v-for="(qb, questionBankIndex) in blueprint?.questionBanks"
        :key="qb.questionBankId"
        class="pa-3 my-2"
      >
        <BaseHeading>
          {{ qb.questionBankTitle }}
        </BaseHeading>

        <AppTable
          hide-no-data
          :headers="tableDetailHeaders($t)"
          :items="blueprint?.questionBanks[questionBankIndex]?.topics || []"
          class="mt-3"
        >
          <template #data-topicId="{ index }">
            {{ blueprint?.questionBanks[questionBankIndex].topics[index].topicTitleEn }}
          </template>
          <template #data-questionType="{ index }">
            <span>
              {{
                questionTypeOptions($t).find(
                  (type) =>
                    type.name ==
                    blueprint?.questionBanks[questionBankIndex].topics[index].questionType.toString()
                )?.label
              }}
            </span>
          </template>
          <template #data-difficulty="{ index }">
            <span>
              {{
                difficultyOptions($t).find(
                  (type) =>
                    type.name ==
                    blueprint?.questionBanks[questionBankIndex].topics[index].difficulty.toString()
                )?.label
              }}
            </span>
          </template>
        </AppTable>
      </BaseCard>
    </div>
  </div>
</template>

<style></style>
