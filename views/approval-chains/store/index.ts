import { defineStore } from 'pinia'
import { ref } from 'vue'
import { approvalChainService } from '../service'
import type {
    ApprovalChainCreateDto,
    ApprovalChainDto,
    ApprovalChainFilters,
    ApprovalChainUpdateDto,
    ApprovalStepCreateDto,
    ApprovalStepDto,
    ApprovalStepUpdateDto,
} from '../types'

export const useApprovalChainStore = defineStore('approvalChain', () => {
  // State
  const approvalChains = ref<ApprovalChainDto[]>([])
  const isLoading = ref(false)
  const filters = ref<ApprovalChainFilters>({
    pageSize: 10,
    pageNumber: 1,
    name: '',
    requestTypeId: undefined,
    departmentId: undefined,
    isActive: undefined,
    priority: undefined,
  })
  const isCreateDialogOpen = ref(false)
  const isEditDialogOpen = ref(false)
  const selectedApprovalChainId = ref<string | number | null>(null)
  const selectedApprovalChain = ref<ApprovalChainDto | null>(null)
  const totalPages = ref(0)
  
  // Step management
  const approvalSteps = ref<ApprovalStepDto[]>([])
  const isStepDialogOpen = ref(false)
  const selectedStep = ref<ApprovalStepDto | null>(null)
  const isEditingStep = ref(false)

  // Methods
  const getApprovalChains = async () => {
    try {
      isLoading.value = true
      const response = await approvalChainService.get(filters.value)
      approvalChains.value = response.items
      totalPages.value = response.pagesCount
    } catch (error) {
      console.error('Error fetching approval chains:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getApprovalChainById = async (id: string | number) => {
    try {
      isLoading.value = true
      const response = await approvalChainService.getById(id)
      selectedApprovalChain.value = response
      return response
    } catch (error) {
      console.error(`Error fetching approval chain with id ${id}:`, error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getApprovalChainsByRequestTypeAndDepartment = async (requestTypeId: number, departmentId: number) => {
    try {
      isLoading.value = true
      const response = await approvalChainService.getByRequestTypeAndDepartment(requestTypeId, departmentId)
      return response
    } catch (error) {
      console.error(`Error fetching approval chains for request type ${requestTypeId} and department ${departmentId}:`, error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getPrimaryApprovalChain = async (requestTypeId: number, departmentId: number) => {
    try {
      isLoading.value = true
      const response = await approvalChainService.getPrimary(requestTypeId, departmentId)
      return response
    } catch (error) {
      console.error(`Error fetching primary approval chain for request type ${requestTypeId} and department ${departmentId}:`, error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const createApprovalChain = async (data: ApprovalChainCreateDto) => {
    try {
      isLoading.value = true
      await approvalChainService.create(data)
      await getApprovalChains()
    } catch (error) {
      console.error('Error creating approval chain:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateApprovalChain = async (data: ApprovalChainUpdateDto) => {
    try {
      if (!selectedApprovalChainId.value) {
        throw new Error('No approval chain selected for update')
      }
      isLoading.value = true
      await approvalChainService.update(selectedApprovalChainId.value, data)
      await getApprovalChains()
    } catch (error) {
      console.error('Error updating approval chain:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deleteApprovalChain = async (id: string | number) => {
    try {
      isLoading.value = true
      await approvalChainService.delete(id)
      await getApprovalChains()
    } catch (error) {
      console.error(`Error deleting approval chain with id ${id}:`, error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Step methods
  const getApprovalSteps = async (approvalChainId: number) => {
    try {
      isLoading.value = true
      const response = await approvalChainService.getStepsByChain(approvalChainId)
      approvalSteps.value = response.sort((a, b) => a.stepOrder - b.stepOrder)
      return response
    } catch (error) {
      console.error(`Error fetching approval steps for chain ${approvalChainId}:`, error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const createApprovalStep = async (data: ApprovalStepCreateDto) => {
    try {
      isLoading.value = true
      await approvalChainService.createStep(data)
      if (selectedApprovalChainId.value) {
        await getApprovalSteps(Number(selectedApprovalChainId.value))
      }
    } catch (error) {
      console.error('Error creating approval step:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateApprovalStep = async (id: string | number, data: ApprovalStepUpdateDto) => {
    try {
      isLoading.value = true
      await approvalChainService.updateStep(id, data)
      if (selectedApprovalChainId.value) {
        await getApprovalSteps(Number(selectedApprovalChainId.value))
      }
    } catch (error) {
      console.error(`Error updating approval step with id ${id}:`, error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deleteApprovalStep = async (id: string | number) => {
    try {
      isLoading.value = true
      await approvalChainService.deleteStep(id)
      if (selectedApprovalChainId.value) {
        await getApprovalSteps(Number(selectedApprovalChainId.value))
      }
    } catch (error) {
      console.error(`Error deleting approval step with id ${id}:`, error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const setSelectedApprovalChain = (approvalChain: ApprovalChainDto | null) => {
    selectedApprovalChain.value = approvalChain
    selectedApprovalChainId.value = approvalChain?.id || null
  }


  const openStepDialog = (step?: ApprovalStepDto) => {
    selectedStep.value = step || null
    isEditingStep.value = !!step
    isStepDialogOpen.value = true
  }

  // Return all reactive properties and methods
  return {
    approvalChains,
    isLoading,
    filters,
    getApprovalChains,
    getApprovalChainById,
    getApprovalChainsByRequestTypeAndDepartment,
    getPrimaryApprovalChain,
    createApprovalChain,
    updateApprovalChain,
    deleteApprovalChain,
    isCreateDialogOpen,
    isEditDialogOpen,
    selectedApprovalChainId,
    selectedApprovalChain,
    setSelectedApprovalChain,
    totalPages,
    
    // Step management
    approvalSteps,
    getApprovalSteps,
    createApprovalStep,
    updateApprovalStep,
    deleteApprovalStep,
    isStepDialogOpen,
    selectedStep,
    isEditingStep,
    openStepDialog,
  }
})
