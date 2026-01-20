import type { BaseDto, BaseFilters } from '~/utils/types'
import type { User } from '~/views/approval-chains/types'
import type { Department } from '~/views/departments/types'
import type { WorkSchedule } from '~/views/work-schedules/types'

export interface Attachment {
  id?: number
  name?: string
  filePath?: string
  uploadedAt?: string
}
// Base request category type
export type Employee = {
 fullName: string
  email: string
  phone: string
  identityNumber: string
  gender: number
  genderDisplay: string
  birthDate: string // ISO date string
  age: number
  employeeNumber: string
  departmentId: number
  department: Department
  jobTitle: string
  contractType: number
  contractTypeDisplay: string
  branchId: number
  hireDate: string // ISO date string
  salary: number
  yearsOfService: number
  workScheduleId: number
  workSchedule: WorkSchedule | null
  userId: number
  user: User
  attachments: Attachment[]
  attachmentCount: number
  isActive: boolean
  zone: {
    id: number
    name: string
  }
  zoneId: number
}

// Employee DTO with BaseDto extension
export type EmployeeDto = BaseDto & Employee

export type EmployeeCreateDto = Employee

export type EmployeeUpdateDto = Employee & {
  id: number
}

export type EmployeeFilters = BaseFilters & {
  name?: string | null
  code?: string | null
  department?: string | null
  zone?: string | null
  status?: string | null
}