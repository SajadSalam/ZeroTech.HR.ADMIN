<script lang="ts" setup>
import { useExamStore } from '../store/index'

const examStore = useExamStore()

const isLoading = computed(() => examStore.isLoading)
const emit = defineEmits(['refresh'])
const reshuffleQuestions = async () => {
    await examStore.reshuffleQuestions()
    emit('refresh')
    examStore.isQuestionReshuffleDialogOpen = false
}
</script>

<template>
    <AppDialog v-model="examStore.isQuestionReshuffleDialogOpen" :title="$t('reshuffle-questions')" size="md"
        overflow-y="visible">
        <div class="flex flex-col rounded-3xl p-3">
            <span>{{ $t('are-you-sure-you-want-to-reshuffle-the-questions') }}</span>
        </div>
        <div class="flex justify-end w-full">
            <BaseButton class="mt-5" :loading="isLoading" color="primary" size="lg" @click="reshuffleQuestions">
                {{ $t('reshuffle-questions') }}
            </BaseButton>
        </div>
    </AppDialog>
</template>

<style></style>
