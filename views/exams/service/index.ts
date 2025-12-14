import axiosIns from '~/services/app-client/axios'
import type { BaseFilters, PaginatedResponse } from '~/utils/types/ApiResponses'
import type { ExamCreate, ExamDto, ScheduleExam } from '../types'

interface IExamService {
  get: (filters: BaseFilters) => Promise<PaginatedResponse<ExamDto>>
  create: (Exam: ExamCreate) => Promise<ExamDto>
  reshuffleQuestions: (examId: string) => Promise<void>
  extendDuration: (examId: string, durationMinutes: number) => Promise<void>
  replace: (examId: string, questionId: string) => Promise<void>
  updateSchedule: (examId: string, schedule: ScheduleExam) => Promise<void>
}

export class ExamService implements IExamService {
  async get(filters: BaseFilters): Promise<PaginatedResponse<ExamDto>> {
    const response = await axiosIns.get<PaginatedResponse<ExamDto>>('/exams', { params: filters })
    return response.data
  }

  async create(blueprint: ExamCreate): Promise<ExamDto> {
    const response = await axiosIns.post<ExamDto>('/exams', blueprint)
    return response.data
  }

  async reshuffleQuestions(examId: string): Promise<void> {
    const response = await axiosIns.post<void>(`/exams/${examId}/questions/reshuffle`)
    return response.data
  }
  async extendDuration(examId: string, durationMinutes: number): Promise<void> {
    const response = await axiosIns.put<void>(`/exams/${examId}/extend-duration`, { additionalMinutes: durationMinutes })
    return response.data
  }
  async replace(examId: string, examQuestionId: string): Promise<void> {
    const response = await axiosIns.put<void>(`/exams/${examId}/questions/replace`, { questionId: examQuestionId })
    return response.data
  }
  async updateSchedule(examId: string, schedule: ScheduleExam): Promise<void> {
    const response = await axiosIns.put<void>(`/exams/${examId}/schedule`, schedule)
    return response.data
  }
}
