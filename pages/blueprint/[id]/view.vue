<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ShowBlueprint from '~/views/blueprint/components/ShowBlueprint.vue'
import { tableDetailHeaders } from '~/views/blueprint/index'
import { useBlueprintStore } from '~/views/blueprint/store'
import type { Blueprint, BlueprintDto } from '~/views/blueprint/types'
import { difficultyOptions } from '~/views/question-bank'
import {
    questionTypeOptions,
    type QuestionBankDto,
    type QuestionBankTopicDto,
} from '~/views/question-bank/types/index'
import type { TopicDto } from '~/views/topics/types'
const { t } = useI18n()
definePageMeta({
  title: 'blueprint_details',
  description: 'blueprint_details_description',
})
const route = useRoute()
const blueprintId = computed(() => route.params.id)

</script>
<template>
  <div>
    <ShowBlueprint :blueprint-id="blueprintId" />
  </div>
</template>

<style></style>
