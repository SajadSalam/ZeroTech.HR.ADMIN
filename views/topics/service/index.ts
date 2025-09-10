import axios from '~/services/app-client/axios'
import type { BaseFilters, PaginatedResponse } from '~/utils/types/ApiResponses'
import type { Topic, TopicDto, TopicFilters } from '../types'

interface ITopicService {
  get: (filters: TopicFilters) => Promise<PaginatedResponse<TopicDto>>
  create: (data: Topic) => Promise<TopicDto>
  update: (id: string, data: Topic) => Promise<TopicDto>
  delete: (id: string) => Promise<void>
}

export class TopicService implements ITopicService {
  async get(filters: TopicFilters): Promise<PaginatedResponse<TopicDto>> {
    const response = await axios.get<PaginatedResponse<TopicDto>>('/topics', { params: filters })
    return response.data
  }

  async create(data: Topic): Promise<TopicDto> {
    const response = await axios.post<TopicDto>('/topics', data)
    return response.data
  }

  async update(id: string, data: Topic): Promise<TopicDto> {
    const response = await axios.put<TopicDto>('/topics/' + id, data)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`/topics/${id}`)
  }
}
