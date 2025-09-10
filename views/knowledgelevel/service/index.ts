import axios from '~/services/app-client/axios'
import type { PaginatedResponse } from '~/utils/types/ApiResponses'
import type { Knowledgelevel, KnowledgelevelDto, KnowledgelevelFilters } from '../types'

interface IKnowledgelevelService {
  get: (filters: KnowledgelevelFilters) => Promise<PaginatedResponse<KnowledgelevelDto>>
  create: (data: Knowledgelevel) => Promise<KnowledgelevelDto>
  update: (id: string, data: Knowledgelevel) => Promise<KnowledgelevelDto>
  delete: (id: string) => Promise<void>
}

export class KnowledgelevelService implements IKnowledgelevelService {
  async get(filters: KnowledgelevelFilters): Promise<PaginatedResponse<KnowledgelevelDto>> {
    const response = await axios.get<PaginatedResponse<KnowledgelevelDto>>('/knowledgelevel', { params: filters })
    return response.data
  }

  async create(data: Knowledgelevel): Promise<KnowledgelevelDto> {
    const response = await axios.post<KnowledgelevelDto>('/knowledgelevel', data)
    return response.data
  }

  async update(id: string, data: Knowledgelevel): Promise<KnowledgelevelDto> {
    const response = await axios.put<KnowledgelevelDto>('/knowledgelevel/' + id, data)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`/knowledgelevel/${id}`)
  }
}
