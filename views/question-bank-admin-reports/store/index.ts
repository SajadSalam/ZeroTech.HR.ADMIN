import { QuestionBankReportService } from '../service'
import type { QuestionBankReport, QuestionBankReportDto, QuestionBankReportFilters } from '../types'

const questionBankReportService = new QuestionBankReportService()
export const useQuestionBankReportStore = defineStore('questionBankReport', () => {
  const questionBankReports = ref<QuestionBankReportDto[]>([])
  const isLoading = ref(false)
  const filters = ref<QuestionBankReportFilters>({
    pageSize: 10,
    pageNumber: 1,
    subject: null,
  })
  const totalPages = ref(0)

  const getQuestionBankReports = async (questionBankReportFilters: QuestionBankReportFilters) => {
    try {
      isLoading.value = true
      const response = await questionBankReportService.get(questionBankReportFilters)
      questionBankReports.value = response.data.map((questionBankReportFilter) => ({
        ...questionBankReportFilter,
        id: questionBankReportFilter.id,
        totalQuestions: questionBankReportFilter.totalQuestions,
        subject: questionBankReportFilter.subject,
        questionsCreator: questionBankReportFilter.questionsCreator,
        auditor: questionBankReportFilter.auditor,
        status: questionBankReportFilter.status,
      }))
      totalPages.value = response.pagesCount
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }
  return {
    questionBankReports,
    isLoading,
    filters,
    getQuestionBankReports,
    totalPages,
  }
})
