import axios from '~/services/app-client/axios'
import type { PaginatedResponse } from '~/utils/types/ApiResponses'
import type {
    UserAssignment,
    UserAssignmentDto,
    WorkScheduleCreateDto,
    WorkScheduleDto,
    WorkScheduleFilters,
    WorkScheduleUpdateDto,
    WorkScheduleValidationResponse
} from '../types'

interface IWorkScheduleService {
  get: (filters: WorkScheduleFilters) => Promise<PaginatedResponse<WorkScheduleDto>>
  getById: (id: number) => Promise<WorkScheduleDto>
  getTemplates: (filters: WorkScheduleFilters) => Promise<PaginatedResponse<WorkScheduleDto>>
  create: (data: WorkScheduleCreateDto) => Promise<WorkScheduleDto>
  update: (id: number, data: WorkScheduleUpdateDto) => Promise<WorkScheduleDto>
  delete: (id: number) => Promise<void>
  assignUsers: (id: number, assignments: UserAssignment[]) => Promise<{ workScheduleId: number; assignedUsers: UserAssignmentDto[] }>
  validate: (data: WorkScheduleCreateDto) => Promise<WorkScheduleValidationResponse>
}

export class WorkScheduleService implements IWorkScheduleService {
  async get(filters: WorkScheduleFilters): Promise<PaginatedResponse<WorkScheduleDto>> {
    const response = await axios.get<PaginatedResponse<WorkScheduleDto>>('/workschedule', { params: filters })
    return response.data
  }

  async getById(id: number): Promise<WorkScheduleDto> {
    const response = await axios.get<WorkScheduleDto>(`/workschedule/${id}`)
    return response.data
  }

  async getTemplates(filters: WorkScheduleFilters): Promise<WorkScheduleDto[]> {
    const response = await axios.get<WorkScheduleDto[]>('/workschedule/templates', { params: filters })
    return response.data
  }

  async create(data: WorkScheduleCreateDto): Promise<WorkScheduleDto> {
    const response = await axios.post<WorkScheduleDto>('/workschedule', data)
    return response.data
  }

  async update(id: number, data: WorkScheduleUpdateDto): Promise<WorkScheduleDto> {
    const response = await axios.put<WorkScheduleDto>(`/workschedule/${id}`, data)
    return response.data
  }

  async delete(id: number): Promise<void> {
    await axios.delete(`/workschedule/${id}`)
  }

  async assignUsers(id: number, assignments: UserAssignment[]): Promise<{ workScheduleId: number; assignedUsers: UserAssignmentDto[] }> {
    const response = await axios.post<{ workScheduleId: number; assignedUsers: UserAssignmentDto[] }>(
      `/workschedule/${id}/assign-users`,
      { assignments: assignments }
    )
    return response.data
  }

  async validate(data: WorkScheduleCreateDto): Promise<WorkScheduleValidationResponse> {
    const response = await axios.post<WorkScheduleValidationResponse>('/workschedule/validate', data)
    return response.data
  }
}

export const workScheduleService = new WorkScheduleService()
