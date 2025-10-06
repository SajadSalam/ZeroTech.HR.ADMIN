import { defineStore } from 'pinia'
import type { ImportQuestionTypeOption } from '~/views/question-bank/types'
import type {
    Question,
    QuestionDto,
    QuestionFilters,
} from '~/views/question-bank/types/question'
import { QuestionBankService } from '../service'
import {
    AssignType,
    type AssignDto,
    type AssignForm,
    type QuestionBank,
    type QuestionBankCreateDto,
    type QuestionBankDetailedDto,
    type QuestionBankDto,
    type QuestionBankFilters,
    type QuestionBankTopicDto,
    type QuestionBankTopicUpdate,
} from '../types'

const questionBankService = new QuestionBankService()

export const useQuestionBankStore = defineStore('questionBank', () => {
  const questionBanks = ref<QuestionBankDto[]>([])
  const questions = ref<QuestionDto[]>([])
  const selectedTopic = ref<QuestionBankTopicDto | null>(null)
  const isLoading = ref(false)
  const filters = ref<QuestionBankFilters>({
    pageSize: 10,
    pageNumber: 1,
    search: null,
    subjectId: null,
    topics: [],
  })
  const isCreateDialogOpen = ref(false)
  const isEditDialogOpen = ref(false)
  const isRejectionDialogOpen = ref(false)
  const selectedQuestionBankId = ref<string | null>(null)
  const selectedQuestionBank = ref<QuestionBankDetailedDto | QuestionBankDto | null>(null)
  const selectedQuestion = ref<Question | null>(null)
  const isAssignDialogOpen = ref(false)
  const isDeleteTopicOpen = ref(false)
  const isAddTopicOpen = ref(false)
  const assignType = ref<AssignType>(AssignType.Creator)
  const totalPages = ref(0)
  const isViewDialogOpen = ref(false)
  const assign = ref<AssignDto[]>([])
  const importDialogOpen = ref(false)

  const questionFilters = ref<QuestionFilters>({
    difficulty: null,
    knowledgeLevelId: null,
    pageNumber: 1,
    pageSize: 10,
    title: null,
    topicId: null,
    type: null,
    questionBankId: null,
  })

  const getQuestionBanks = async (questionBankFilters: QuestionBankFilters) => {
    try {
      isLoading.value = true
      const response = await questionBankService.get(questionBankFilters)
      questionBanks.value = response.data
      totalPages.value = response.pagesCount
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }
  const getQuestions = async (questionsFilters: QuestionFilters) => {
    try {
      isLoading.value = true
      const response = await questionBankService.getQuestions(questionsFilters)
      questions.value = response.data
      totalPages.value = response.pagesCount
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const createQuestionBank = async (data: QuestionBankCreateDto) => {
    try {
      isLoading.value = true
      await questionBankService.create(data)
      await getQuestionBanks(filters.value)
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateQuestionBank = async (data: QuestionBank) => {
    try {
      isLoading.value = true
      await questionBankService.update(selectedQuestionBankId.value!, data)
      await getQuestionBanks(filters.value)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const deleteQuestionBank = async (id: string) => {
    try {
      isLoading.value = true
      await questionBankService.delete(id)
      await getQuestionBanks(filters.value)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }
  const getQuestionBank = async (id: string) => {
    try {
      isLoading.value = true
      const response = await questionBankService.getDetailed(id)
      selectedQuestionBank.value = response
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const getQuestionBankQuestions = async (
    questionBankId: string,
    pageNumber: number,
    pageSize: number,
    topicId?: string
  ) => {
    try {
      isLoading.value = true
      const response = await questionBankService.getQuestionBankQuestions(
        questionBankId,
        pageNumber,
        pageSize,
        topicId
      )
      questions.value = response.data
      totalPages.value = response.pagesCount
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const saveQuestions = async (questionBankId: string, questions: Question[], toBeDeletedIds: string[] = []) => {
    try {
      isLoading.value = true
      await questionBankService.saveQuestions(
        questionBankId,
        questions,
        toBeDeletedIds
      )
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const approveQuestion = async (questionId: string) => {
    try {
      isLoading.value = true
      const res = await questionBankService.approveQuestion(questionId)
      questions.value.find((x) => x.id === questionId)!.auditStatus = res.auditStatus
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }
  const rejectQuestion = async (questionId: string, body: { rejectReason?: string | null }) => {
    try {
      isLoading.value = true
      const res = await questionBankService.rejectQuestion(questionId, body)
      questions.value.find((x) => x.id === questionId)!.auditStatus = res.auditStatus
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }
  const assignAuditor = async (questionBankId: string, data: AssignForm[]) => {
    try {
      isLoading.value = true
      await questionBankService.assignAuditor(questionBankId, data)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const assignCreator = async (questionBankId: string, data: AssignForm[]) => {
    try {
      isLoading.value = true
      await questionBankService.assignCreator(questionBankId, data)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const getAssigns = async (questionBankId: string, type: AssignType) => {
    try {
      isLoading.value = true
      const response = await questionBankService.getAssigns(questionBankId, type)
      assign.value = response.data
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const addTopic = async (questionBankId: string, topic: QuestionBankTopicUpdate) => {
    try {
      isLoading.value = true
      const response = await questionBankService.addTopic(questionBankId, topic)
      return response
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }
  const removeTopic = async (questionBankId: string, topicId: string) => {
    try {
      isLoading.value = true
      const response = await questionBankService.removeTopic(questionBankId, topicId)
      return response
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const importQuestions = async (
    questionBankId: string,
    file: File,
    questionTypeOption: ImportQuestionTypeOption
  ) => {
    try {
      isLoading.value = true
      await questionBankService.importQuestions(questionBankId, file, questionTypeOption)
    } catch (error: any) {
      throw error // Re-throw the error to handle it in the component
    } finally {
      isLoading.value = false
    }
  }

  const downloadTemplate = async (questionTypeOption: ImportQuestionTypeOption) => {
    try {
      isLoading.value = true
      await questionBankService.downloadTemplate(questionTypeOption)
    } catch (error: any) {
      throw error // Re-throw the error to handle it in the component
    } finally {
      isLoading.value = false
    }
  }

  return {
    questionBanks,
    isLoading,
    filters,
    isViewDialogOpen,
    isCreateDialogOpen,
    selectedQuestion,
    isEditDialogOpen,
    selectedQuestionBankId,
    selectedQuestionBank,
    totalPages,
    isAssignDialogOpen,
    isRejectionDialogOpen,
    assignType,
    assign,
    questionFilters,
    selectedTopic,
    isDeleteTopicOpen,
    isAddTopicOpen,
    getQuestionBanks,
    getQuestionBank,
    getQuestionBankQuestions,
    createQuestionBank,
    saveQuestions,
    updateQuestionBank,
    deleteQuestionBank,
    getQuestions,
    questions,
    approveQuestion,
    rejectQuestion,
    assignAuditor,
    assignCreator,
    getAssigns,
    addTopic,
    removeTopic,
    importDialogOpen,
    importQuestions,
    downloadTemplate,
  }
})
