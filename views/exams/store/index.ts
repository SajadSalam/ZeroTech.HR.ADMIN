import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { StudentFilters } from '~/views/students/types'
import { ExamService } from '../service'
import { type Exam, type ExamCreate, type ExamDto, type ExamFilters } from '../types'

const examService = new ExamService()
export const useExamStore = defineStore('exam', () => {
    const exams = ref<ExamDto[]>([])
    const isLoading = ref(false)
    const filters = ref<ExamFilters>({
        pageSize: 10,
        pageNumber: 1,
        examTemplateId: null,
        type: null,
        search: null,
        status: null
    })
    const isCreateDialogOpen = ref(false)
    const isQuestionReplaceDialogOpen = ref(false)
    const exam = ref<Exam | null>(null)
    const questionId = ref<string | null>(null)
    const totalPages = ref(0)
    const isUpdateDialogOpen = ref(false);
    const isCurveDialogOpen = ref(false)

  const getExams = async (examFilters: BaseFilters) => {
    try {
      isLoading.value = true
      const response = await examService.get(examFilters)
      exams.value = response.data
      totalPages.value = response.pagesCount
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const createExam = async (data: ExamCreate) => {
    try {
      isLoading.value = true
      await examService.create(data)
      await getExams(filters.value)
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getById = async (id: string) => {
    try {
      isLoading.value = true
      return await examService.getById(id)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const getStudents = async (id: string, filters: StudentFilters) => {
    try {
      isLoading.value = true
      const data = await examService.getLinkedStudents(id, filters)
      // remove who have same universityIDNumber
      data.students = data.students.filter(
        (student, index, self) =>
          index === self.findIndex((t) => t.universityIDNumber === student.universityIDNumber)
      )

      return data
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const replaceQuestion = async (examId: string, questionId: string) => {
    try {
      isLoading.value = true
      return await examService.replaceQuestion(examId, questionId)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const deleteExam = async (id: string) => {
    try {
      isLoading.value = true
      await examService.delete(id)
      await getExams(filters.value)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }
  const updateExam = async (examId: string, data: Exam) => {
    try {
      isLoading.value = true
      await examService.update(examId, data)
      await getExams(filters.value)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }
  const cancelExam = async (examId: string) => {
    try {
      isLoading.value = true
      await examService.cancel(examId)
      await getExams(filters.value)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const addCurve = async (examId: string, data: { curveValue: number; curveType: number }) => {
    try {
      isLoading.value = true
      await examService.addCurve(examId, data)
      await getExams(filters.value)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }


    return {
        exams,
        isCreateDialogOpen,
        isLoading,
        filters,
        totalPages,
        getExams,
        createExam,
        getById,
        getStudents,
        exam,
        isQuestionReplaceDialogOpen,
        replaceQuestion,
        questionId,
        deleteExam,
        updateExam,
        cancelExam,
        isUpdateDialogOpen,
        isCurveDialogOpen,
        addCurve
    }

})
