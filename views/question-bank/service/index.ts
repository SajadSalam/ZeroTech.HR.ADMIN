import axios from '~/services/app-client/axios'
import type { BaseFilters, PaginatedResponse, WithoutPagination } from '~/utils/types/ApiResponses'
import type {
  QuestionBankDto,
  QuestionBankCreateDto,
  QuestionBankFilters,
  QuestionBankDetailedDto,
  AssignForm,
  AssignDto,
  QuestionBank,
  QuestionBankTopicUpdate,
  AssignType,
} from '../types'
import { QuestionType, type Question, type QuestionDto } from '../types/question'
import { QUESTION_BANK_ROUTES } from '../types'

interface IQuestionBankService {
  get: (filters: QuestionBankFilters) => Promise<PaginatedResponse<QuestionBankDto>>
  create: (data: QuestionBankCreateDto) => Promise<QuestionBankDto>
  update: (id: string, data: QuestionBankCreateDto) => Promise<QuestionBankDto>
  delete: (id: string) => Promise<void>
  getDetailed: (id: string) => Promise<QuestionBankDetailedDto>

  saveQuestions(questionBankId: string, questions: Question[]): Promise<void>

  getQuestions(filters: BaseFilters): Promise<PaginatedResponse<QuestionDto>>

  approveQuestion(questionId: string): Promise<QuestionDto>

  rejectQuestion(questionId: string, body: { rejectReason?: string | null }): Promise<QuestionDto>

  assignAuditor(questionBankId: string, data: AssignForm[]): Promise<boolean>

  assignCreator(questionBankId: string, data: AssignForm[]): Promise<boolean>

  getAssigns(questionBankId: string, type: AssignType): Promise<WithoutPagination<AssignDto>>

  addTopic(questionBankId: string, topic: QuestionBankTopicUpdate): Promise<boolean>

  removeTopic(questionBankId: string, topicId: string): Promise<boolean>
  importQuestions(questionBankId: string, file: File, questionType: QuestionType): Promise<void>
}

export class QuestionBankService implements IQuestionBankService {
  async getAssigns(
    questionBankId: string,
    type: AssignType
  ): Promise<WithoutPagination<AssignDto>> {
    const response = await axios.get<WithoutPagination<AssignDto>>(
      '/question-bank/' + questionBankId + '/assign',
      {
        params: { type: type.toString() },
      }
    )
    return response.data
  }

  async assignAuditor(questionBankId: string, data: AssignForm[]): Promise<boolean> {
    const response = await axios.put<boolean>(
      '/question-bank/' + questionBankId + '/assign-auditors',
      data
    )
    return response.data
  }

  async assignCreator(questionBankId: string, data: AssignForm[]): Promise<boolean> {
    const response = await axios.put<boolean>(
      '/question-bank/' + questionBankId + '/assign-creators',
      data
    )
    return response.data
  }

  /**
   * Approves a question by its ID.
   * @param questionId - The ID of the question to approve.
   * @returns A promise that resolves to the approved question data.
   */
  async approveQuestion(questionId: string): Promise<QuestionDto> {
    const response = await axios.put<QuestionDto>('/question/' + questionId + '/approve')
    return response.data
  }

  /**
   * Rejects a question by its ID with an optional reject reason.
   * @param questionId - The ID of the question to reject.
   * @param body - The body containing the reject reason.
   * @returns A promise that resolves to the rejected question data.
   */
  async rejectQuestion(
    questionId: string,
    body: { rejectReason?: string | null }
  ): Promise<QuestionDto> {
    const response = await axios.put<QuestionDto>('/question/' + questionId + '/reject', body)
    return response.data
  }

  /**
   * Retrieves a list of questions with optional filters.
   * @param filters - The filters to apply when retrieving questions.
   * @returns A promise that resolves to a paginated response of questions.
   */
  async getQuestions(filters: BaseFilters): Promise<PaginatedResponse<QuestionDto>> {
    const response = await axios.get<PaginatedResponse<QuestionDto>>('/question', {
      params: filters,
    })
    return response.data
  }

  /**
   * Saves multiple questions to a question bank.
   * @param questionBankId - The ID of the question bank.
   * @param questions - The list of questions to save.
   * @returns A promise that resolves when the questions are saved.
   */
  async saveQuestions(questionBankId: string, questions: Question[]): Promise<void> {
    const response = await axios.post<void>('/question/' + questionBankId + '/multi', questions)
    return response.data
  }

  /**
   * Retrieves detailed information about a question bank by its ID.
   * @param id - The ID of the question bank.
   * @returns A promise that resolves to the detailed question bank data.
   */
  async getDetailed(id: string): Promise<QuestionBankDetailedDto> {
    const response = await axios.get<QuestionBankDetailedDto>('/question-bank/' + id + '/details')
    return response.data
  }

  /**
   * Retrieves a list of question banks with optional filters.
   * @param filters - The filters to apply when retrieving question banks.
   * @returns A promise that resolves to a paginated response of question banks.
   */
  async get(filters: QuestionBankFilters): Promise<PaginatedResponse<QuestionBankDto>> {
    const response = await axios.get<PaginatedResponse<QuestionBankDto>>('/question-bank', {
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
    const response = await axios.post<QuestionBankDto>('/question-bank', data)
    return response.data
  }

  /**
   * Updates an existing question bank by its ID.
   * @param id - The ID of the question bank to update.
   * @param data - The updated data for the question bank.
   * @returns A promise that resolves to the updated question bank data.
   */
  async update(id: string, data: QuestionBank): Promise<QuestionBankDto> {
    const response = await axios.put<QuestionBankDto>('/question-bank/' + id, data)
    return response.data
  }

  /**
   * Deletes a question bank by its ID.
   * @param id - The ID of the question bank to delete.
   * @returns A promise that resolves when the question bank is deleted.
   */
  async delete(id: string): Promise<void> {
    await axios.delete(`/question-bank/${id}`)
  }

  async addTopic(questionBankId: string, topic: QuestionBankTopicUpdate): Promise<boolean> {
    return (await axios.post<boolean>(`/question-bank/${questionBankId}/add-topic`, topic)).data
  }

  async removeTopic(questionBankId: string, topicId: string): Promise<boolean> {
    return (await axios.delete<boolean>(`/question-bank/${questionBankId}/remove-topic/${topicId}`))
      .data
  }
  async importQuestions(
    questionBankId: string,
    file: File,
    questionType: QuestionType
  ): Promise<void> {
    const formData = new FormData()
    formData.append('file', file)

    let uploadRoute: string

    switch (questionType) {
      case QuestionType.MultipleChoice:
        uploadRoute = QUESTION_BANK_ROUTES.BULK_UPLOAD.MULTIPLE_CHOICE(questionBankId)
        break
      case QuestionType.Blank:
        uploadRoute = QUESTION_BANK_ROUTES.BULK_UPLOAD.BLANK(questionBankId)
        break
      case QuestionType.TrueOrFalse:
        uploadRoute = QUESTION_BANK_ROUTES.BULK_UPLOAD.TRUE_FALSE(questionBankId)
        break
      default:
        throw new Error('Unsupported question type for bulk upload')
    }

    await axios.post(uploadRoute, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
}
