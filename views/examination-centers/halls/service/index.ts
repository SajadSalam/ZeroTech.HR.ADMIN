import axios from '~/services/app-client/axios'
import type { PaginatedResponse } from '~/utils/types/ApiResponses'
import type { Hall, HallDto, HallFilters, Supervisor } from '../types'

interface IHallService {
  get: (filters: HallFilters) => Promise<PaginatedResponse<HallDto>>
  create: (data: Hall) => Promise<HallDto>
  update: (id: string, data: Hall) => Promise<HallDto>
  delete: (id: string) => Promise<void>
  assignSupervisor: (id: string, data: { supervisorId: string }) => Promise<void>
  assignMultipleSupervisors: (id: string, data: { supervisors: Supervisor[] }) => Promise<void>
}

export class HallService implements IHallService {
  async get(filters: HallFilters): Promise<PaginatedResponse<HallDto>> {
    const response = await axios.get<PaginatedResponse<HallDto>>('/exam-center-halls', { params: filters })
    return response.data
  }

  async create(data: Hall): Promise<HallDto> {
    const response = await axios.post<HallDto>('/exam-center-halls', data)
    return response.data
  }

  async update(id: string, data: Hall): Promise<HallDto> {
    const response = await axios.put<HallDto>('/exam-center-halls/' + id, data)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`/exam-center-halls/${id}`)
  }


  async assignSupervisor(id: string, data: { supervisorId: string }): Promise<void> {
    await axios.put(`/exam-center-halls/${id}/assign-supervisor`, data)
  }

  async assignMultipleSupervisors(id: string, data: { supervisors: Supervisor[] }): Promise<void> {
    await axios.put(`/exam-center-halls/${id}/assign-multiple-supervisors`, data)
  }
}
