import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'
import type { RequestCategoryDto } from '~/views/request-categories/types'

export type Category = {
  id: number
  name: string
  code: string
  colorCode?: string
  iconClass?: string
  displayOrder?: number
  isEnabled: boolean
}

export type Department = {
  id: number
  name: string
}

export type Role = {
  id: number
  name: string
}

export type AllowedDepartment = {
  id: number
  requestTypeId: number
  departmentId: number
  department: Department
}

export type AllowedRole = {
  id: number
  requestTypeId: number
  roleId: number
  role: Role
}

export type RequestType = {
  name: string
  description?: string | null
  code: string
  categoryId: number
  isEnabled?: boolean
  requiresApproval?: boolean
  allowsAttachments?: boolean
  requiresAttachments?: boolean
  maxAdvanceDays?: number | null
  minAdvanceDays?: number | null
  maxDurationDays?: number | null
  minDurationHours?: number | null
  affectsAttendance?: boolean
  affectsPayroll?: boolean
  isPaidTime?: boolean
  validationRules?: string | null
  customFields?: string | null
  notificationSettings?: string | null
  displayOrder?: number | null
  colorCode?: string | null
  iconClass?: string | null

}

export type RequestTypeDto = BaseDto & {
  id: number
  name: string
  description?: string | null
  code: string
  categoryId: number
  category: Category
  isEnabled: boolean
  requiresApproval: boolean
  allowsAttachments: boolean
  requiresAttachments: boolean
  maxAdvanceDays?: number | null
  minAdvanceDays?: number | null
  maxDurationDays?: number | null
  minDurationHours?: number | null
  affectsAttendance: boolean
  affectsPayroll: boolean
  isPaidTime: boolean
  validationRules?: string | null
  customFields?: string | null
  notificationSettings?: string | null
  displayOrder?: number | null
  colorCode?: string | null
  iconClass?: string | null
  allowedDepartments?: AllowedDepartment[]
  allowedRoles?: AllowedRole[]
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export type RequestTypeCreateDto = RequestType & {
  allowedDepartmentIds?: number[]
  allowedRoleIds?: number[]
  isEnabled?: boolean
  requiresApproval?: boolean
  allowsAttachments?: boolean
  requiresAttachments?: boolean
  affectsAttendance?: boolean
  affectsPayroll?: boolean
  isPaidTime?: boolean
  validationRules?: string
  customFields?: string
}

export type RequestTypeUpdateDto = RequestType & {
  id: number
  allowedDepartmentIds?: number[]
  allowedRoleIds?: number[]
}

export type RequestTypeFilters = BaseFilters & {
  name?: string | null
  code?: string | null
  categoryId?: number | null
  isEnabled?: boolean | null
  requiresApproval?: boolean | null
  affectsAttendance?: boolean | null
  affectsPayroll?: boolean | null
}
