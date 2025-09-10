import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { EvaluationDto, EvaluationFitlers } from '../types'
import { EvaluationService } from '../service'

const evaluationService = new EvaluationService()
export const useEvaluationStore = defineStore('evaluation', () => {
  const evaluations = ref<EvaluationDto[]>([])
  const isLoading = ref(false)
  const filters = ref<EvaluationFitlers>({
    pageSize: 10,
    pageNumber: 1,
    studentFullName: null,
    minDate: null,
    maxDate: null,
    hasCurve: false,
    examId: null,
    groupId: null,
  })
  const totalPages = ref(0)

  const getEvaluations = async (evaluationFilters: BaseFilters) => {
    try {
      isLoading.value = true
      const response = await evaluationService.get(evaluationFilters)
      evaluations.value = response.data
      totalPages.value = response.pagesCount
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const getEvaluationDetialed = async (examId: string, studentId: number) => {
    try {
      isLoading.value = true
      const response = await evaluationService.getDetialed(examId, studentId)
      return response
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }
  const excelDownload = async (evaluationFilters: BaseFilters) => {
    try {
      isLoading.value = true
      const response = await evaluationService.excelDownload(evaluationFilters)
      return response
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  return {
    evaluations,
    isLoading,
    filters,
    totalPages,
    getEvaluations,
    getEvaluationDetialed,
    excelDownload,
  }
})
