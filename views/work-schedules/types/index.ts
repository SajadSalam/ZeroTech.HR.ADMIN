import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'

// User type for assignments
export type User = {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  fullName: string
}

// Base shift type
export type Shift = {
  name: string
  startTime: string // HH:mm format
  endTime: string // HH:mm format
  workingDays: number // Bit flags: Sunday=1, Monday=2, Tuesday=4, Wednesday=8, Thursday=16, Friday=32, Saturday=64
  breakDurationMinutes?: number
}

// Shift DTO with computed properties
export type ShiftDto = BaseDto & Shift & {
  id: number
  workScheduleId: number
  workingDaysArray: string[] // ["Monday", "Tuesday", etc.]
  totalHours: number
  workingDaysCount: number
}

// User assignment type
export type UserAssignment = {
  userId: number
  effectiveDate: string
  expiryDate?: string | null
  isPrimary: boolean
  notes?: string
}

// Late attendance rule type
export type LateAttendanceRule = {
  lateMinutesThreshold: number
  deductionAmount: number
}

// User assignment DTO
export type UserAssignmentDto = BaseDto & UserAssignment & {
  id: number
  workScheduleId: number
  user: User
}

// Base work schedule type
export type WorkSchedule = {
  name: string
  description?: string
  isFlexible: boolean
  flexibleHoursRequired?: number | null
  isGeneralTemplate: boolean
  specificUserId?: number | null
  shifts: Shift[]
  lateAttendanceRules: LateAttendanceRule[]
}

// Work schedule DTO with BaseDto extension
export type WorkScheduleDto = BaseDto & {
  id: number
  name: string
  description?: string
  isFlexible: boolean
  flexibleHoursRequired?: number | null
  isGeneralTemplate: boolean
  specificUserId?: number | null
  specificUser?: User | null
  shifts: ShiftDto[]
  assignments: UserAssignmentDto[]
  lateAttendanceRules: (LateAttendanceRule & { id: number })[]
  totalWeeklyHours: number
}

// Create DTO
export type WorkScheduleCreateDto = WorkSchedule

// Update DTO
export type WorkScheduleUpdateDto = WorkSchedule & {
  id: number
  shifts: (Shift & { id?: number })[]
  lateAttendanceRules: (LateAttendanceRule & { id?: number })[]
}

// Filters extending BaseFilters
export type WorkScheduleFilters = BaseFilters & {
  name?: string | null
  isFlexible?: boolean | null
  isGeneralTemplate?: boolean | null
  specificUserId?: number | null
}

// Validation response type
export type WorkScheduleValidationResponse = {
  isValid: boolean
  validationErrors: string[]
  estimatedWeeklyHours: number
  totalShifts: number
  flexibilityStatus: string
  workingDaysBreakdown: Record<string, number>
}

// Working days helper constants
export const WORKING_DAYS = {
  SUNDAY: 1,
  MONDAY: 2,
  TUESDAY: 4,
  WEDNESDAY: 8,
  THURSDAY: 16,
  FRIDAY: 32,
  SATURDAY: 64,
} as const

export const WORKING_DAYS_LABELS = {
  [WORKING_DAYS.SUNDAY]: 'الأحد',
  [WORKING_DAYS.MONDAY]: 'الاثنين',
  [WORKING_DAYS.TUESDAY]: 'الثلاثاء',
  [WORKING_DAYS.WEDNESDAY]: 'الأربعاء',
  [WORKING_DAYS.THURSDAY]: 'الخميس',
  [WORKING_DAYS.FRIDAY]: 'الجمعة',
  [WORKING_DAYS.SATURDAY]: 'السبت',
} as const

// Helper functions for working days
export const getWorkingDaysArray = (workingDays: number): string[] => {
  const days: string[] = []
  if (workingDays & WORKING_DAYS.SUNDAY) days.push('الأحد')
  if (workingDays & WORKING_DAYS.MONDAY) days.push('الاثنين')
  if (workingDays & WORKING_DAYS.TUESDAY) days.push('الثلاثاء')
  if (workingDays & WORKING_DAYS.WEDNESDAY) days.push('الأربعاء')
  if (workingDays & WORKING_DAYS.THURSDAY) days.push('الخميس')
  if (workingDays & WORKING_DAYS.FRIDAY) days.push('الجمعة')
  if (workingDays & WORKING_DAYS.SATURDAY) days.push('السبت')
  return days
}

export const calculateWorkingDaysFromArray = (selectedDays: number[]): number => {
  return selectedDays.reduce((sum, day) => sum + day, 0)
}
