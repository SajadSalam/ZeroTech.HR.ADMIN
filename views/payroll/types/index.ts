import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'

// Enums for status values (matching C# backend enum)
export enum PayrollBatchStatus {
  Draft = 1,
  Calculating = 2,
  Calculated = 3,
  Approved = 4,
  Paid = 5,
  Cancelled = 6,
}

export enum PayrollStatus {
  Draft = 1,
  Calculated = 2,
  Approved = 3,
  Paid = 4,
}

// Base payroll batch type
export type PayrollBatch = {
  title: string
  periodStartDate: string
  periodEndDate: string
  notes?: string | null
}

// Payroll batch DTO with BaseDto extension
export type PayrollBatchDto = BaseDto & {
  id: number
  title: string
  periodStartDate: string
  periodEndDate: string
  status: PayrollBatchStatus // Numeric enum status values
  statusDisplay: string
  totalEmployees: number
  processedCount: number
  totalGrossPay: number
  totalNetPay: number
  totalDeductions: number
  processedAt?: string | null
  processedByUserId?: number | null
  processedByUserName?: string | null
  notes?: string | null
  completionPercentage: number
  isEditable: boolean
  periodDays: number
  employeePayrolls: EmployeePayrollDto[]
  createdByUserId: number
  createdBy: string
  createdByUserName: string
  updatedByUserId?: number | null
  updatedBy?: string | null
  updatedByUserName?: string | null
  isActive: boolean
}

// Employee payroll type
export type EmployeePayroll = {
  payrollBatchId: number
  employeeId: number
  baseSalary: number
  scheduledWorkingDays: number
  actualWorkingDays: number
  absentDays: number
  lateDays: number
  regularHours: number
  overtimeHours: number
  overtimePay: number
  totalLateMinutes: number
  lateDeductions: number
  absenceDeductions: number
  totalDeductions: number
  grossPay: number
  netPay: number
  dailyRate: number
  hourlyRate: number
  overtimeMultiplier: number
  status: PayrollStatus // Numeric enum status values
  statusDisplay: string
  notes?: string | null
  isEditable: boolean
  deductionPercentage: number
  attendanceRate: number
}

// Employee payroll DTO
export type EmployeePayrollDto = BaseDto & EmployeePayroll & {
  id: number
  payrollBatchTitle: string
  employeeNumber: string
  employeeName: string
  departmentName: string
  jobTitle: string
  createdByUserId: number
  createdBy: string
  createdByUserName: string
  isActive: boolean
}

// Create DTOs
export type PayrollBatchCreateDto = PayrollBatch

export type PayrollCalculationDto = {
  batchId: number
  employeeIds?: number[] | null
  overtimeMultiplier?: number
  lateDeductionFactor?: number
  recalculateExisting?: boolean
}

// Update DTOs
export type PayrollBatchUpdateDto = PayrollBatch & {
  id: number
}

// API Response Types (matching the API specification)
export type PayrollBatchPaginationResponse = {
  items: PayrollBatchDto[]
  pagination: {
    currentPage: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

// Filters (matching API query parameters)
export type PayrollBatchFilters = BaseFilters & {
  status?: PayrollBatchStatus | null // Numeric enum status values
  startDate?: string // Filter by period start date >= this date
  endDate?: string // Filter by period end date <= this date
  searchTerm?: string // Search in batch title
  sortBy?: string // Sort field (createdAt, periodStartDate, title, status)
  sortOrder?: string // Sort order (asc, desc)
}

export type EmployeePayrollFilters = BaseFilters & {
  employeeId?: number | null
  employeeName?: string | null
  departmentName?: string | null
  payrollBatchId?: number | null
  status?: PayrollStatus | null
  minNetPay?: number | null
  maxNetPay?: number | null
  minDeductionPercentage?: number | null
  maxDeductionPercentage?: number | null
}

// Status display mappings
export const PayrollBatchStatusDisplay: Record<PayrollBatchStatus, string> = {
  [PayrollBatchStatus.Draft]: 'مسودة',
  [PayrollBatchStatus.Calculating]: 'جاري الحساب',
  [PayrollBatchStatus.Calculated]: 'محسوب',
  [PayrollBatchStatus.Approved]: 'معتمد',
  [PayrollBatchStatus.Paid]: 'مدفوع',
  [PayrollBatchStatus.Cancelled]: 'ملغي',
}

export const PayrollStatusDisplay: Record<PayrollStatus, string> = {
  [PayrollStatus.Draft]: 'مسودة',
  [PayrollStatus.Calculated]: 'محسوب',
  [PayrollStatus.Approved]: 'معتمد',
  [PayrollStatus.Paid]: 'مدفوع',
}
