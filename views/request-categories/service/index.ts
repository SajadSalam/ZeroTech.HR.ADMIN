import axios from '~/services/app-client/axios'
import type { PaginatedResponse } from '~/utils/types'
import type {
  RequestCategoryDto,
  RequestCategoryCreateDto,
  RequestCategoryUpdateDto,
  RequestCategoryFilters,
} from '../types'

interface IRequestCategoryService {
  get: (filters: RequestCategoryFilters) => Promise<PaginatedResponse<RequestCategoryDto>>
  getEnabled: () => Promise<RequestCategoryDto[]>
  getWithCounts: () => Promise<RequestCategoryDto[]>
  getById: (id: string | number) => Promise<RequestCategoryDto>
  getByCode: (code: string) => Promise<RequestCategoryDto>
  getWithRequestTypes: (id: string | number) => Promise<RequestCategoryDto>
  create: (data: RequestCategoryCreateDto) => Promise<RequestCategoryDto>
  update: (id: string | number, data: RequestCategoryUpdateDto) => Promise<RequestCategoryDto>
  delete: (id: string | number) => Promise<void>
}

export class RequestCategoryService implements IRequestCategoryService {
  private baseUrl = '/RequestCategory'

  async get(filters: RequestCategoryFilters): Promise<PaginatedResponse<RequestCategoryDto>> {
    try {
      const params = new URLSearchParams()
      
      if (filters.pageNumber) params.append('pageNumber', filters.pageNumber.toString())
      if (filters.pageSize) params.append('pageSize', filters.pageSize.toString())
      if (filters.name) params.append('name', filters.name)
      if (filters.code) params.append('code', filters.code)
      if (filters.isEnabled !== undefined) params.append('isEnabled', filters.isEnabled.toString())

      const response = await axios.get(`${this.baseUrl}?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching request categories:', error)
      throw error
    }
  }

  async getEnabled(): Promise<RequestCategoryDto[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/enabled`)
      return response.data
    } catch (error) {
      console.error('Error fetching enabled request categories:', error)
      throw error
    }
  }

  async getWithCounts(): Promise<RequestCategoryDto[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/with-counts`)
      return response.data
    } catch (error) {
      console.error('Error fetching request categories with counts:', error)
      throw error
    }
  }

  async getById(id: string | number): Promise<RequestCategoryDto> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching request category with id ${id}:`, error)
      throw error
    }
  }

  async getByCode(code: string): Promise<RequestCategoryDto> {
    try {
      const response = await axios.get(`${this.baseUrl}/by-code/${code}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching request category with code ${code}:`, error)
      throw error
    }
  }

  async getWithRequestTypes(id: string | number): Promise<RequestCategoryDto> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}/with-request-types`)
      return response.data
    } catch (error) {
      console.error(`Error fetching request category with request types for id ${id}:`, error)
      throw error
    }
  }

  async create(data: RequestCategoryCreateDto): Promise<RequestCategoryDto> {
    try {
      const response = await axios.post(this.baseUrl, data)
      return response.data
    } catch (error) {
      console.error('Error creating request category:', error)
      throw error
    }
  }

  async update(id: string | number, data: RequestCategoryUpdateDto): Promise<RequestCategoryDto> {
    try {
      const response = await axios.put(`${this.baseUrl}/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Error updating request category with id ${id}:`, error)
      throw error
    }
  }

  async delete(id: string | number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      console.error(`Error deleting request category with id ${id}:`, error)
      throw error
    }
  }
}

export const requestCategoryService = new RequestCategoryService()
