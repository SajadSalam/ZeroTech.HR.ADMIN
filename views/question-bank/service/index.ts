import axios from '~/services/app-client/axios'
import type { PaginatedResponse } from '~/utils/types/ApiResponses'
import type {
    QuestionBankCreateDto,
    QuestionBankDto,
    QuestionBankFilters,
} from '../types'

interface IQuestionBankService {
  get: (filters: QuestionBankFilters) => Promise<PaginatedResponse<QuestionBankDto>>
  create: (data: QuestionBankCreateDto) => Promise<QuestionBankDto>
  update: (id: string, data: QuestionBankCreateDto) => Promise<QuestionBankDto>
  delete: (id: string) => Promise<void>
}

export class QuestionBankService implements IQuestionBankService {

  async get(filters: QuestionBankFilters): Promise<PaginatedResponse<QuestionBankDto>> {
    const response = await axios.get<PaginatedResponse<QuestionBankDto>>('/question-banks', {
      params: filters,
    })
    return response.data
  }

  /**
   * Creates a new question bank.
   * @param data - The data for the new question bank.
   * @returns A promise that resolves to the created question bank data.
   */
  async create(data: QuestionBankCreateDto): Promise<QuestionBankDto> {
    const response = await axios.post<QuestionBankDto>('/question-banks', data)
    return response.data
  }

  /**
   * Updates an existing question bank by its ID.
   * @param id - The ID of the question bank to update.
   * @param data - The updated data for the question bank.
   * @returns A promise that resolves to the updated question bank data.
   */
  async update(id: string, data: QuestionBankCreateDto): Promise<QuestionBankDto> {
    const response = await axios.put<QuestionBankDto>('/question-banks/' + id, data)
    return response.data
  }

  /**
   * Deletes a question bank by its ID.
   * @param id - The ID of the question bank to delete.
   * @returns A promise that resolves when the question bank is deleted.
   */
  async delete(id: string): Promise<void> {
    await axios.delete(`/question-banks/${id}`)
  }

  async deleteQuestions(questionIds: string[]): Promise<void> {
    await axios.delete(`/question/bulk-delete`, {
      data: questionIds
    })
  }
}
