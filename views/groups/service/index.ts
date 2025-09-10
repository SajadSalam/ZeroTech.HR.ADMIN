import axios from '~/services/app-client/axios'
import type { BaseFilters, PaginatedResponse } from '~/utils/types/ApiResponses'
import type { GroupCreate, Group, GroupDto } from '~/views/groups/types'

interface IGroupService {
  get: (filters: BaseFilters) => Promise<PaginatedResponse<GroupDto>>
  create: (data: GroupCreate) => Promise<boolean>
  delete: (id: string) => Promise<void>
  update: (id: string, data: GroupCreate) => Promise<boolean>
}

export class GroupService implements IGroupService {
  async update(id: string, data: GroupCreate): Promise<boolean> {
    const response = await axios.put<boolean>('/groups/' + id, data)
    return response.data
  }
  async get(filters: BaseFilters): Promise<PaginatedResponse<GroupDto>> {
    const response = await axios.get<PaginatedResponse<GroupDto>>('/groups', { params: filters })
    return response.data
  }

  async create(data: Group): Promise<boolean> {
    const response = await axios.post<boolean>('/groups', data)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`/groups/${id}`)
  }
}
