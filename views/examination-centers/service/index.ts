import axios from '~/services/app-client/axios'
import type { BaseFilters, PaginatedResponse } from '~/utils/types/ApiResponses'
import type { ExamDto } from '~/views/exams/types'
import type { ExamCenterStatistics, ExaminationCenter, ExaminationCenterDto, OtpResponse } from '../types'
import type { ProgressStatistics } from '../types/progress'
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

  async assignSurrogateManager(id: string, data: { managerId: number }): Promise<void> {
    await axios.put(`/exam-center/${id}/assign-surrogate-manager`, data)
  }


  async getExams(id: string): Promise<ExamDto[]> {
    const response = await axios.get<ExamDto[]>(`/examtoexamcenter/exam-center/${id}`)
    return response.data
  }

  async checkIn(id: string): Promise<OtpResponse> {
    const response = await axios.post(`/externalstudentexam/check-in/${id}`)
    return response.data
  }

  async getBookedStudents(filters: BaseFilters): Promise<PaginatedResponse<ExaminationCenterDto>> {
    const response = await axios.get<PaginatedResponse<ExaminationCenterDto>>(`/external-student-booking/all-student-tickets`,{ params:filters })
    return response.data
  }

  async getExamCenterStatistics(id: string): Promise<ExamCenterStatistics> {
    const response = await axios.get<ExamCenterStatistics>(`/exam-center/${id}/statistics`)
    return response.data
  }

  async getHallStatistics(id: string): Promise<ProgressStatistics> {
    const response = await axios.get<ProgressStatistics>(`/external-student-exam/hall/${id}/statistics`)
    return response.data
  }

  async getProgressStudents(id: string, filters: BaseFilters): Promise<PaginatedResponse<ProgressStudent>> {
    const response = await axios.get<PaginatedResponse<ProgressStudent>>(`/external-student-exam/hall/${id}/students`, { params: filters })
    return response.data
  }

  async setManagerSignature(id: string, signatureFile: File): Promise<void> {
    const formData = new FormData()
    formData.append('File', signatureFile)
    await axios.post(`/exam-center/${id}/signature`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  async generateSupervisorOTP(): Promise<{ otp: string }> {
    const response = await axios.get('/externalstudentexam/generate-supervisor-otp')
    return response.data
  }

  async blacklistStudent(data: { ticketId: string; reason: string }): Promise<void> {
    await axios.post('/externalstudentblacklist', data)
  }
}
