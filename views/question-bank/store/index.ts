import { defineStore } from 'pinia'
import type { } from '~/views/questions/types'
import { QuestionBankService } from '../service'
import {
    type QuestionBankCreateDto,
    type QuestionBankDetailedDto,
    type QuestionBankDto,
    type QuestionBankFilters,
} from '../types'

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
  const isCreateDialogOpen = ref(false)
  const isEditDialogOpen = ref(false)
  const selectedQuestionBankId = ref<string | null>(null)
  const selectedQuestionBank = ref<QuestionBankDetailedDto | QuestionBankDto | null>(null)
  const totalPages = ref(0)

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




  return {
    questionBanks,
    isLoading,
    filters,
    isCreateDialogOpen,
    isEditDialogOpen,
    selectedQuestionBankId,
    selectedQuestionBank,
    totalPages,
    getQuestionBanks,
    getQuestionBank,
    createQuestionBank,
    updateQuestionBank,
    deleteQuestionBank,
  }
})
