import { CategoryService } from '../service'
import type { Category, CategoryDto, CategoryFilters } from '../types'

const categoryService = new CategoryService()
export const useCategoryStore = defineStore('category', () => {
  const category = ref<CategoryDto[]>([])
  const isLoading = ref(false)
  const filters = ref<CategoryFilters>({
    pageSize: 10,
    pageNumber: 1,
    name: null,
  })
  const isCreateDialogOpen = ref(false)
  const isEditDialogOpen = ref(false)
  const selectedCategoryId = ref<string | null>(null)
  const selectedCategory = ref<CategoryDto | null>(null)
  const totalPages = ref(0)

  const getCategory = async () => {
    try {
      isLoading.value = true
      const response = await categoryService.get(filters.value)
      category.value = response.data
      totalPages.value = response.pagesCount
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const createCategory = async (data: Category) => {
    try {
      isLoading.value = true
      await categoryService.create(data)
      await getCategory()
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateCategory = async (data: Category) => {
    try {
      isLoading.value = true
      await categoryService.update(selectedCategoryId.value!, data)
      await getCategory()
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const patchCategory = async (data: Partial<Category>): Promise<CategoryDto | undefined> => {
    try {
      isLoading.value = true
      const response = await categoryService.patch(selectedCategoryId.value!, data)
      await getCategory()
      return response
    } catch (error) {
    } finally {
      isLoading.value = false
    }
    return undefined
  }

  const deleteCategory = async (id: string) => {
    try {
      isLoading.value = true
      await categoryService.delete(id)
      await getCategory()
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  return {
    category,
    isLoading,
    filters,
    getCategory,
    createCategory,
    updateCategory,
    patchCategory,
    deleteCategory,
    isCreateDialogOpen,
    isEditDialogOpen,
    selectedCategoryId,
    selectedCategory,
    totalPages,
  }
})
