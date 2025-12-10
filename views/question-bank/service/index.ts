import axios from '~/services/app-client/axios'
import type { PaginatedResponse } from '~/utils/types/ApiResponses'
import type { Employee } from '~/views/employee/types'
import type {
    QuestionBankCreateDto,
    QuestionBankDto,
    QuestionBankFilters,
} from '../types'
import type { AssignForm, AssignType } from '../types/assign'

interface IQuestionBankService {
  get: (filters: QuestionBankFilters) => Promise<PaginatedResponse<QuestionBankDto>>
  create: (data: QuestionBankCreateDto) => Promise<QuestionBankDto>
  update: (id: string, data: QuestionBankCreateDto) => Promise<QuestionBankDto>
  delete: (id: string) => Promise<void>
  getById: (id: string) => Promise<QuestionBankDto>
  assignEmployees: (questionBankId: string, data: AssignForm) => Promise<void>
  getAssignedEmployees: (questionBankId: string, type: AssignType) => Promise<Employee[]>
}

export class QuestionBankService implements IQuestionBankService {

  async get(filters: QuestionBankFilters): Promise<PaginatedResponse<QuestionBankDto>> {
    const response = await axios.get<PaginatedResponse<QuestionBankDto>>('/question-banks', {
      params: filters,
    })
    return response.data
  }
  async create(data: QuestionBankCreateDto): Promise<QuestionBankDto> {
    const response = await axios.post<QuestionBankDto>('/question-banks', data)
    return response.data
  }
  async update(id: string, data: QuestionBankCreateDto): Promise<QuestionBankDto> {
    const response = await axios.put<QuestionBankDto>('/question-banks/' + id, data)
    return response.data
  }
  async delete(id: string): Promise<void> {
    await axios.delete(`/question-banks/${id}`)
  }
  async getById(id: string): Promise<QuestionBankDto> {
    const response = await axios.get<QuestionBankDto>(`/question-banks/${id}`)
    return response.data
  }
  async assignEmployees(questionBankId: string, data: AssignForm): Promise<void> {
    await axios.post(`/question-banks/${questionBankId}/employees`, data)
  }
  async getAssignedEmployees(questionBankId: string, type: AssignType): Promise<Employee[]> {
    const response = await axios.get<Employee[]>(`/question-banks/${questionBankId}/employees?type=${type}`)
    return response.data
  }

  async removeTopic(questionBankId: string, topicId: string): Promise<void> {
    await axios.delete(`/question-banks/${questionBankId}/topics/${topicId}`)
  }

  async addTopic(questionBankId: string, topicId: string): Promise<void> {
    await axios.post(`/question-banks/${questionBankId}/topics`, { topicId })
  }

}
