import type { BaseDto, BaseFilters } from '~/utils/types/index'

// Request Status Enum
export enum RequestStatus {
  Submitted = 1,
  InProgress = 2,
  ApprovedPartially = 3,
  Approved = 4,
  Rejected = 5,
  Completed = 6,
  Cancelled = 7,
}

// Approval Status Enum
export enum ApprovalStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3,
}

// Base Request Type
export type Request = {
  employeeId: number | null
  requestTypeId: number
  startDate: string
  endDate: string
  description: string
  requestData?: string
  affectsBalance: boolean
  balanceDeduction?: number
}

// Request DTO with BaseDto extension
export type RequestDto = BaseDto & Request & {
  employee: {
    id: number
    firstName: string
    lastName: string
    email: string
  }
  requestType: {
    id: number
    name: string
    description: string
  }
  status: RequestStatus
  currentStepOrder?: number
  durationDays?: number
  balanceDeducted: boolean
  submittedAt: string
  completedAt?: string
  requestApprovals: RequestApprovalDto[]
  requestAttachments: RequestAttachmentDto[]
}

// Request Create DTO
export type RequestCreateDto = Partial<Request>

// Request Update DTO
export type RequestUpdateDto = Request & {
  id: number
}

// Request Filters
export type RequestFilters = BaseFilters & {
  employeeId?: number
  requestTypeId?: number
  status?: RequestStatus
  startDate?: string
  endDate?: string
  affectsBalance?: boolean
}

// Request Approval Types
export type RequestApproval = {
  approvalStepId: number
  approverEmployeeId: number
  approvalStatus: ApprovalStatus
  comments?: string
  approvedAt?: string
  rejectedAt?: string
  dueAt: string
}

export type RequestApprovalDto = BaseDto & RequestApproval & {
  approvalStep: {
    id: number
    stepOrder: number
    stepName: string
  }
  approverEmployee: {
    id: number
    firstName: string
    lastName: string
  }
  reminderCount?: number
}

// Request Attachment Types
export type RequestAttachment = {
  fileName: string
  filePath: string
  fileSize: number
  contentType: string
}

export type RequestAttachmentDto = BaseDto & RequestAttachment

// Approval Process DTOs
export type ProcessApprovalDto = {
  approvalId: number
  isApproved: boolean
  comments?: string
}

export type CancelRequestDto = {
  requestId: number
  reason: string
}

// Pending Approval DTO
export type PendingApprovalDto = {
  id: number
  request: {
    id: number
    employee: {
      id: number
      firstName: string
      lastName: string
    }
    requestType: {
      name: string
    }
    startDate: string
    endDate: string
    description: string
  }
  approvalStep: {
    id: number
    stepOrder: number
    stepName: string
  }
  approvalStatus: ApprovalStatus
  dueAt: string
  reminderCount: number
}

// Request Type DTO (from request-types module)
export type RequestTypeDto = BaseDto & {
  name: string
  description: string
  affectsBalance: boolean
  defaultBalanceDeduction?: number
  isActive: boolean
}

// Employee Balance DTO
export type EmployeeBalanceDto = {
  employeeId: number
  currentBalance: number
  totalBalance: number
  usedBalance: number
}
