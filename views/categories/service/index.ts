import axios from '~/services/app-client/axios'
import type { PaginatedResponse } from '~/utils/types/ApiResponses'
import type { Category, CategoryDto, CategoryFilters } from '../types'

interface ICategoryService {
  get: (filters: CategoryFilters) => Promise<PaginatedResponse<CategoryDto>>
  create: (data: Category) => Promise<CategoryDto>
  update: (id: string, data: Category) => Promise<CategoryDto>
  patch: (id: string, data: Partial<Category>) => Promise<CategoryDto>
  delete: (id: string) => Promise<void>
}

/**
 * Service class for managing categories.
 * Implements the ICategoryService interface.
 */
export class CategoryService implements ICategoryService {
  /**
   * Retrieves a paginated list of categories based on the provided filters.
   * @param {CategoryFilters} filters - The filters to apply when retrieving categories.
   * @returns {Promise<PaginatedResponse<CategoryDto>>} A promise that resolves to a paginated response containing the categories.
   */
  async get(filters: CategoryFilters): Promise<PaginatedResponse<CategoryDto>> {
    const response = await axios.get<PaginatedResponse<CategoryDto>>('/category', {
      params: filters,
    })
    return response.data
  }

  /**
   * Creates a new category.
   * @param {Category} data - The data for the new category.
   * @returns {Promise<CategoryDto>} A promise that resolves to the created category.
   */
  async create(data: Category): Promise<CategoryDto> {
    const response = await axios.post<CategoryDto>('/category', data)
    return response.data
  }

  /**
   * Updates an existing category.
   * @param {string} id - The ID of the category to update.
   * @param {Category} data - The updated data for the Category.
   * @returns {Promise<CategoryDto>} A promise that resolves to the updated category.
   */
  async update(id: string, data: Category): Promise<CategoryDto> {
    const response = await axios.put<CategoryDto>('/category/' + id, data)
    return response.data
  }

  /**
   * Updates an existing category by its ID using a partial category data.
   * @param {string} id - The ID of the category to update.
   * @param {Partial<Category>} data - The updated data for the category.
   * @returns {Promise<CategoryDto>} A promise that resolves to the updated category.
   */
  async patch(id: string, data: Partial<Category>): Promise<CategoryDto> {
    const response = await axios.patch<CategoryDto>(`/category/${id}`, data)
    return response.data
  }

  /**
   * Deletes a category by its ID.
   * @param {string} id - The ID of the category to delete.
   * @returns {Promise<void>} A promise that resolves when the category is deleted.
   */
  async delete(id: string): Promise<void> {
    await axios.delete(`/category/${id}`)
  }
}
