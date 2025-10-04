<script setup lang="ts">
import { watch } from 'vue'
import type { QuestionDto } from '~/views/questions/types'
import { useQuestionStore } from '../../questions/store'
import { useAwardStore } from '../store'

const awardStore = useAwardStore()
const questionsStore = useQuestionStore()

// Loading states
const isDataLoading = ref(false)
const isBulkLinking = ref(false)
const linkingQuestionIds = ref<Set<string>>(new Set())

const unlinkedQuestions = ref<QuestionDto[]>([])
const linkedQuestions = ref<QuestionDto[]>([])
const getAndMapQuestions = async (isLinked = false) => {
    try {
        questionsStore.filters.pageSize = 1000
        if (isLinked) {
            questionsStore.filters.link_award_question = {
                award: {
                    documentId: {
                        $eq: awardStore.selectedAward?.documentId
                    }
                }
            }
        } else {
            questionsStore.filters.link_award_question = { $null: true }
        }

        await questionsStore.getQuestions();
        return questionsStore.questions
    } catch (error) {
        console.error('Error fetching questions:', error)
        return []
    }
}

const refreshQuestions = async () => {
    try {
        isDataLoading.value = true
        linkedQuestions.value = []
        unlinkedQuestions.value = []

        const [unlinked, linked] = await Promise.all([
            getAndMapQuestions(false),
            getAndMapQuestions(true)
        ])
        
        unlinkedQuestions.value = unlinked
        linkedQuestions.value = linked
    } finally {
        isDataLoading.value = false
    }
}



watch(() => awardStore.selectedAward, async (newAward) => {
    if (!newAward) return;
    await refreshQuestions()
}, { deep: true })

const toggleLinkQuestion = async (question: QuestionDto) => {
    if (linkingQuestionIds.value.has(question.documentId)) return
    
    try {
        linkingQuestionIds.value.add(question.documentId)
        const wasLinked = question.link_award_question != null

        if (question.link_award_question == null) {
            question.link_award_question = awardStore.selectedAward?.id || awardStore.selectedAward?.documentId
        } else {
            question.link_award_question = null
        }

        questionsStore.selectedQuestionId = question.documentId
        await questionsStore.updateQuestion({
            title: question.title,
            options: question.options,
            link_award_question: question.link_award_question,
            publishedAt: null,
        })

        // remove from list and add to the other list
        if (wasLinked) {
            // Was linked, now unlinked - move from linked to unlinked
            linkedQuestions.value = linkedQuestions.value.filter(q => q.documentId !== question.documentId)
            unlinkedQuestions.value.push(question)
        } else {
            // Was unlinked, now linked - move from unlinked to linked
            unlinkedQuestions.value = unlinkedQuestions.value.filter(q => q.documentId !== question.documentId)
            linkedQuestions.value.push(question)
        }
    } catch (error) {
        console.error('Error toggling question link:', error)
        // Optionally show a toast error message
    } finally {
        linkingQuestionIds.value.delete(question.documentId)
    }
}

const selectedQuestions = ref<string[]>([])
const toggleMultipleLinkQuestions = async (questions: string[], isLinked: boolean) => {
    if (isBulkLinking.value || questions.length === 0) return
    
    try {
        isBulkLinking.value = true
        
        await questionsStore.multipleUpdate(awardStore.selectedAward?.link_award_question?.documentId ||"", selectedQuestions.value)
        
        // Clear selection after successful operation
        selectedQuestions.value = []
        
        // Refresh the question lists
        await refreshQuestions()
        
    } catch (error) {
        console.error('Error in bulk link operation:', error)
        // Optionally show a toast error message
    } finally {
        isBulkLinking.value = false
    }
}

const selectAllQuestions = (value: boolean | boolean[] | undefined) => {
    if (value === true) {
        selectedQuestions.value = unlinkedQuestions.value.map(question => question.documentId)
    } else {
        selectedQuestions.value = []
    }
}
</script>

