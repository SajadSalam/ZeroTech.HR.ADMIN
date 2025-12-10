import { defineStore } from 'pinia'
import type { QuestionFilters } from '../service'
import { QuestionService } from '../service'
import type { QuestionDto } from '../types'
import type { QuestionRequest } from '../types/request'

const questionService = new QuestionService()

export const useQuestionStore = defineStore('question', () => {
  const questions = ref<QuestionDto[]>([])
  const isLoading = ref(false)
  const filters = ref<QuestionFilters>({
    pageSize: 50,
    page: 1,
    search: null,
    questionBankId: null,
    topicId: null,
    questionType: null,
    difficulty: null,
  })

  const isCreateDialogOpen = ref(false)
  const isEditDialogOpen = ref(false)
  const selectedQuestionId = ref<string | null>(null)
  const selectedQuestion = ref<QuestionDto | null>(null)
  const totalPages = ref(0)

  const getQuestions = async (questionFilters: QuestionFilters) => {
    try {
      isLoading.value = true
      const response = await questionService.get(questionFilters)
      questions.value = response.items
      totalPages.value = response.pageCount
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const getQuestionById = async (id: string) => {
    try {
      isLoading.value = true
      const response = await questionService.getById(id)
      selectedQuestion.value = response
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const createQuestion = async (data: QuestionRequest) => {
    try {
      isLoading.value = true
      await questionService.create(data)
      await getQuestions(filters.value)
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateQuestion = async (data: QuestionRequest) => {
    try {
      isLoading.value = true
      await questionService.update(selectedQuestionId.value!, data)
      await getQuestions(filters.value)
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deleteQuestion = async (id: string) => {
    try {
      isLoading.value = true
      await questionService.delete(id)
      await getQuestions(filters.value)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  return {
    questions,
    isLoading,
    filters,
    isCreateDialogOpen,
    isEditDialogOpen,
    selectedQuestionId,
    selectedQuestion,
    totalPages,
    getQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
  }
})

