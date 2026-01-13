import { defineStore } from 'pinia'
import { ref } from 'vue'
import { requestCategoryService } from '../service'
import type {
  RequestCategoryDto,
  RequestCategoryCreateDto,
  RequestCategoryUpdateDto,
  RequestCategoryFilters,
} from '../types'

export const useRequestCategoryStore = defineStore('requestCategory', () => {
  // State
  const requestCategories = ref<RequestCategoryDto[]>([])
  const enabledRequestCategories = ref<RequestCategoryDto[]>([])
  const requestCategoriesWithCounts = ref<RequestCategoryDto[]>([])
  const isLoading = ref(false)
  const filters = ref<RequestCategoryFilters>({
    pageSize: 10,
    pageNumber: 1,
    name: '',
    code: '',
    isEnabled: undefined,
  })
  const isCreateDialogOpen = ref(false)
  const isEditDialogOpen = ref(false)
  const selectedRequestCategoryId = ref<string | number | null>(null)
  const selectedRequestCategory = ref<RequestCategoryDto | null>(null)
  const totalPages = ref(0)

  // Methods
  const getRequestCategories = async () => {
    try {
      isLoading.value = true
      const response = await requestCategoryService.get(filters.value)
      requestCategories.value = response.items
      totalPages.value = response.pagesCount
    } catch (error) {
      console.error('Error fetching request categories:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getEnabledRequestCategories = async () => {
    try {
      isLoading.value = true
      const response = await requestCategoryService.getEnabled()
      enabledRequestCategories.value = response
    } catch (error) {
      console.error('Error fetching enabled request categories:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getRequestCategoriesWithCounts = async () => {
    try {
      isLoading.value = true
      const response = await requestCategoryService.getWithCounts()
      requestCategoriesWithCounts.value = response
    } catch (error) {
      console.error('Error fetching request categories with counts:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getRequestCategoryById = async (id: string | number) => {
    try {
      isLoading.value = true
      const response = await requestCategoryService.getById(id)
      selectedRequestCategory.value = response
      return response
    } catch (error) {
      console.error(`Error fetching request category with id ${id}:`, error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getRequestCategoryByCode = async (code: string) => {
    try {
      isLoading.value = true
      const response = await requestCategoryService.getByCode(code)
      return response
    } catch (error) {
      console.error(`Error fetching request category with code ${code}:`, error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getRequestCategoryWithRequestTypes = async (id: string | number) => {
    try {
      isLoading.value = true
      const response = await requestCategoryService.getWithRequestTypes(id)
      return response
    } catch (error) {
      console.error(`Error fetching request category with request types for id ${id}:`, error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const createRequestCategory = async (data: RequestCategoryCreateDto) => {
    try {
      isLoading.value = true
      await requestCategoryService.create(data)
      await getRequestCategories()
    } catch (error) {
      console.error('Error creating request category:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateRequestCategory = async (data: RequestCategoryUpdateDto) => {
    try {
      if (!selectedRequestCategoryId.value) {
        throw new Error('No request category selected for update')
      }
      isLoading.value = true
      await requestCategoryService.update(selectedRequestCategoryId.value, data)
      await getRequestCategories()
    } catch (error) {
      console.error('Error updating request category:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deleteRequestCategory = async (id: string | number) => {
    try {
      isLoading.value = true
      await requestCategoryService.delete(id)
      await getRequestCategories()
    } catch (error) {
      console.error(`Error deleting request category with id ${id}:`, error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const setSelectedRequestCategory = (requestCategory: RequestCategoryDto | null) => {
    selectedRequestCategory.value = requestCategory
    selectedRequestCategoryId.value = requestCategory?.id || null
  }

  // Return all reactive properties and methods
  return {
    requestCategories,
    enabledRequestCategories,
    requestCategoriesWithCounts,
    isLoading,
    filters,
    getRequestCategories,
    getEnabledRequestCategories,
    getRequestCategoriesWithCounts,
    getRequestCategoryById,
    getRequestCategoryByCode,
    getRequestCategoryWithRequestTypes,
    createRequestCategory,
    updateRequestCategory,
    deleteRequestCategory,
    setSelectedRequestCategory,
    isCreateDialogOpen,
    isEditDialogOpen,
    selectedRequestCategoryId,
    selectedRequestCategory,
    totalPages,
  }
})
