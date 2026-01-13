import axios from '~/services/app-client/axios'
import type { PaginatedResponse } from '~/utils/types/ApiResponses'
import type {
    EmployeePayrollDto,
    EmployeePayrollFilters,
    PayrollBatchCreateDto,
    PayrollBatchDto,
    PayrollBatchFilters,
    PayrollBatchPaginationResponse,
    PayrollBatchUpdateDto,
    PayrollCalculationDto
} from '../types'

interface IPayrollService {
  // Payroll Batch operations
  getBatches: (filters: PayrollBatchFilters) => Promise<PayrollBatchPaginationResponse>
  getBatchById: (id: number) => Promise<PayrollBatchDto>
  createBatch: (data: PayrollBatchCreateDto) => Promise<PayrollBatchDto>
  updateBatch: (id: number, data: PayrollBatchUpdateDto) => Promise<PayrollBatchDto>
  deleteBatch: (id: number) => Promise<void>
  
  // Payroll Calculation operations
  calculateBatch: (batchId: number, data?: PayrollCalculationDto) => Promise<PayrollBatchDto>
  
  // Employee Payroll operations
  getEmployeePayrolls: (filters: EmployeePayrollFilters) => Promise<PaginatedResponse<EmployeePayrollDto>>
  getEmployeePayrollHistory: (employeeId: number) => Promise<EmployeePayrollDto[]>
  getEmployeePayrollById: (id: number) => Promise<EmployeePayrollDto>
  
  // Batch status operations
  approveBatch: (id: number) => Promise<PayrollBatchDto>
  markBatchAsPaid: (id: number) => Promise<PayrollBatchDto>
  cancelBatch: (id: number) => Promise<PayrollBatchDto>
}

export class PayrollService implements IPayrollService {
  // Payroll Batch operations
  async getBatches(filters: PayrollBatchFilters): Promise<PayrollBatchPaginationResponse> {
    const response = await axios.get<PayrollBatchPaginationResponse>('/Payroll/batch', { params: filters })
    return response.data
  }

  async getBatchById(id: number): Promise<PayrollBatchDto> {
    const response = await axios.get<PayrollBatchDto>(`/Payroll/batch/${id}`)
    return response.data
  }

  async createBatch(data: PayrollBatchCreateDto): Promise<PayrollBatchDto> {
    const response = await axios.post<PayrollBatchDto>('/Payroll/batch', data)
    return response.data
  }

  async updateBatch(id: number, data: PayrollBatchUpdateDto): Promise<PayrollBatchDto> {
    const response = await axios.put<PayrollBatchDto>(`/Payroll/batch/${id}`, data)
    return response.data
  }

  async deleteBatch(id: number): Promise<void> {
    await axios.delete(`/Payroll/batch/${id}`)
  }

  // Payroll Calculation operations
  async calculateBatch(batchId: number, data?: PayrollCalculationDto): Promise<PayrollBatchDto> {
    const calculationData = {
      batchId,
      ...data
    }
    const response = await axios.post<PayrollBatchDto>(`/Payroll/batch/${batchId}/calculate`, calculationData)
    return response.data
  }

  // Employee Payroll operations
  async getEmployeePayrolls(filters: EmployeePayrollFilters): Promise<PaginatedResponse<EmployeePayrollDto>> {
    const response = await axios.get<PaginatedResponse<EmployeePayrollDto>>('/Payroll/employee-payrolls', { params: filters })
    return response.data
  }

  async getEmployeePayrollHistory(employeeId: number): Promise<EmployeePayrollDto[]> {
    const response = await axios.get<EmployeePayrollDto[]>(`/Payroll/employee/${employeeId}`)
    return response.data
  }

  async getEmployeePayrollById(id: number): Promise<EmployeePayrollDto> {
    const response = await axios.get<EmployeePayrollDto>(`/Payroll/employee-payroll/${id}`)
    return response.data
  }

  // Batch status operations
  async approveBatch(id: number): Promise<PayrollBatchDto> {
    const response = await axios.post<PayrollBatchDto>(`/Payroll/batch/${id}/approve`)
    return response.data
  }

  async markBatchAsPaid(id: number): Promise<PayrollBatchDto> {
    const response = await axios.post<PayrollBatchDto>(`/Payroll/batch/${id}/mark-paid`)
    return response.data
  }

  async cancelBatch(id: number): Promise<PayrollBatchDto> {
    const response = await axios.delete<PayrollBatchDto>(`/Payroll/batch/${id}/cancel`)
    return response.data
  }
}

export const payrollService = new PayrollService()
