import axiosIns from '~/services/app-client/axios'
import type { BlueprintDetailes, BlueprintCreate, BlueprintDto, CountDetails } from '../types'
import type { BaseFilters, PaginatedResponse } from '~/utils/types/ApiResponses'

interface IBlueprintService {
  get: (filters: BaseFilters) => Promise<PaginatedResponse<BlueprintDto>>
  create: (blueprint: BlueprintCreate) => Promise<BlueprintDto>
  update: (id: string, blueprint: BlueprintCreate) => Promise<BlueprintDto>
  delete: (id: string) => Promise<void>
  getById: (id: string) => Promise<BlueprintDetailes>
}

export class BlueprintService implements IBlueprintService {
  async get(filters: BaseFilters): Promise<PaginatedResponse<BlueprintDto>> {
    const response = await axiosIns.get<PaginatedResponse<BlueprintDto>>('/exam-templates', {
      params: filters,
    })
    return response.data
  }

  async create(blueprint: BlueprintCreate): Promise<BlueprintDto> {
    const response = await axiosIns.post<BlueprintDto>('/exam-templates', blueprint)
    return response.data
  }

  async update(id: string, blueprint: BlueprintCreate): Promise<BlueprintDto> {
    const response = await axiosIns.put<BlueprintDto>(`/exam-templates/${id}`, blueprint)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await axiosIns.delete(`/exam-templates/${id}`)
  }
  async getById(id: string): Promise<BlueprintDetailes> {
    const response = await axiosIns.get<BlueprintDetailes>(`/exam-templates/${id}`)
    return response.data
  }
  
}
