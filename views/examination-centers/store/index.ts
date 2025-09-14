import { defineStore } from 'pinia'
import type { BaseFilters, PaginatedResponse } from '~/utils/types/ApiResponses'
import { ExaminationCenterService } from '../service'
import type { ExamCenterStatistics, ExaminationCenter, ExaminationCenterDto, OtpResponse } from '../types'
import type { ProgressStatistics, ProgressStudent } from '../types/progress'
import type { StudentTicket } from '../types/ticket'
const examinationCenterService = new ExaminationCenterService()
export const useExaminationCenters = defineStore('examinationCenters', () => {
  const examinationCenters = ref<ExaminationCenterDto[]>([])
  const selectedExaminationCenter = ref<ExaminationCenterDto | null>(null)
  const isLoading = ref(false)
  const isCreateDialogOpen = ref(false)
  const isEditDialogOpen = ref(false)
  const isAssignExamCenterManagerDialogOpen = ref(false)
  const isGenerateOTPDialogOpen = ref(false)
  const isManagerSignatureDialogOpen = ref(false)
  const isSupervisorOTPDialogOpen = ref(false)
  const isBlacklistStudentDialogOpen = ref(false)
  const selectedStudentForBlacklist = ref<any>(null)
  const filters = ref<BaseFilters>({
    search: '',
    pageSize: 10,
    pageNumber: 1,
  })
  const totalPages = ref(0)

  const getExaminationCenters = async () => {
    try {
      isLoading.value = true
      const response = await examinationCenterService.get(filters.value)
      examinationCenters.value = response.data.map(
        (item) =>
          ({
            ...item,
            collegeName: item.college ? item.college.arabicName : '',
            creationDate: item.creationDate.split('T')[0],
          }) as ExaminationCenterDto
      )
      totalPages.value = response.pagesCount
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }
  const getExaminationCenter = async (id: string) => {
    try {
      isLoading.value = true
      const response = await examinationCenterService.getById(id)
      return response
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const createExaminationCenter = async (data: ExaminationCenter) => {
    try {
      isLoading.value = true
      await examinationCenterService.create(data)
      await getExaminationCenters(filters.value)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const updateExaminationCenter = async (data: ExaminationCenter) => {
    try {
      isLoading.value = true
      await examinationCenterService.update(selectedExaminationCenter.value!.id, data)
      await getExaminationCenters(filters.value)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const deleteExaminationCenter = async (id: string) => {
    try {
      isLoading.value = true
      await examinationCenterService.delete(id)
      await getExaminationCenters(filters.value)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }


  const assignSurrogateManager = async (id: string, data: { managerId: number }) => {
    try {
      isLoading.value = true
      await examinationCenterService.assignSurrogateManager(id, data)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const assignExamCenterManager = async (id: string, data: { managerId: number }) => {
    try {
      isLoading.value = true
      await examinationCenterService.assignManager(id, data)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const getExams = async (id: string) => {
    try {
      isLoading.value = true
      const response = await examinationCenterService.getExams(id)
      return response
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }


  const checkIn = async (id: string): Promise<OtpResponse> => {
    try {
      isLoading.value = true
      const response = await examinationCenterService.checkIn(id)
      return response
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const getBookedStudents = async (filters: BaseFilters): PaginatedResponse<StudentTicket> => {
    try {
      isLoading.value = true
      const response = await examinationCenterService.getBookedStudents(filters)
      return response
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const getExamCenterStatistics = async (id: string): Promise<ExamCenterStatistics> => {
    try {
      isLoading.value = true
      const response = await examinationCenterService.getExamCenterStatistics(id)
      return response
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const getHallStatistics = async (id: string): Promise<ProgressStatistics> => {
    try {
      isLoading.value = true
      const response = await examinationCenterService.getHallStatistics(id)
      return response
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const getProgressStudents = async (id: string, filters: BaseFilters): Promise<PaginatedResponse<ProgressStudent>> => {
    try {
      isLoading.value = true
      const response = await examinationCenterService.getProgressStudents(id, filters)
      return response
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const setManagerSignature = async (id: string, signatureFile: File): Promise<void> => {
    try {
      isLoading.value = true
      await examinationCenterService.setManagerSignature(id, signatureFile)
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const generateSupervisorOTP = async (): Promise<{ otp: string }> => {
    try {
      isLoading.value = true
      const response = await examinationCenterService.generateSupervisorOTP()
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const blacklistStudent = async (data: { ticketId: string; reason: string }): Promise<void> => {
    try {
      isLoading.value = true
      await examinationCenterService.blacklistStudent(data)
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    examinationCenters,
    isLoading,
    isCreateDialogOpen,
    filters,
    totalPages,
    getExaminationCenters,
    createExaminationCenter,
    updateExaminationCenter,
    deleteExaminationCenter,
    selectedExaminationCenter,
    isEditDialogOpen,
    isAssignExamCenterManagerDialogOpen,
    assignSurrogateManager,
    assignExamCenterManager,
    getExaminationCenter,
    getExams,
    isGenerateOTPDialogOpen,
    checkIn,
    getBookedStudents,
    getExamCenterStatistics,
    getHallStatistics,
    getProgressStudents,
    setManagerSignature,
    isManagerSignatureDialogOpen,
    isSupervisorOTPDialogOpen,
    generateSupervisorOTP,
    isBlacklistStudentDialogOpen,
    selectedStudentForBlacklist,
    blacklistStudent
  }
})
