import { CheatingFraudDetectionLogsService } from '../service'
import type {
  CheatingFraudDetectionLogs,
  CheatingFraudDetectionLogsDto,
  CheatingFraudDetectionLogsFilters,
} from '../types'

const cheatingFraudDetectionLogsService = new CheatingFraudDetectionLogsService()
export const useCheatingFraudDetectionLogsStore = defineStore('cheatingFraudDetectionLogs', () => {
  const cheatingFraudDetectionLogs = ref<CheatingFraudDetectionLogsDto[]>([])
  const isLoading = ref(false)
  const filters = ref<CheatingFraudDetectionLogsFilters>({
    pageSize: 10,
    pageNumber: 1,
    studentId: null,
  })
  const totalPages = ref(0)

  const getCheatingFraudDetectionLogs = async (
    cheatingFraudDetectionLogsFilters: CheatingFraudDetectionLogsFilters
  ) => {
    try {
      isLoading.value = true
      const response = await cheatingFraudDetectionLogsService.get(
        cheatingFraudDetectionLogsFilters
      )
      cheatingFraudDetectionLogs.value = response.data.map((cheatingFraudDetectionLogsFilter) => ({
        ...cheatingFraudDetectionLogsFilter,
        id: cheatingFraudDetectionLogsFilter.id,
        studentId: cheatingFraudDetectionLogsFilter.studentId,
        studentName: cheatingFraudDetectionLogsFilter.studentName,
        examName: cheatingFraudDetectionLogsFilter.examName,
        violationType: cheatingFraudDetectionLogsFilter.violationType,
        timeStamp: cheatingFraudDetectionLogsFilter.timeStamp,
        status: cheatingFraudDetectionLogsFilter.status,
      }))
      totalPages.value = response.pagesCount
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  return {
    cheatingFraudDetectionLogs,
    isLoading,
    filters,
    getCheatingFraudDetectionLogs,
    totalPages,
  }
})
