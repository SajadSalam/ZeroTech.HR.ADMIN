import axiosIns from '~/services/app-client/axios'
import type { Blueprint, BlueprintDto } from '../types'
import type { BaseFilters, PaginatedResponse, WithoutPagination } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'

interface IBlueprintService {
  get: (filters: BaseFilters) => Promise<PaginatedResponse<BlueprintDto>>
  create: (blueprint: Blueprint) => Promise<BlueprintDto>
  delete: (id: string) => Promise<void>
}

export class BlueprintService implements IBlueprintService {
  async get(filters: BaseFilters): Promise<PaginatedResponse<BlueprintDto>> {
    const response = await axiosIns.get<PaginatedResponse<BlueprintDto>>('/examtemplate', {
      params: filters,
    })
    return response.data
  }

  async create(blueprint: Blueprint): Promise<BlueprintDto> {
    const response = await axiosIns.post<BlueprintDto>('/examtemplate', blueprint)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await axiosIns.delete(`/examtemplate/${id}`)
  }
  async getById(id: string): Promise<BlueprintDto> {
    const response = await axiosIns.get<BlueprintDto>(`/examtemplate/${id}`)
    return response.data
  }
}
