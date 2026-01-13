import axios from '~/services/app-client/axios'
import type { PaginatedResponse } from '~/utils/types'
import type {
  ApprovalChainDto,
  ApprovalChainCreateDto,
  ApprovalChainUpdateDto,
  ApprovalChainFilters,
  ApprovalStepDto,
  ApprovalStepCreateDto,
  ApprovalStepUpdateDto,
} from '../types'

interface IApprovalChainService {
  // Approval Chain methods
  get: (filters: ApprovalChainFilters) => Promise<PaginatedResponse<ApprovalChainDto>>
  getById: (id: string | number) => Promise<ApprovalChainDto>
  getByRequestTypeAndDepartment: (requestTypeId: number, departmentId: number) => Promise<ApprovalChainDto[]>
  getPrimary: (requestTypeId: number, departmentId: number) => Promise<ApprovalChainDto>
  create: (data: ApprovalChainCreateDto) => Promise<ApprovalChainDto>
  update: (id: string | number, data: ApprovalChainUpdateDto) => Promise<ApprovalChainDto>
  delete: (id: string | number) => Promise<void>
  
  // Approval Step methods
  getStepsByChain: (approvalChainId: number) => Promise<ApprovalStepDto[]>
  getStepById: (id: string | number) => Promise<ApprovalStepDto>
  getFirstStep: (approvalChainId: number) => Promise<ApprovalStepDto>
  getNextStep: (approvalChainId: number, currentStepOrder: number) => Promise<ApprovalStepDto>
  createStep: (data: ApprovalStepCreateDto) => Promise<ApprovalStepDto>
  updateStep: (id: string | number, data: ApprovalStepUpdateDto) => Promise<ApprovalStepDto>
  deleteStep: (id: string | number) => Promise<void>
}

export class ApprovalChainService implements IApprovalChainService {
  private baseUrl = '/ApprovalChain'
  private stepBaseUrl = '/ApprovalStep'

  // Approval Chain methods
  async get(filters: ApprovalChainFilters): Promise<PaginatedResponse<ApprovalChainDto>> {
    try {
      const response = await axios.get<PaginatedResponse<ApprovalChainDto>>(`${this.baseUrl}`, { params:filters as any })
      return response.data
    } catch (error) {
      console.error('Error fetching approval chains:', error)
      throw error
    }
  }

  async getById(id: string | number): Promise<ApprovalChainDto> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching approval chain with id ${id}:`, error)
      throw error
    }
  }

  async getByRequestTypeAndDepartment(requestTypeId: number, departmentId: number): Promise<ApprovalChainDto[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/by-request-type-and-department?requestTypeId=${requestTypeId}&departmentId=${departmentId}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching approval chains for request type ${requestTypeId} and department ${departmentId}:`, error)
      throw error
    }
  }

  async getPrimary(requestTypeId: number, departmentId: number): Promise<ApprovalChainDto> {
    try {
      const response = await axios.get(`${this.baseUrl}/primary?requestTypeId=${requestTypeId}&departmentId=${departmentId}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching primary approval chain for request type ${requestTypeId} and department ${departmentId}:`, error)
      throw error
    }
  }

  async create(data: ApprovalChainCreateDto): Promise<ApprovalChainDto> {
    try {
      const response = await axios.post(this.baseUrl, data)
      return response.data
    } catch (error) {
      console.error('Error creating approval chain:', error)
      throw error
    }
  }

  async update(id: string | number, data: ApprovalChainUpdateDto): Promise<ApprovalChainDto> {
    try {
      const response = await axios.put(`${this.baseUrl}/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Error updating approval chain with id ${id}:`, error)
      throw error
    }
  }

  async delete(id: string | number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      console.error(`Error deleting approval chain with id ${id}:`, error)
      throw error
    }
  }

  // Approval Step methods
  async getStepsByChain(approvalChainId: number): Promise<ApprovalStepDto[]> {
    try {
      const response = await axios.get(`${this.stepBaseUrl}/by-approval-chain/${approvalChainId}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching approval steps for chain ${approvalChainId}:`, error)
      throw error
    }
  }

  async getStepById(id: string | number): Promise<ApprovalStepDto> {
    try {
      const response = await axios.get(`${this.stepBaseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching approval step with id ${id}:`, error)
      throw error
    }
  }

  async getFirstStep(approvalChainId: number): Promise<ApprovalStepDto> {
    try {
      const response = await axios.get(`${this.stepBaseUrl}/first/${approvalChainId}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching first step for chain ${approvalChainId}:`, error)
      throw error
    }
  }

  async getNextStep(approvalChainId: number, currentStepOrder: number): Promise<ApprovalStepDto> {
    try {
      const response = await axios.get(`${this.stepBaseUrl}/next?approvalChainId=${approvalChainId}&currentStepOrder=${currentStepOrder}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching next step for chain ${approvalChainId} after step ${currentStepOrder}:`, error)
      throw error
    }
  }

  async createStep(data: ApprovalStepCreateDto): Promise<ApprovalStepDto> {
    try {
      const response = await axios.post(this.stepBaseUrl, data)
      return response.data
    } catch (error) {
      console.error('Error creating approval step:', error)
      throw error
    }
  }

  async updateStep(id: string | number, data: ApprovalStepUpdateDto): Promise<ApprovalStepDto> {
    try {
      const response = await axios.put(`${this.stepBaseUrl}/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Error updating approval step with id ${id}:`, error)
      throw error
    }
  }

  async deleteStep(id: string | number): Promise<void> {
    try {
      await axios.delete(`${this.stepBaseUrl}/${id}`)
    } catch (error) {
      console.error(`Error deleting approval step with id ${id}:`, error)
      throw error
    }
  }
}

export const approvalChainService = new ApprovalChainService()
