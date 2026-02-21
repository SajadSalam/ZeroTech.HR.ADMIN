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
    checkInLatitude: number
    checkInLongitude: number
    checkOutLatitude: number
    checkOutLongitude: number
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

/** Minimal zone data for display on the tracking map */
export interface MapZoneDisplay {
  id: string | number
  name: string
  /** GeoJSON Polygon as string, e.g. {"type":"Polygon","coordinates":[[[lng,lat],...]]} */
  polygonCoordinates?: string
  color?: string
  opacity?: number
  isOperational?: boolean
}

export interface LocationTimestampDto  {
  id: number
  employeeId: number
  latitude: number
  longitude: number
  recordedAt: string
  clientTimestamp: string
}

export interface EmployeeLocationTimestamp {
  checkInLatitude: number
  checkInLongitude: number
  checkOutLatitude: number
  checkOutLongitude: number
}

export interface LocationTimestampFilters {
  from: string
  to: string
}
