import axios from '~/services/app-client/axios'
import type { BaseFilters, PaginatedResponse } from '~/utils/types/ApiResponses'
import type { ExaminationCenter, ExaminationCenterDto } from '../types'
import type { ExamDto } from '~/views/exams/types'
interface IExaminationCenterService {
  get: (filters: BaseFilters) => Promise<PaginatedResponse<ExaminationCenterDto>>
  create: (data: ExaminationCenter) => Promise<ExaminationCenterDto>
  update: (id: string, data: ExaminationCenter) => Promise<ExaminationCenterDto>
  delete: (id: string) => Promise<void>
}

export class ExaminationCenterService implements IExaminationCenterService {
  async get(filters: BaseFilters): Promise<PaginatedResponse<ExaminationCenterDto>> {
    const response = await axios.get<PaginatedResponse<ExaminationCenterDto>>('/exam-center', {
      params: filters,
    })
    return response.data
  }

  async create(data: ExaminationCenter): Promise<ExaminationCenterDto> {
    const response = await axios.post<ExaminationCenterDto>('/exam-center', data)
    return response.data
  }

  async update(id: string, data: ExaminationCenter): Promise<ExaminationCenterDto> {
    const response = await axios.put<ExaminationCenterDto>('/exam-center/' + id, data)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`/examcenter/${id}`)
  }

  async getById(id: string): Promise<ExaminationCenterDto> {
    const response = await axios.get<ExaminationCenterDto>('/exam-center/' + id)
    return response.data
  }


  async assignManager(id: string, data: { managerId: number }): Promise<void> {
    await axios.put(`/exam-center/${id}/assign-manager`, data)
  }

  async assignSegregateManager(id: string, data: { managerId: number }): Promise<void> {
    await axios.put(`/exam-center/${id}/assign-segregate-manager`, data)
  }


  async getExams(id: string): Promise<ExamDto[]> {
    const response = await axios.get<ExamDto[]>(`/examtoexamcenter/exam-center/${id}`)
    return response.data
  }

}