<template>
    <AppDialog v-model="awardStore.isLinkQuestionsDialogOpen" :title="$t('link-award-to-questions')" size="3xl"
        overflow-y="visible">

        <div class="flex items-center gap-2 mb-4">
            <BaseButton
                v-if="selectedQuestions.length > 0"
                color="primary" 
                :disabled="isBulkLinking || isDataLoading"
                :loading="isBulkLinking"
                @click="toggleMultipleLinkQuestions(selectedQuestions, true)">
                <Icon name="ph:link-duotone" class="size-4" />
                {{ $t('link-selected-questions') }} ({{ selectedQuestions.length }})
            </BaseButton>
            
            <BaseButton
                variant="outline"
                :disabled="isDataLoading || isBulkLinking"
                :loading="isDataLoading"
                @click="refreshQuestions">
                <Icon name="ph:arrow-clockwise-duotone" class="size-4" />
                {{ $t('refresh') }}
            </BaseButton>
        </div>
        <div class="grid grid-cols-2 gap-2 ">
            <div class="flex flex-col gap-2 border-e border-gray-200 p-2 max-h-120 overflow-y-auto">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-medium">{{ $t('unlinked-questions') }}</h3>
                    <BaseTag v-if="!isDataLoading" color="info">{{ unlinkedQuestions.length }}</BaseTag>
                </div>

                <BaseCheckbox 
                    :label="$t('select-all')" 
                    :disabled="isDataLoading || isBulkLinking || unlinkedQuestions.length === 0"
                    @update:model-value="selectAllQuestions" />
                
                <!-- Loading state -->
                <div v-if="isDataLoading" class="flex items-center justify-center py-8">
                    <div class="flex flex-col items-center gap-2">
                        <Icon name="ph:spinner-duotone" class="size-8 animate-spin text-primary-500" />
                        <p class="text-sm text-gray-500">{{ $t('loading-questions') }}</p>
                    </div>
                </div>

                <!-- Questions list -->
                <div v-else-if="unlinkedQuestions.length > 0" class="space-y-2">
                    <div class="flex flex-col gap-2 p-3 border border-gray-200 rounded-lg transition-all duration-200 hover:border-gray-300" 
                         v-for="question in unlinkedQuestions"
                         :key="`unlinked-${question.documentId}`"
                         :class="{ 'opacity-50': linkingQuestionIds.has(question.documentId) }">

                        <h3 class="text-md font-medium">{{ question.title }}</h3>
                        
                            <BaseTag color="success">
                                {{ $t('correct-answer') }}:
                                {{question.options.find(option => option.isTrueAnswer)?.title}}
                            </BaseTag>
                        <div class="flex items-center gap-2 w-full">
                            <BaseCheckbox 
                                v-model="selectedQuestions" 
                                :value="question.documentId"
                                :disabled="isBulkLinking || linkingQuestionIds.has(question.documentId)" />

                            <BaseTag>
                                {{ question.options.length }}
                                {{ $t('options') }}
                            </BaseTag>
                            <BaseButton 
                                size="sm" 
                                color="success"
                                variant="outline" 
                                :disabled="isBulkLinking || linkingQuestionIds.has(question.documentId)"
                                :loading="linkingQuestionIds.has(question.documentId)"
                                @click="toggleLinkQuestion(question)">
                                <Icon name="ph:link-duotone" />
                                {{ $t('link') }}
                            </BaseButton>
                        </div>
                    </div>
                </div>

                <!-- No data state -->
                <div v-else class="flex items-center justify-center py-8">
                    <div class="flex flex-col items-center gap-2">
                        <Icon name="ph:question-duotone" class="size-8 text-gray-400" />
                        <p class="text-sm text-gray-500">{{ $t('no-data-found') }}</p>
                    </div>
                </div>
            </div>
            <div class="flex flex-col gap-2 p-2 max-h-120 overflow-y-auto">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-medium">{{ $t('linked-questions') }}</h3>
                    <BaseTag v-if="!isDataLoading" color="success">{{ linkedQuestions.length }}</BaseTag>
                </div>
                
                <!-- Loading state -->
                <div v-if="isDataLoading" class="flex items-center justify-center py-8">
                    <div class="flex flex-col items-center gap-2">
                        <Icon name="ph:spinner-duotone" class="size-8 animate-spin text-primary-500" />
                        <p class="text-sm text-gray-500">{{ $t('loading') }}</p>
                    </div>
                </div>

                <!-- Questions list -->
                <div v-else-if="linkedQuestions.length > 0" class="space-y-2">
                    <div class="flex flex-col gap-2 p-3 border border-gray-200 rounded-lg transition-all duration-200 hover:border-gray-300" 
                         v-for="question in linkedQuestions"
                         :key="`linked-${question.documentId}`"
                         :class="{ 'opacity-50': linkingQuestionIds.has(question.documentId) }">

                        <h3 class="text-md font-medium">{{ question.title }}</h3>
                        
                            <BaseTag color="success">
                                {{ $t('correct-answer') }}:
                                {{question.options.find(option => option.isTrueAnswer)?.title}}
                            </BaseTag>
                        <div class="flex items-center gap-2 w-full">
                            <BaseTag>
                                {{ question.options.length }}
                                {{ $t('options') }}
                            </BaseTag>
                            <BaseButton 
                                size="sm" 
                                color="danger"
                                variant="outline" 
                                :disabled="isBulkLinking || linkingQuestionIds.has(question.documentId)"
                                :loading="linkingQuestionIds.has(question.documentId)"
                                @click="toggleLinkQuestion(question)">
                                <Icon name="ph:link-break-duotone" />
                                {{ $t('unlink') }}
                            </BaseButton>
                        </div>
                    </div>
                </div>

                <!-- No data state -->
                <div v-else class="flex items-center justify-center py-8">
                    <div class="flex flex-col items-center gap-2">
                        <Icon name="ph:check-circle-duotone" class="size-8 text-gray-400" />
                        <p class="text-sm text-gray-500">{{ $t('no-data-found') }}</p>
                    </div>
                </div>
            </div>
        </div>
    

        <template #actions>
            <div class="flex items-center justify-between w-full">
                <div class="flex items-center gap-2 text-sm text-gray-500">
                    <span v-if="!isDataLoading">
                        {{ $t('linked') }}: {{ linkedQuestions.length }} | 
                        {{ $t('unlinked') }}: {{ unlinkedQuestions.length }}
                    </span>
                    <span v-if="selectedQuestions.length > 0">
                        | {{ $t('selected') }}: {{ selectedQuestions.length }}
                    </span>
                </div>
                
                <BaseButton 
                    color="primary" 
                    class="gap-1" 
                    :disabled="isDataLoading || isBulkLinking"
                    @click="awardStore.isLinkQuestionsDialogOpen = false">
                    <Icon name="ph:check-duotone" class="size-5" />
                    {{ $t('close') }}
                </BaseButton>
            </div>
        </template>
    </AppDialog>
</template>
