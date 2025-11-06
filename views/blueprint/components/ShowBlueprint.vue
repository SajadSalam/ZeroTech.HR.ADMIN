<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { tableDetailHeaders } from '~/views/blueprint/index'
import { useBlueprintStore } from '~/views/blueprint/store'
import type { Blueprint, BlueprintDto } from '~/views/blueprint/types'
import { difficultyOptions, knowledgeLevelOptions } from '~/views/question-bank'
import {
    questionTypeOptions,
    type QuestionBankDto,
    type QuestionBankTopicDto,
} from '~/views/question-bank/types/index'
import type { TopicDto } from '~/views/topics/types'
const { t } = useI18n()

interface Props {
  blueprintId: number
}

// Get props in <script setup>
const props = defineProps<Props>()

const blueprint = ref<BlueprintDto | null>(null)

const blueStore = useBlueprintStore()

const topics = ref<TopicDto[]>([])

const questionBank = ref<QuestionBankDto | null>(null)

const questionBanks = computed(() => {
  return blueprint.value?.questionBanks
})

onMounted(async () => {
  blueprint.value = (await blueStore.getById(props.blueprintId.toString())) as BlueprintDto
})
</script>
<template>
  <div>
    <!-- Header Section -->
    <div class="mb-5 rounded-lg bg-white p-6 shadow">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-800">
          {{ blueprint?.name || 'Blueprint Title' }}
        </h1>
        <div class="flex flex-col items-center">
          <span class="text-sm text-gray-500"> {{ $t('success-grade') }}</span>
          <div class="rounded-full bg-green-100 px-4 py-1 text-lg font-bold text-green-600">
            {{ blueprint?.successGrade || 0 }}
          </div>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-sm text-gray-500"> {{ $t('question-banks') }}</span>
          <div class="rounded-full bg-green-100 px-4 py-1 text-lg font-bold text-green-600">
            {{ blueprint?.questionBanks.length }}
          </div>
        </div>
      </div>
    </div>

    <div class="mb-5 rounded-lg bg-white p-6 shadow">
      <h2 class="text-lg font-bold">
        {{ $t('question-banks') }}
      </h2>

      <div class="my-3 grid gap-5 md:grid-cols-6">
        <div v-for="qb in blueprint?.questionBanks" :key="qb.id">
          <BaseTag
            color="primary"
            variant="pastel"
            size="lg"
            class="pa-3 flex cursor-pointer items-center gap-2 text-lg"
          >
            <div class="h-2 w-2 rounded-full bg-primary-500" />
            {{ qb.questionBank.title }}
          </BaseTag>
        </div>
      </div>
    </div>

    <div class="mb-5 rounded-lg bg-white p-6 shadow">
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

    <div class="mb-5 rounded-lg bg-white p-6 shadow">
      <h2 class="text-lg font-bold">
        {{ $t('question-banks') }}
      </h2>

      <BaseCard
        v-for="(qb, questionBankIndex) in blueprint?.questionBanks"
        :key="qb.id"
        class="pa-3 my-2"
      >
        <BaseHeading>
          {{ qb.questionBank.title }}
        </BaseHeading>

        <AppTable
          hide-no-data
          :headers="tableDetailHeaders($t)"
          :items="blueprint?.questionBanks[questionBankIndex].topics"
          class="mt-3"
        >
          <template #data-topicId="{ index }">
            {{ blueprint?.questionBanks[questionBankIndex].topics[index].topicN }}
          </template>
          <template #data-questionType="{ index }">
            <span>
              {{
                questionTypeOptions($t).find(
                  (type) =>
                    type.value ===
                    blueprint?.questionBanks[questionBankIndex].topics[index].questionType
                )?.label
              }}
            </span>
          </template>
          <template #data-difficulty="{ index }">
            <span>
              {{
                difficultyOptions($t).find(
                  (type) =>
                    type.value ===
                    blueprint?.questionBanks[questionBankIndex].topics[index].difficulty
                )?.label
              }}
            </span>
          </template>
          <template #data-knowledgeLevelId="{ index }">
            <span>
              {{
                blueprint?.questionBanks[questionBankIndex].topics[index].knowledgeLevel?.name || '-'
              }}
            </span>
          </template>
        </AppTable>
      </BaseCard>
    </div>
  </div>
</template>

<style></style>
