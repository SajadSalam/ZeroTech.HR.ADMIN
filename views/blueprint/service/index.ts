import axiosIns from '~/services/app-client/axios'
import type { Blueprint, BlueprintDto, QuestionBankBlueprintDetails } from '../types'
import type { BaseFilters, PaginatedResponse, WithoutPagination } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'

interface IBlueprintService {
  get: (filters: BaseFilters) => Promise<PaginatedResponse<BlueprintDto>>
  create: (blueprint: Blueprint) => Promise<BlueprintDto>
  delete: (id: string) => Promise<void>
  getQuestionBankBlueprintDetails: (questionBankId: string) => Promise<QuestionBankBlueprintDetails>
}

export class BlueprintService implements IBlueprintService {
  async get(filters: BaseFilters): Promise<PaginatedResponse<BlueprintDto>> {
    const response = await axiosIns.get<PaginatedResponse<BlueprintDto>>('/exam-templates', {
      params: filters,
    })
    return response.data
  }

  async create(blueprint: Blueprint): Promise<BlueprintDto> {
    const response = await axiosIns.post<BlueprintDto>('/exam-templates', blueprint)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await axiosIns.delete(`/exam-templates/${id}`)
  }
  async getById(id: string): Promise<BlueprintDto> {
    const response = await axiosIns.get<BlueprintDto>(`/exam-templates/${id}`)
    return response.data
  }

  async getQuestionBankBlueprintDetails(questionBankId: string): Promise<QuestionBankBlueprintDetails> {
    const response = await axiosIns.get<QuestionBankBlueprintDetails>(`/question-bank/${questionBankId}/blueprint-details`)
    return response.data
  }
}
