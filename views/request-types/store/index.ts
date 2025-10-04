import { requestTypeService } from '../service'
import type { RequestType, RequestTypeDto, RequestTypeFilters, RequestTypeCreateDto, RequestTypeUpdateDto } from '../types'

export const useRequestTypeStore = defineStore('requestType', () => {
  const requestTypes = ref<RequestTypeDto[]>([])
  const isLoading = ref(false)
  const filters = ref<RequestTypeFilters>({
    pageSize: 10,
    pageNumber: 1,
    name: null,
    code: null,
    categoryId: null,
    isEnabled: null,
    requiresApproval: null,
    affectsAttendance: null,
    affectsPayroll: null,
  })
  const isCreateDialogOpen = ref(false)
  const isEditDialogOpen = ref(false)
  const selectedRequestTypeId = ref<number | null>(null)
  const selectedRequestType = ref<RequestTypeDto | null>(null)
  const totalPages = ref(0)
  const enabledRequestTypes = ref<RequestTypeDto[]>([])

  const getRequestTypes = async () => {
    try {
      isLoading.value = true
      const response = await requestTypeService.get(filters.value)
      requestTypes.value = response.data
      totalPages.value = response.pagesCount
    } catch (error) {
      console.error('Error fetching request types:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getEnabledRequestTypes = async () => {
    try {
      isLoading.value = true
      const response = await requestTypeService.getEnabled()
      enabledRequestTypes.value = response
    } catch (error) {
      console.error('Error fetching enabled request types:', error)
    } finally {
      isLoading.value = false
    }
  }

  const getRequestTypeById = async (id: number) => {
    try {
      isLoading.value = true
      const requestType = await requestTypeService.getById(id)
      return requestType
    } catch (error) {
      console.error('Error fetching request type by ID:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getRequestTypeByCode = async (code: string) => {
    try {
      isLoading.value = true
      const requestType = await requestTypeService.getByCode(code)
      return requestType
    } catch (error) {
      console.error('Error fetching request type by code:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getRequestTypesByCategory = async (categoryId: number) => {
    try {
      isLoading.value = true
      const response = await requestTypeService.getByCategory(categoryId)
      return response
    } catch (error) {
      console.error('Error fetching request types by category:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getRequestTypeWithRestrictions = async (id: number) => {
    try {
      isLoading.value = true
      const requestType = await requestTypeService.getWithRestrictions(id)
      return requestType
    } catch (error) {
      console.error('Error fetching request type with restrictions:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getAvailableForUser = async (userId: number) => {
    try {
      isLoading.value = true
      const response = await requestTypeService.getAvailableForUser(userId)
      return response
    } catch (error) {
      console.error('Error fetching available request types for user:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getAvailableForDepartment = async (departmentId: number) => {
    try {
      isLoading.value = true
      const response = await requestTypeService.getAvailableForDepartment(departmentId)
      return response
    } catch (error) {
      console.error('Error fetching available request types for department:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getAvailableForRole = async (roleId: number) => {
    try {
      isLoading.value = true
      const response = await requestTypeService.getAvailableForRole(roleId)
      return response
    } catch (error) {
      console.error('Error fetching available request types for role:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const createRequestType = async (data: RequestTypeCreateDto) => {
    try {
      isLoading.value = true
      await requestTypeService.create(data)
      await getRequestTypes()
    } catch (error) {
      console.error('Error creating request type:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateRequestType = async (data: RequestTypeUpdateDto) => {
    try {
      isLoading.value = true
      await requestTypeService.update(selectedRequestTypeId.value!, data)
      await getRequestTypes()
    } catch (error) {
      console.error('Error updating request type:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deleteRequestType = async (id: number) => {
    try {
      isLoading.value = true
      await requestTypeService.delete(id)
      await getRequestTypes()
    } catch (error) {
      console.error('Error deleting request type:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const setSelectedRequestType = (requestType: RequestTypeDto) => {
    selectedRequestType.value = requestType
    selectedRequestTypeId.value = requestType.id
  }

  return {
    requestTypes,
    isLoading,
    filters,
    getRequestTypes,
    getEnabledRequestTypes,
    getRequestTypeById,
    getRequestTypeByCode,
    getRequestTypesByCategory,
    getRequestTypeWithRestrictions,
    getAvailableForUser,
    getAvailableForDepartment,
    getAvailableForRole,
    createRequestType,
    updateRequestType,
    deleteRequestType,
    isCreateDialogOpen,
    isEditDialogOpen,
    selectedRequestTypeId,
    selectedRequestType,
    setSelectedRequestType,
    totalPages,
    enabledRequestTypes,
  }
})
