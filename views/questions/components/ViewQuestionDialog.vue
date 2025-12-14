<script setup lang="ts">
import { useQuestionStore } from '../store/index'
import ViewQuestion from './ViewQuestion.vue'

const questionsStore = useQuestionStore()
</script>

<template>
  <AppDialog
    v-model="questionsStore.isEditDialogOpen"
    :title="$t('view-question')"
    size="2xl"
    overflow-y="auto"
  >
    <ViewQuestion 
      v-if="questionsStore.selectedQuestion" 
      :question="questionsStore.selectedQuestion" 
    />
  </AppDialog>
</template>

