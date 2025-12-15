import { formatDateWithTimezone } from '~/utils'
import { ExamService } from '../service'
import { type ExamCreate, type ExamDto, type ExamFilters, type ScheduleExam } from '../types'

const examService = new ExamService()
export const useExamStore = defineStore('exam', () => {
    const exams = ref<ExamDto[]>([])
    const isLoading = ref(false)
    const filters = ref<ExamFilters>({
        page: 1,
        pageSize: 50,
        search: '',
        examTemplateId: null,
        groupId: null,
        startDateFrom: null,
        startDateTo: null
    })
    const isQuestionReplaceDialogOpen = ref(false)
    const isExtendDurationDialogOpen = ref(false)
    const isQuestionReshuffleDialogOpen = ref(false)
    const isUpdateScheduleDialogOpen = ref(false)
    const exam = ref<ExamDto | null>(null)
    const questionId = ref<string | null>(null)
    const totalPages = ref(0)
    
  const getExams = async () => {
    try {
      isLoading.value = true
      const response = await examService.get(filters.value)
      exams.value = response.items
      totalPages.value = response.pageCount
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const createExam = async (data: ExamCreate) => {
    try {
      isLoading.value = true
      data.startAt = formatDateWithTimezone(data.startAt!)
      console.log(data.startAt);
      
      await examService.create(data)
      await getExams()
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const replaceQuestion = async (questionId: string) => {
    try {
      isLoading.value = true
      const res=await examService.replace(exam.value?.id as string, questionId)
      exam.value = null
      return res
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const reshuffleQuestions = async () => {
    try {
      isLoading.value = true
      const res = await examService.reshuffleQuestions(exam.value?.id as string)
      exam.value = null
      return res
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const extendDuration = async (durationMinutes: number) => {
    try {
      isLoading.value = true
      const res = await examService.extendDuration(exam.value?.id as string, durationMinutes)
      exam.value = null
      return res
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const updateSchedule = async (schedule: ScheduleExam) => {
    try {
      isLoading.value = true
      schedule.startAt = formatDateWithTimezone(schedule.startAt!)
      const res = await examService.updateSchedule(exam.value?.id as string, schedule)
      exam.value = null
      return res
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }
    return {
        exams,
        isLoading,
        filters,
        totalPages,
        getExams,
        createExam,
        exam,
        isQuestionReplaceDialogOpen,
        replaceQuestion,
        questionId,
        reshuffleQuestions,
        extendDuration,
        updateSchedule,
        isExtendDurationDialogOpen,
        isQuestionReshuffleDialogOpen,
        isUpdateScheduleDialogOpen
    }

})
