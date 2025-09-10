import { EvaluatorPerformanceService } from '../service'
import type {
  EvaluatorPerformance,
  EvaluatorPerformanceDto,
  EvaluatorPerformanceFilters,
} from '../types'

const evaluatorPerformanceService = new EvaluatorPerformanceService()
export const useEvaluatorPerformanceStore = defineStore('evaluatorPerformance', () => {
  const evaluatorPerformances = ref<EvaluatorPerformanceDto[]>([])
  const isLoading = ref(false)
  const filters = ref<EvaluatorPerformanceFilters>({
    pageSize: 10,
    pageNumber: 1,
    fullName: null,
  })
  const totalPages = ref(0)

  const getEvaluatorPerformances = async (
    evaluatorPerformanceFilters: EvaluatorPerformanceFilters
  ) => {
    try {
      isLoading.value = true
      const response = await evaluatorPerformanceService.get(evaluatorPerformanceFilters)
      evaluatorPerformances.value = response.data.map((evaluatorPerformanceFilter) => ({
        ...evaluatorPerformanceFilter,
        id: evaluatorPerformanceFilter.id,
        fullName: evaluatorPerformanceFilter.fullName,
        examName: evaluatorPerformanceFilter.examName,
        nationalId: evaluatorPerformanceFilter.nationalId,
        email: evaluatorPerformanceFilter.email,
        phoneNumber: evaluatorPerformanceFilter.phoneNumber,
        gender: evaluatorPerformanceFilter.gender,
        type: evaluatorPerformanceFilter.type,
        colleage: evaluatorPerformanceFilter.colleage,
        department: evaluatorPerformanceFilter.department,
        stage: evaluatorPerformanceFilter.stage,
        grade: evaluatorPerformanceFilter.grade,
        status: evaluatorPerformanceFilter.status,
      }))
      totalPages.value = response.pagesCount
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }
  return {
    evaluatorPerformances,
    isLoading,
    filters,
    getEvaluatorPerformances,
    totalPages,
  }
})
