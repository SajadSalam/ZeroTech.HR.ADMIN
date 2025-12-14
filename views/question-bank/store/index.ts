import { defineStore } from 'pinia'
import type { Employee } from '~/views/employee/types'
import type { } from '~/views/questions/types'
import { QuestionBankService } from '../service'
import {
    type QuestionBankCreateDto,
    type QuestionBankDto,
    type QuestionBankFilters,
} from '../types'
import { AssignType, type AssignForm } from '../types/assign'
import type { ImportQuestionResponse, ImportQuestionTypeOption } from '../types/import'

const questionBankService = new QuestionBankService()

export const useQuestionBankStore = defineStore('questionBank', () => {
  const questionBanks = ref<QuestionBankDto[]>([])
  const isLoading = ref(false)
  const filters = ref<QuestionBankFilters>({
    pageSize: 50,
    page: 1,
    search: null,
    subjectId: null,
    topics: [],
  })

  const isAssignDialogOpen = ref(false)
  const isCreateDialogOpen = ref(false)
  const isEditDialogOpen = ref(false)
  const selectedQuestionBankId = ref<string | null>(null)
  const selectedQuestionBank = ref<QuestionBankDto | null>(null)
  const assignType = ref<AssignType>(AssignType.Creator)
  const totalPages = ref(0)
  const isAddTopicOpen = ref(false)
  const importDialogOpen = ref(false)
  const getQuestionBanks = async (questionBankFilters: QuestionBankFilters) => {
    try {
      isLoading.value = true
      const response = await questionBankService.get(questionBankFilters)
      questionBanks.value = response.items
      totalPages.value = response.pageCount
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

  const updateQuestionBank = async (data: QuestionBankCreateDto) => {
    try {
      isLoading.value = true
      await questionBankService.update(selectedQuestionBankId.value!, data)
      await getQuestionBanks(filters.value)
    } catch (error) {
      throw error
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

  const assignEmployees = async (questionBankId: string, data: AssignForm) => {
    try {
      isLoading.value = true
      await questionBankService.assignEmployees(questionBankId, data)
      isAssignDialogOpen.value = false
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getAssignedEmployees = async (questionBankId: string, type: AssignType) => {
    try {
      isLoading.value = true
      const response = await questionBankService.getAssignedEmployees(questionBankId, type)
      return response.map((emp: Employee) => ({
        ...emp,
        empFullName: emp.name,
      }))
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }
  const getCountByQuestionBankId = async (questionBankId: string) => {
    try {
      isLoading.value = true
      return await questionBankService.getCountByQuestionBankId(questionBankId)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const getById = async (id: string) => {
    try {
      isLoading.value = true
      const response = await questionBankService.getById(id)
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }
  const removeTopic = async (questionBankId: string, topicId: string) => {
    try {
      isLoading.value = true
      await questionBankService.removeTopic(questionBankId, topicId)
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const addTopic = async (questionBankId: string, topicId: string) => {
    try {
      isLoading.value = true
      await questionBankService.addTopic(questionBankId, topicId)
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Download template for importing questions
   * @param option - The import question type option containing template endpoint
   */
  const downloadTemplate = async (questionBankId: string, option: ImportQuestionTypeOption) => {
    try {
      const blob = await questionBankService.downloadTemplate(
        questionBankId,
        option.templateEndpoint
      )

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Set filename based on question type
      const filename = option.templateEndpoint.split('-').join('_') + '_template.xlsx'
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      throw error
    }
  }

  /**
   * Import questions from Excel file
   * @param questionBankId - The question bank ID
   * @param file - The Excel file to import
   * @param option - The import question type option
   */
  const importQuestions = async (
    questionBankId: string,
    file: File,
    option: ImportQuestionTypeOption | null
  ): Promise<ImportQuestionResponse> => {
    try {
      if (!option) {
        throw new Error('Question type option is required')
      }

      const response = await questionBankService.importQuestions(
        questionBankId,
        file,
        option
      )

      return response
    } catch (error) {
      throw error
    }
  }

  return {
    questionBanks,
    isLoading,
    filters,
    isCreateDialogOpen,
    isEditDialogOpen,
    isAssignDialogOpen,
    selectedQuestionBankId,
    selectedQuestionBank,
    totalPages,
    getQuestionBanks,
    createQuestionBank,
    updateQuestionBank,
    deleteQuestionBank,
    assignType,
    assignEmployees,
    getAssignedEmployees,
    getCountByQuestionBankId,
    getById,
    removeTopic,
    addTopic,
    isAddTopicOpen,
    importDialogOpen,
    downloadTemplate,
    importQuestions,
  }
})
