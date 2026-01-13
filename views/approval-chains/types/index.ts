import type { BaseDto, BaseFilters } from '~/utils/types'

// User type for approvers and escalation
export type User = {
  id: number
  username: string
  email: string
  name?: string
}

// Role type for approval step roles
export type Role = {
  id: number
  name: string
}

// Request type reference
export type RequestTypeRef = {
  id: number
  name: string
  code: string
}

// Department reference
export type DepartmentRef = {
  id: number
  name: string
  code: string
}

// Approval step role
export type ApprovalStepRole = {
  id: number
  roleId: number
  role: Role
}

// Approval step user
export type ApprovalStepUser = {
  id: number
  userId: number
  user: User
}

// Base approval step type
export type ApprovalStep = {
  name: string
  description?: string
  stepOrder: number
  isRequired: boolean
  allowsAutoApproval?: boolean
  autoApprovalConditions?: string
  allowsParallelApproval?: boolean
  minRequiredApprovals?: number
  requiresAllApprovers?: boolean
  maxCompletionHours?: number
  sendReminders?: boolean
  firstReminderHours?: number
  reminderIntervalHours?: number
  maxReminders?: number
  timeoutAction?: string
  escalationUserId?: number
  activationConditions?: string
  isActive: boolean
}

// Approval step DTO
export type ApprovalStepDto = BaseDto & ApprovalStep & {
  approvalChainId: number
  escalationUser?: User
  approvalStepRoles?: ApprovalStepRole[]
  approvalStepUsers?: ApprovalStepUser[]
}

// Base approval chain type
export type ApprovalChain = {
  requestTypeId: number
  departmentId: number
  name: string
  description?: string
  isActive: boolean
  priority?: number
  activationConditions?: string
  allowsParallelApproval?: boolean
  allowsStepSkipping?: boolean
  maxCompletionHours?: number
  timeoutAction?: string
  escalationUserId?: number
}

// Approval chain DTO
export type ApprovalChainDto = BaseDto & ApprovalChain & {
  requestType: RequestTypeRef
  department: DepartmentRef
  escalationUser?: User
  approvalSteps?: ApprovalStepDto[]
}

// Create approval chain DTO
export type ApprovalChainCreateDto = ApprovalChain

// Update approval chain DTO
export type ApprovalChainUpdateDto = ApprovalChain & {
  id: number | string
}

// Create approval step DTO
export type ApprovalStepCreateDto = ApprovalStep & {
  approvalChainId: number
  roleIds?: number[]
  userIds?: number[]
}

// Update approval step DTO
export type ApprovalStepUpdateDto = ApprovalStep & {
  id: number | string
  approvalChainId: number
  roleIds?: number[]
  userIds?: number[]
}

// Approval chain filters
export type ApprovalChainFilters = BaseFilters & {
  name?: string
  requestTypeId?: number
  departmentId?: number
  isActive?: boolean
  priority?: number
}

// Timeline step status for UI
export type TimelineStepStatus = 'pending' | 'active' | 'completed' | 'rejected' | 'escalated' | 'timeout'

// Timeline step for visualization
export type TimelineStep = {
  id: number
  name: string
  description?: string
  stepOrder: number
  status: TimelineStepStatus
  isRequired: boolean
  approvers: string[]
  maxCompletionHours?: number
  completedAt?: string
  completedBy?: User
  comments?: string
  timeoutAction?: string
  escalationUser?: User
}
