export interface TimeSpan {
    ticks: number
    days: number
    hours: number
    milliseconds: number
    microseconds: number
    nanoseconds: number
    minutes: number
    seconds: number
    totalDays: number
    totalHours: number
    totalMilliseconds: number
    totalMicroseconds: number
    totalNanoseconds: number
    totalMinutes: number
    totalSeconds: number
}

export interface AttendanceRecord {
    id: number
    createdAt: string
    createdByUserId: number
    createdBy: string
    createdByUserName: string
    updatedAt: string
    updatedByUserId: number
    updatedBy: string
    updatedByUserName: string
    isActive: boolean
    employeeId: number
    employeeName: string
    employeeNumber: string
    attendanceDate: string
    checkInTime: string
    checkOutTime: string
    workScheduleShiftId: number
    workScheduleShiftName: string
    isLateCheckIn: boolean
    isEarlyCheckOut: boolean
    lateMinutes: number
    earlyMinutes: number
    hoursWorked: number
    overtimeHours: number
    notes: string
    isProcessedForPayroll: boolean
    payrollProcessedAt: string
    isCheckedIn: boolean
    isComplete: boolean
    totalWorkingTime: TimeSpan
    netWorkingTime: TimeSpan
}

export interface EmployeeAttendanceOverview {
    employeeId: number
    employeeName: string
    status: number
    statusDescription: string
    activeAttendance: AttendanceRecord
    lastCheckInTime: string
    currentWorkingTime: TimeSpan
    canCheckIn: boolean
    canCheckOut: boolean
}

export interface EmployeeAttendanceStats {
    employeeId: number
    employeeName: string
    startDate: string
    endDate: string
    totalWorkDays: number
    daysPresent: number
    daysAbsent: number
    lateCount: number
    earlyDepartureCount: number
    totalHoursWorked: number
    totalOvertimeHours: number
    averageHoursPerDay: number
    attendancePercentage: number
}

import type { BaseFilters } from '~/utils/types/ApiResponses'

export type AttendanceFilters = BaseFilters & {
    startDate: string
    endDate: string
    employeeId: number | null
}

export interface LocationTimestampDto  {
  id: number
  fullName: string
  employeeNumber: string
  email: string
  phone: string
  jobTitle: string
  departmentId: number
  departmentName: string
  branchId: number
  branchName: string
  currentLatitude: number
  currentLongitude: number
  lastLocationUpdateAt: string // ISO date string
  hasLocation: boolean
  isLocationRecent: boolean
  timeSinceLastUpdate: string
  isActive: boolean
}
