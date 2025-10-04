import { ApplicantService } from '../service'
import type { ApplicantDto, ApplicantFilters } from '../types'

const applicantService = new ApplicantService()
export const useApplicantStore = defineStore('applicant', () => {
  const applicants = ref<ApplicantDto[]>([])
  const isLoading = ref(false)
  const totalItems = ref(0)
  const pendingApplicants = ref(0)
  const acceptedApplicants = ref(0)
  const rejectedApplicants = ref(0)
  const filters = ref<ApplicantFilters>({
    pageSize: 10,
    pageNumber: 1,
    firstName: null,
    secondName: null,
    thirdName: null,
    email: null,
    phoneNumber: null,
    gender: null,
  })
  const totalPages = ref(0)

  const getApplicants = async () => {
    try {
      isLoading.value = true
      const response = await applicantService.get(filters.value)
      applicants.value = response.data
      totalPages.value = response.pagesCount
      totalItems.value = response.totalItems || 0
      pendingApplicants.value = response.pendingApplicants || 0
      acceptedApplicants.value = response.acceptedApplicants || 0
      rejectedApplicants.value = response.rejectedApplicants || 0
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const acceptApplicant = async (documentId: string) => {
    try {
      await applicantService.accept(documentId)
      // Update the local state to reflect the change
      const applicantIndex = applicants.value.findIndex(a => a.documentId === documentId)
      if (applicantIndex !== -1) {
        applicants.value[applicantIndex].isAccepted = true
      }
      // Refresh the list to get updated data
      await getApplicants()
    } catch (error) {
      throw error
    }
  }

  const rejectApplicant = async (documentId: string, reason: string) => {
    try {
      await applicantService.reject(documentId, reason)
      // Update the local state to reflect the change
      const applicantIndex = applicants.value.findIndex(a => a.documentId === documentId)
      if (applicantIndex !== -1) {
        applicants.value[applicantIndex].isAccepted = false
      }
      // Refresh the list to get updated data
      await getApplicants()
    } catch (error) {
      throw error
    }
  }

  const bulkAcceptApplicants = async (applicantIds: string[]) => {
    try {
      const response = await applicantService.bulkAccept(applicantIds)
      
      // Update local state for successful operations
      response.data.successful.forEach(documentId => {
        const applicantIndex = applicants.value.findIndex(a => a.documentId === documentId)
        if (applicantIndex !== -1) {
          applicants.value[applicantIndex].isAccepted = true
        }
      })
      
      // Refresh the list to get updated data
      await getApplicants()
      
      return response
    } catch (error) {
      throw error
    }
  }

  const bulkRejectApplicants = async (applicantIds: string[], reason?: string) => {
    try {
      const response = await applicantService.bulkReject(applicantIds, reason)
      
      // Update local state for successful operations
      response.data.successful.forEach(documentId => {
        const applicantIndex = applicants.value.findIndex(a => a.documentId === documentId)
        if (applicantIndex !== -1) {
          applicants.value[applicantIndex].isAccepted = false
        }
      })
      
      // Refresh the list to get updated data
      await getApplicants()
      
      return response
    } catch (error) {
      throw error
    }
  }

  return {
    applicants,
    isLoading,
    filters,
    getApplicants,
    acceptApplicant,
    rejectApplicant,
    bulkAcceptApplicants,
    bulkRejectApplicants,
    totalPages,
    totalItems,
    pendingApplicants,
    acceptedApplicants,
    rejectedApplicants,
  }
}) 