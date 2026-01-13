import axios from '~/services/app-client/axios'
import type { PaginatedResponse } from '~/utils/types/index'
import type {
    CancelRequestDto,
    EmployeeBalanceDto,
    PendingApprovalDto,
    ProcessApprovalDto,
    RequestCreateDto,
    RequestDto,
    RequestFilters,
    RequestStatus,
    RequestUpdateDto,
} from '../types'

interface IRequestService {
  get: (filters: RequestFilters) => Promise<PaginatedResponse<RequestDto>>
  getById: (id: number) => Promise<RequestDto>
  getByEmployee: (employeeId: number, status?: RequestStatus) => Promise<RequestDto[]>
  getByStatus: (status: RequestStatus) => Promise<RequestDto[]>
  getPendingApprovals: () => Promise<PendingApprovalDto[]>
  getEmployeeBalance: (employeeId: number) => Promise<EmployeeBalanceDto>
  create: (data: RequestCreateDto) => Promise<RequestDto>
  update: (id: number, data: RequestUpdateDto) => Promise<RequestDto>
  processApproval: (data: ProcessApprovalDto) => Promise<RequestDto>
  cancel: (data: CancelRequestDto) => Promise<RequestDto>
  delete: (id: number) => Promise<void>
}

export class RequestService implements IRequestService {
  private readonly baseUrl = '/request'

  async get(filters: RequestFilters): Promise<PaginatedResponse<RequestDto>> {
    try {
      const response = await axios.get<PaginatedResponse<RequestDto>>(`${this.baseUrl}`, { params:filters as any })
      return response.data
    } catch (error) {
      console.error('Error fetching requests:', error)
      throw error
    }
  }

  async getById(id: number): Promise<RequestDto> {
    try {
      const response = await axios.get<RequestDto>(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching request ${id}:`, error)
      throw error
    }
  }

  async getByEmployee(employeeId: number, status?: RequestStatus): Promise<RequestDto[]> {
    try {
      const response = await axios.get<RequestDto[]>(`${this.baseUrl}/employee/${employeeId}`, { params: { status } as any })
      return response.data
    } catch (error) {
      console.error(`Error fetching requests for employee ${employeeId}:`, error)
      throw error
    }
  }

  async getByStatus(status: RequestStatus): Promise<RequestDto[]> {
    try {
      const response = await axios.get<RequestDto[]>(`${this.baseUrl}/status/${status}`, { params: { status } as any })
      return response.data
    } catch (error) {
      console.error(`Error fetching requests with status ${status}:`, error)
      throw error
    }
  }

  async getPendingApprovals(): Promise<PendingApprovalDto[]> {
    try {
      const response = await axios.get<PendingApprovalDto[]>(`${this.baseUrl}/pending-approvals`)
      return response.data
    } catch (error) {
      console.error('Error fetching pending approvals:', error)
      throw error
    }
  }

  async getEmployeeBalance(employeeId: number): Promise<EmployeeBalanceDto> {
    try {
      const response = await axios.get<EmployeeBalanceDto>(`/employee/${employeeId}/balance`)
      return response.data
    } catch (error) {
      console.error(`Error fetching balance for employee ${employeeId}:`, error)
      throw error
    }
  }

  async create(data: RequestCreateDto): Promise<RequestDto> {
    try {
      const response = await axios.post<RequestDto>(this.baseUrl, data)
      return response.data
    } catch (error) {
      console.error('Error creating request:', error)
      throw error
    }
  }

  async update(id: number, data: RequestUpdateDto): Promise<RequestDto> {
    try {
      const response = await axios.put<RequestDto>(`${this.baseUrl}/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Error updating request ${id}:`, error)
      throw error
    }
  }

  async processApproval(data: ProcessApprovalDto): Promise<RequestDto> {
    try {
      const response = await axios.post<RequestDto>(`${this.baseUrl}/approve`, data)
      return response.data
    } catch (error) {
      console.error('Error processing approval:', error)
      throw error
    }
  }

  async cancel(data: CancelRequestDto): Promise<RequestDto> {
    try {
      const response = await axios.post<RequestDto>(`${this.baseUrl}/cancel`, data)
      return response.data
    } catch (error) {
      console.error('Error cancelling request:', error)
      throw error
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      console.error(`Error deleting request ${id}:`, error)
      throw error
    }
  }
}

export const requestService = new RequestService()
