import axios from '~/services/app-client/axios'
import type { PaginatedResponse } from '~/utils/types/ApiResponses'
import type {
    AttendanceFilters,
    AttendanceRecord,
    EmployeeAttendanceOverview,
    EmployeeAttendanceStats,
    LocationTimestampDto,
} from '../types'

interface ProcessPayrollDto {
    payrollEndDate: string
    employeeIds: number[]
    processedAt: string
}

interface CheckInDto {
    employeeId: number
    checkInTime: string
    notes?: string
}

interface CheckOutDto {
    employeeId: number
    checkOutTime: string
    notes?: string
}

interface IAttendanceService {
    getRecords: (filters: AttendanceFilters) => Promise<PaginatedResponse<AttendanceRecord>>
    getStatistics: (
        filters: AttendanceFilters
    ) => Promise<EmployeeAttendanceStats>
    getStatus: (employeeId: number) => Promise<EmployeeAttendanceOverview>
    exportRecordsCSV: (filters: AttendanceFilters) => Promise<Blob>
    exportSummaryCSV: (filters: AttendanceFilters) => Promise<Blob>
    exportMonthlyPayroll: (filters: AttendanceFilters) => Promise<Blob>
    exportRecordsExcel: (filters: AttendanceFilters) => Promise<Blob>
    processPayroll: (data: ProcessPayrollDto) => Promise<void>
    checkIn: (data: CheckInDto) => Promise<void>
    checkOut: (data: CheckOutDto) => Promise<void>
    getLocationTimestamp: () => Promise<PaginatedResponse<LocationTimestampDto>>
}

export class AttendanceService implements IAttendanceService {
    private readonly baseUrl = '/Attendance'

    async getRecords(filters: AttendanceFilters): Promise<PaginatedResponse<AttendanceRecord>> {
        try {
            const response = await axios.get<PaginatedResponse<AttendanceRecord>>(
                `${this.baseUrl}/records`,
                { params:filters as any }
            )
            return response.data
        } catch (error) {
            console.error('Error fetching attendance records:', error)
            throw error
        }
    }

    async getStatistics(
        filters: AttendanceFilters
    ): Promise<EmployeeAttendanceStats> {
        try {
            const response = await axios.get<EmployeeAttendanceStats>(
                `${this.baseUrl}/statistics`,
                { params:filters as any }
            )
            return response.data
        } catch (error) {
            console.error('Error fetching attendance statistics:', error)
            throw error
        }
    }

    async getStatus(employeeId: number): Promise<EmployeeAttendanceOverview> {
        try {
            const response = await axios.get<EmployeeAttendanceOverview>(
                `${this.baseUrl}/status`,
                {
                    params: { employeeId } as any,
                }
            )
            return response.data
        } catch (error) {
            console.error('Error fetching employee attendance status:', error)
            throw error
        }
    }

    async exportRecordsCSV(filters: AttendanceFilters): Promise<Blob> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/export/csv`,
                { params:filters as any , responseType: 'blob' },
            )
            return response.data
        } catch (error) {
            console.error('Error exporting records CSV:', error)
            throw error
        }
    }

    async exportSummaryCSV(filters: AttendanceFilters): Promise<Blob> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/export/summary/csv`,
                { params:filters as any, responseType: 'blob' },
            )
            return response.data
        } catch (error) {
            console.error('Error exporting summary CSV:', error)
            throw error
        }
    }

    async exportMonthlyPayroll(filters: AttendanceFilters): Promise<Blob> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/export/payroll/monthly`,
                { params:filters as any, responseType: 'blob' },
            )
            return response.data
        } catch (error) {
            console.error('Error exporting monthly payroll:', error)
            throw error
        }
    }

    async exportRecordsExcel(filters: AttendanceFilters): Promise<Blob> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/export/excel`,
                { params:filters as any, responseType: 'blob' },
            )
            return response.data
        } catch (error) {
            console.error('Error exporting records Excel:', error)
            throw error
        }
    }

    async processPayroll(data: ProcessPayrollDto): Promise<void> {
        try {
            await axios.post(`${this.baseUrl}/payroll/process`, data)
        } catch (error) {
            console.error('Error processing payroll:', error)
            throw error
        }
    }

    async checkIn(data: CheckInDto): Promise<void> {
        try {
            await axios.post(`${this.baseUrl}/check-in`, data)
        } catch (error) {
            console.error('Error checking in:', error)
            throw error
        }
    }

    async checkOut(data: CheckOutDto): Promise<void> {
        try {
            await axios.post(`${this.baseUrl}/check-out`, data)
        } catch (error) {
            console.error('Error checking out:', error)
            throw error
        }
    }
    async getLocationTimestamp(): Promise<PaginatedResponse<LocationTimestampDto>> {
        try {
            const response = await axios.get(`${this.baseUrl}/employees-location`)
            return response.data
        } catch (error) {
            console.error('Error getting location timestamp:', error)
            throw error
        }
    }
}

export const attendanceService = new AttendanceService()
