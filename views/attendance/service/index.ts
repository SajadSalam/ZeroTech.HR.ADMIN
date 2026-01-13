import axios from '~/services/app-client/axios'
import type {
    AttendanceRecord,
    AttendanceFilters,
    EmployeeAttendanceOverview,
    EmployeeAttendanceStats,
} from '../types'

interface ProcessPayrollDto {
    payrollEndDate: string
    employeeIds: number[]
    processedAt: string
}

interface IAttendanceService {
    getRecords: (filters: AttendanceFilters) => Promise<AttendanceRecord[]>
    getStatistics: (
        filters: AttendanceFilters
    ) => Promise<EmployeeAttendanceStats>
    getStatus: (employeeId: number) => Promise<EmployeeAttendanceOverview>
    exportRecordsCSV: (filters: AttendanceFilters) => Promise<Blob>
    exportSummaryCSV: (filters: AttendanceFilters) => Promise<Blob>
    exportMonthlyPayroll: (filters: AttendanceFilters) => Promise<Blob>
    exportRecordsExcel: (filters: AttendanceFilters) => Promise<Blob>
    processPayroll: (data: ProcessPayrollDto) => Promise<void>
}

export class AttendanceService implements IAttendanceService {
    private readonly baseUrl = '/Attendance'

    async getRecords(filters: AttendanceFilters): Promise<AttendanceRecord[]> {
        try {
            const params = new URLSearchParams()
            params.append('startDate', filters.startDate)
            params.append('endDate', filters.endDate)
            params.append('employeeId', filters.employeeId.toString())
            if (filters.pageNumber)
                params.append('pageNumber', filters.pageNumber.toString())
            if (filters.pageSize)
                params.append('pageSize', filters.pageSize.toString())

            const response = await axios.get<AttendanceRecord[]>(
                `${this.baseUrl}/records?${params.toString()}`
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
            const params = new URLSearchParams()
            params.append('startDate', filters.startDate)
            params.append('endDate', filters.endDate)
            params.append('employeeId', filters.employeeId.toString())
            const response = await axios.get<EmployeeAttendanceStats>(
                `${this.baseUrl}/statistics?${params.toString()}`
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
                    params: { employeeId },
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
            const params = new URLSearchParams()
            params.append('startDate', filters.startDate)
            params.append('endDate', filters.endDate)

            const response = await axios.get(
                `${this.baseUrl}/export/csv?${params.toString()}`,
                {
                    responseType: 'blob',
                }
            )
            return response.data
        } catch (error) {
            console.error('Error exporting records CSV:', error)
            throw error
        }
    }

    async exportSummaryCSV(filters: AttendanceFilters): Promise<Blob> {
        try {
            const params = new URLSearchParams()
            params.append('startDate', filters.startDate)
            params.append('endDate', filters.endDate)

            const response = await axios.get(
                `${this.baseUrl}/export/summary/csv?${params.toString()}`,
                {
                    responseType: 'blob',
                }
            )
            return response.data
        } catch (error) {
            console.error('Error exporting summary CSV:', error)
            throw error
        }
    }

    async exportMonthlyPayroll(filters: AttendanceFilters): Promise<Blob> {
        try {
            const params = new URLSearchParams()
            params.append('startDate', filters.startDate)
            params.append('endDate', filters.endDate)

            const response = await axios.get(
                `${this.baseUrl}/export/payroll/monthly?${params.toString()}`,
                {
                    responseType: 'blob',
                }
            )
            return response.data
        } catch (error) {
            console.error('Error exporting monthly payroll:', error)
            throw error
        }
    }

    async exportRecordsExcel(filters: AttendanceFilters): Promise<Blob> {
        try {
            const params = new URLSearchParams()
            params.append('startDate', filters.startDate)
            params.append('endDate', filters.endDate)

            const response = await axios.get(
                `${this.baseUrl}/export/excel?${params.toString()}`,
                {
                    responseType: 'blob',
                }
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
}

export const attendanceService = new AttendanceService()
