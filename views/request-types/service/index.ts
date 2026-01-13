import axios from '~/services/app-client/axios'
import type { PaginatedResponse } from '~/utils/types/ApiResponses'
import type { RequestType, RequestTypeDto, RequestTypeFilters, RequestTypeCreateDto, RequestTypeUpdateDto } from '../types'

interface IRequestTypeService {
  get: (filters: RequestTypeFilters) => Promise<PaginatedResponse<RequestTypeDto>>
  getAll: () => Promise<RequestTypeDto[]>
  getEnabled: () => Promise<RequestTypeDto[]>
  getById: (id: number) => Promise<RequestTypeDto>
  getByCode: (code: string) => Promise<RequestTypeDto>
  getByCategory: (categoryId: number) => Promise<RequestTypeDto[]>
  getWithRestrictions: (id: number) => Promise<RequestTypeDto>
  getAvailableForUser: (userId: number) => Promise<RequestTypeDto[]>
  getAvailableForDepartment: (departmentId: number) => Promise<RequestTypeDto[]>
  getAvailableForRole: (roleId: number) => Promise<RequestTypeDto[]>
  create: (data: RequestTypeCreateDto) => Promise<RequestTypeDto>
  update: (id: number, data: RequestTypeUpdateDto) => Promise<RequestTypeDto>
  delete: (id: number) => Promise<void>
}

export class RequestTypeService implements IRequestTypeService {
  async get(filters: RequestTypeFilters): Promise<PaginatedResponse<RequestTypeDto>> {
    try {
      const params = new URLSearchParams()
      
      if (filters.pageNumber) params.append('pageNumber', filters.pageNumber.toString())
      if (filters.pageSize) params.append('pageSize', filters.pageSize.toString())
      if (filters.name) params.append('name', filters.name)
      if (filters.code) params.append('code', filters.code)
      if (filters.categoryId) params.append('categoryId', filters.categoryId.toString())
      if (filters.isEnabled !== undefined && filters.isEnabled !== null) params.append('isEnabled', filters.isEnabled.toString())
      if (filters.requiresApproval !== undefined && filters.requiresApproval !== null) params.append('requiresApproval', filters.requiresApproval.toString())
      if (filters.affectsAttendance !== undefined && filters.affectsAttendance !== null) params.append('affectsAttendance', filters.affectsAttendance.toString())
      if (filters.affectsPayroll !== undefined && filters.affectsPayroll !== null) params.append('affectsPayroll', filters.affectsPayroll.toString())

      const response = await axios.get<PaginatedResponse<RequestTypeDto>>(`/RequestType?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching request types:', error)
      throw error
    }
  }

  async getAll(): Promise<RequestTypeDto[]> {
    const response = await axios.get<RequestTypeDto[]>('/RequestType')
    return response.data
  }

  async getEnabled(): Promise<RequestTypeDto[]> {
    const response = await axios.get<RequestTypeDto[]>('/RequestType/enabled')
    return response.data
  }

  async getById(id: number): Promise<RequestTypeDto> {
    const response = await axios.get<RequestTypeDto>(`/RequestType/${id}`)
    return response.data
  }

  async getByCode(code: string): Promise<RequestTypeDto> {
    const response = await axios.get<RequestTypeDto>(`/RequestType/by-code/${code}`)
    return response.data
  }

  async getByCategory(categoryId: number): Promise<RequestTypeDto[]> {
    const response = await axios.get<RequestTypeDto[]>(`/RequestType/by-category/${categoryId}`)
    return response.data
  }

  async getWithRestrictions(id: number): Promise<RequestTypeDto> {
    const response = await axios.get<RequestTypeDto>(`/RequestType/${id}/with-restrictions`)
    return response.data
  }

  async getAvailableForUser(userId: number): Promise<RequestTypeDto[]> {
    const response = await axios.get<RequestTypeDto[]>(`/RequestType/available-for-user/${userId}`)
    return response.data
  }

  async getAvailableForDepartment(departmentId: number): Promise<RequestTypeDto[]> {
    const response = await axios.get<RequestTypeDto[]>(`/RequestType/available-for-department/${departmentId}`)
    return response.data
  }

  async getAvailableForRole(roleId: number): Promise<RequestTypeDto[]> {
    const response = await axios.get<RequestTypeDto[]>(`/RequestType/available-for-role/${roleId}`)
    return response.data
  }

  async create(data: RequestTypeCreateDto): Promise<RequestTypeDto> {
    const response = await axios.post<RequestTypeDto>('/RequestType', data)
    return response.data
  }

  async update(id: number, data: RequestTypeUpdateDto): Promise<RequestTypeDto> {
    const response = await axios.put<RequestTypeDto>(`/RequestType/${id}`, data)
    return response.data
  }

  async delete(id: number): Promise<void> {
    await axios.delete(`/RequestType/${id}`)
  }
}

export const requestTypeService = new RequestTypeService()
