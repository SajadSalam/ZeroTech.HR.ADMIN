import { QuestionService } from '../service'
import type { Question, QuestionDto, QuestionFilters } from '../types'

const questionService = new QuestionService()
export const useQuestionStore = defineStore('question', () => {
    const questions = ref<QuestionDto[]>([])
    const isLoading = ref(false)
    const filters = ref<QuestionFilters>({
        pageSize: 10,
        pageNumber: 1,
        title: null,
    })
    const isCreateDialogOpen = ref(false)
    const isEditDialogOpen = ref(false)
    const isImportDialogOpen = ref(false)
    const selectedQuestionId = ref<string | null>(null)
    const selectedQuestion = ref<QuestionDto | null>(null)
    const totalPages = ref(0)

    const getQuestions = async () => {
        try {
            isLoading.value = true
            const response = await questionService.get(filters.value)
            questions.value = response.data
            totalPages.value = response.pagesCount
        } catch (error) {
        } finally {
            isLoading.value = false
        }
    }

    const createQuestion = async (data: Question) => {
        try {
            isLoading.value = true
            data.publishedAt = new Date().toISOString()
            await questionService.create(data)
            await getQuestions()
        } catch (error) {
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const updateQuestion = async (data: Question) => {
        try {
            isLoading.value = true
            data.publishedAt = new Date().toISOString()
            data.options = data.options.map(option => ({
                title: option.title,
                isTrueAnswer: option.isTrueAnswer,
            }))

            await questionService.update(selectedQuestionId.value!, data)
            await getQuestions()
        } catch (error) {
        } finally {
            isLoading.value = false
        }
    }

    const multipleUpdate = async (link_award_question: string, questionIds: string[]) => {
        try {
            isLoading.value = true
            await questionService.multipleUpdate(link_award_question, questionIds)
            await getQuestions()
        } catch (error) {
        } finally {
            isLoading.value = false
        }
    }

    const deleteQuestion = async (id: string) => {
        try {
            isLoading.value = true
            await questionService.delete(id)
            await getQuestions()
        } catch (error) {
        } finally {
            isLoading.value = false
        }
    }

    const importQuestions = async (file: string) => {
        await questionService.importQuestions(file)
    }

    return {
        questions,
        isLoading,
        filters,
        getQuestions,
        createQuestion,
        updateQuestion,
        deleteQuestion,
        isCreateDialogOpen,
        isEditDialogOpen,
        selectedQuestionId,
        selectedQuestion,
        totalPages,
        isImportDialogOpen,
        importQuestions,
        multipleUpdate,
    }
})
