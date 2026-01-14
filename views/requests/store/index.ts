import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { requestService } from '../service'
import {
    RequestStatus,
    type CancelRequestDto,
    type EmployeeBalanceDto,
    type PendingApprovalDto,
    type ProcessApprovalDto,
    type RequestCreateDto,
    type RequestDto,
    type RequestFilters,
    type RequestUpdateDto,
} from '../types'
import type { ApiError } from '~/utils/types/ApiResponses'

export const useRequestStore = defineStore('request', () => {
  // State
  const requests = ref<RequestDto[]>([])
  const pendingApprovals = ref<PendingApprovalDto[]>([])
  const employeeBalance = ref<EmployeeBalanceDto | null>(null)
  const isLoading = ref(false)
  const filters = ref<RequestFilters>({
    pageSize: 10,
    pageNumber: 1,
  })
  const isCreateDialogOpen = ref(false)
  const isEditDialogOpen = ref(false)
  const isApprovalDialogOpen = ref(false)
  const isCancelDialogOpen = ref(false)
  const isDetailsDialogOpen = ref(false)
  const selectedRequestId = ref<number | null>(null)
  const selectedRequest = ref<RequestDto | null>(null)
  const selectedApprovalId = ref<number | null>(null)
  const totalPages = ref(0)

  // Computed
  const myRequests = computed(() => {
    // This would be filtered by current user's employee ID
    return requests.value
  })

  const requestsByStatus = computed(() => {
    return (status: RequestStatus) => requests.value.filter(r => r.status === status)
  })

  const pendingRequestsCount = computed(() => {
    return requests.value.filter(r => 
      r.status === RequestStatus.Submitted || 
      r.status === RequestStatus.InProgress || 
      r.status === RequestStatus.ApprovedPartially
    ).length
  })

  const pendingApprovalsCount = computed(() => pendingApprovals.value.length)

  // Methods
  const getRequests = async () => {
    try {
      isLoading.value = true
      const response = await requestService.get(filters.value)
      requests.value = response.items
      totalPages.value = response.calculatedTotalPages || 0
    } catch (error) {
      console.error('Error fetching requests:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getRequestById = async (id: number) => {
    try {
      isLoading.value = true
      const request = await requestService.getById(id)
      selectedRequest.value = request
      return request
    } catch (error) {
      console.error(`Error fetching request ${id}:`, error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getRequestsByEmployee = async (employeeId: number, status?: RequestStatus) => {
    try {
      isLoading.value = true
      const employeeRequests = await requestService.getByEmployee(employeeId, status)
      return employeeRequests
    } catch (error) {
      console.error(`Error fetching requests for employee ${employeeId}:`, error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getRequestsByStatus = async (status: RequestStatus) => {
    try {
      isLoading.value = true
      const statusRequests = await requestService.getByStatus(status)
      return statusRequests
    } catch (error) {
      console.error(`Error fetching requests with status ${status}:`, error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getPendingApprovals = async () => {
    try {
      isLoading.value = true
      const approvals = await requestService.getPendingApprovals()
      pendingApprovals.value = approvals
      return approvals
    } catch (error) {
      console.error('Error fetching pending approvals:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getEmployeeBalance = async (employeeId: number) => {
    try {
      isLoading.value = true
      const balance = await requestService.getEmployeeBalance(employeeId)
      employeeBalance.value = balance
      return balance
    } catch (error) {
      console.error(`Error fetching balance for employee ${employeeId}:`, error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const createRequest = async (data: RequestCreateDto) => {
    try {
      isLoading.value = true
      const newRequest = await requestService.create(data)
      await getRequests()
      return newRequest
    } catch (error) {
      useToast(
        {
          message: (error as ApiError).response?.data.title,
          isError: true
        }
      )
      console.error('Error creating request:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateRequest = async (data: RequestUpdateDto) => {
    try {
      isLoading.value = true
      const updatedRequest = await requestService.update(data.id, data)
      await getRequests()
      return updatedRequest
    } catch (error) {
      useToast(
        {
          message: (error as ApiError).response?.data.title,
          isError: true
        }
      )
      console.error(`Error updating request ${data.id}:`, error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const processApproval = async (data: ProcessApprovalDto) => {
    try {
      isLoading.value = true
      const updatedRequest = await requestService.processApproval(data)
      await getRequests()
      await getPendingApprovals()
      return updatedRequest
    } catch (error) {
      console.error('Error processing approval:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const cancelRequest = async (data: CancelRequestDto) => {
    try {
      isLoading.value = true
      const cancelledRequest = await requestService.cancel(data)
      await getRequests()
      return cancelledRequest
    } catch (error) {
      console.error('Error cancelling request:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deleteRequest = async (id: number) => {
    try {
      isLoading.value = true
      await requestService.delete(id)
      await getRequests()
    } catch (error) {
      console.error(`Error deleting request ${id}:`, error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Dialog management
  const openCreateDialog = () => {
    selectedRequest.value = null
    selectedRequestId.value = null
    isCreateDialogOpen.value = true
  }

  const openEditDialog = (request: RequestDto) => {
    selectedRequest.value = request
    selectedRequestId.value = request.id
    isEditDialogOpen.value = true
  }

  const openApprovalDialog = (approvalId: number, request: RequestDto) => {
    selectedApprovalId.value = approvalId
    selectedRequest.value = request
    isApprovalDialogOpen.value = true
  }

  const openCancelDialog = (request: RequestDto) => {
    selectedRequest.value = request
    selectedRequestId.value = request.id
    isCancelDialogOpen.value = true
  }

  const openDetailsDialog = async (requestId: number) => {
    try {
      await getRequestById(requestId)
      isDetailsDialogOpen.value = true
    } catch (error) {
      console.error('Error loading request details:', error)
    }
  }

  const closeAllDialogs = () => {
    isCreateDialogOpen.value = false
    isEditDialogOpen.value = false
    isApprovalDialogOpen.value = false
    isCancelDialogOpen.value = false
    isDetailsDialogOpen.value = false
    selectedRequest.value = null
    selectedRequestId.value = null
    selectedApprovalId.value = null
  }

  // Utility methods
  const getStatusText = (status: RequestStatus): string => {
    switch (status) {
      case RequestStatus.Submitted: return 'مُقدم'
      case RequestStatus.InProgress: return 'قيد المراجعة'
      case RequestStatus.ApprovedPartially: return 'موافق عليه جزئياً'
      case RequestStatus.Approved: return 'موافق عليه'
      case RequestStatus.Rejected: return 'مرفوض'
      case RequestStatus.Completed: return 'مكتمل'
      case RequestStatus.Cancelled: return 'ملغي'
      default: return 'غير معروف'
    }
  }

  const getStatusColor = (status: RequestStatus): string => {
    switch (status) {
      case RequestStatus.Submitted: return 'blue'
      case RequestStatus.InProgress: return 'yellow'
      case RequestStatus.ApprovedPartially: return 'orange'
      case RequestStatus.Approved: return 'green'
      case RequestStatus.Rejected: return 'red'
      case RequestStatus.Completed: return 'emerald'
      case RequestStatus.Cancelled: return 'gray'
      default: return 'gray'
    }
  }

  return {
    // State
    requests,
    pendingApprovals,
    employeeBalance,
    isLoading,
    filters,
    isCreateDialogOpen,
    isEditDialogOpen,
    isApprovalDialogOpen,
    isCancelDialogOpen,
    isDetailsDialogOpen,
    selectedRequestId,
    selectedRequest,
    selectedApprovalId,
    totalPages,

    // Computed
    myRequests,
    requestsByStatus,
    pendingRequestsCount,
    pendingApprovalsCount,

    // Methods
    getRequests,
    getRequestById,
    getRequestsByEmployee,
    getRequestsByStatus,
    getPendingApprovals,
    getEmployeeBalance,
    createRequest,
    updateRequest,
    processApproval,
    cancelRequest,
    deleteRequest,

    // Dialog management
    openCreateDialog,
    openEditDialog,
    openApprovalDialog,
    openCancelDialog,
    openDetailsDialog,
    closeAllDialogs,

    // Utility methods
    getStatusText,
    getStatusColor,
  }
})
