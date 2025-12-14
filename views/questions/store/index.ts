import { defineStore } from 'pinia'
import type { QuestionFilters } from '../service'
import { QuestionService } from '../service'
import { AuditStatus, type Difficulty, type Question, type QuestionDto, type QuestionType } from '../types'
import type { QuestionRequest } from '../types/request'
import { auditStatusFromString, difficultyFromString, difficultyToString, questionTypeFromString, questionTypeToString } from '../utils'

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
  const selectedQuestion = ref<Question | null>(null)
  const isRejectionDialogOpen = ref(false)
  const isRequestUpdateDialogOpen = ref(false)
  const totalPages = ref(0)

  const getQuestions = async (questionFilters: QuestionFilters) => {
    try {
      isLoading.value = true
      const response = await questionService.get(questionFilters)
      questions.value = response.items.map((question: Question) => {
        return {
          ...question,
          questionType: questionTypeFromString(question.questionType as string) as QuestionType,
          difficulty: difficultyFromString(question.difficulty as string) as Difficulty,
          status: auditStatusFromString(question.status as string) as AuditStatus,
        }
      }) as QuestionDto[]
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
      data.difficulty = difficultyToString(parseInt(data.difficulty) as Difficulty)
      data.questionType = questionTypeToString(parseInt(data.questionType) as QuestionType)
      await questionService.update(selectedQuestionId.value!, data as QuestionRequest)
      await getQuestions(filters.value as QuestionFilters)
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

  const approveQuestion = async (id: string) => {
    try {
      isLoading.value = true
      await questionService.approve(id)
      await getQuestions(filters.value)
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const cancelQuestion = async (id: string, reason: string) => {
    try {
      isLoading.value = true
      await questionService.cancel(id, reason)
      await getQuestions(filters.value)
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const requestUpdateQuestion = async (id: string, reason: string) => {
    try {
      isLoading.value = true
      await questionService.requestUpdate(id, reason)
      await getQuestions(filters.value)
    } catch (error) {
      throw error
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
    isRejectionDialogOpen,
    isRequestUpdateDialogOpen,
    selectedQuestionId,
    selectedQuestion,
    totalPages,
    getQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    approveQuestion,
    cancelQuestion,
    requestUpdateQuestion,
  }
})

