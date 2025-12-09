import axiosIns from '~/services/app-client/axios'
import type { BaseFilters, PaginatedResponse } from '~/utils/types/ApiResponses'
import type { QuestionDto } from '~/views/questions/types'
import type { StudentFilters } from '~/views/students/types'
import type { ExamCreate, ExamDetailed, ExamDto, ExamEdit, LinkedExam } from '../types'

interface IExamService {
  get: (filters: BaseFilters) => Promise<PaginatedResponse<ExamDto>>
  create: (blueprint: ExamCreate) => Promise<ExamDto>
  delete: (id: string) => Promise<void>
  getById: (id: string) => Promise<ExamDetailed>
  getLinkedStudents: (id: string, filters: StudentFilters) => Promise<LinkedExam>
  replaceQuestion: (examId: string, questionId: string) => Promise<QuestionDto>
  getQuestions: (examId: string, date: string) => Promise<QuestionDto[]>
}

export class ExamService implements IExamService {
  async get(filters: BaseFilters): Promise<PaginatedResponse<ExamDto>> {
    const response = await axiosIns.get<PaginatedResponse<ExamDto>>('/exam', { params: filters })
    return response.data
  }

  async create(blueprint: ExamCreate): Promise<ExamDto> {
    const response = await axiosIns.post<ExamDto>('/exam', blueprint)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await axiosIns.delete(`/exam/${id}`)
  }

  async getById(id: string): Promise<ExamDetailed> {
    const response = await axiosIns.get<ExamDetailed>(`/exam/${id}`)
    return response.data
  }

  async getLinkedStudents(id: string, filters: StudentFilters): Promise<LinkedExam> {
    const response = await axiosIns.get<LinkedExam>(`/exam/${id}/linked-exam`, {
      params: filters,
    })
    return response.data
  }

  async replaceQuestion(examId: string, questionId: string): Promise<QuestionDto> {
    const response = await axiosIns.put<QuestionDto>(
      `/exam/${examId}/replace-question/${questionId}`
    )
    return response.data
  }
  async getQuestions(examId: string, date: string): Promise<QuestionDto[]> {
    const response = await axiosIns.get<QuestionDto[]>(`/exam/${examId}/questions/?examDate=${date}`)
    return response.data
  }
  // reshuffling
  async reshuffleQuestions(examId: string, date: string): Promise<QuestionDto[]> {
    const response = await axiosIns.post<QuestionDto[]>(`/exam/${examId}/reshuffling?examDate=${date}`)
    return response.data
  }
  async update(id: string, data: ExamEdit): Promise<ExamDto> {
    const response = await axiosIns.put<ExamDto>('/exam/' + id, data)
    return response.data
  }
  async cancel(id: string): Promise<void> {
    await axiosIns.delete(`/exam/${id}/cancel`)
  }
  async addCurve(id: string, data: { curveValue: number; curveType: number }): Promise<ExamDto> {
    const response = await axiosIns.post<ExamDto>(`/exam/${id}/add-curve`, data)
    return response.data
  }
}
