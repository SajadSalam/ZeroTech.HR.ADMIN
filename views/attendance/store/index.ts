import { defineStore } from 'pinia'
import { attendanceService } from '../service'
import type {
    AttendanceFilters,
    AttendanceRecord,
    EmployeeAttendanceOverview,
    EmployeeAttendanceStats,
    LocationTimestampDto,
} from '../types'

export const useAttendanceStore = defineStore('attendance', () => {
    // State
    const records = ref<AttendanceRecord[]>([])
    const statistics = ref<EmployeeAttendanceStats | null>(null)
    const isLoading = ref(false)
    const filters = ref<AttendanceFilters>({
        pageSize: 10,
        pageNumber: 1,
        startDate: '',
        endDate: '',
        employeeId: null,
    })
    const isStatusDialogOpen = ref(false)
    const selectedEmployeeId = ref<number | null>(null)
    const employeeStatus = ref<EmployeeAttendanceOverview | null>(null)
    const isManualAttendanceDialogOpen = ref(false)
    const totalPages = ref(0)
    const locationTimestamps = ref<LocationTimestampDto[]>([])

    // Initialize default dates (one week from today)
    const initializeDates = () => {
        const today = new Date()
        const endDate = new Date(today)
        const startDate = new Date(today)
        startDate.setDate(today.getDate() - 7)

        filters.value.startDate = startDate.toISOString().split('T')[0]
        filters.value.endDate = endDate.toISOString().split('T')[0]
        filters.value.employeeId = null
    }

    // Initialize dates on store creation
    initializeDates()

    // Methods
    const getRecords = async () => {
        try {
            isLoading.value = true
            const response = await attendanceService.getRecords(filters.value)
            records.value = response.items
            totalPages.value = response.calculatedTotalPages
        } catch (error) {
            console.error('Error fetching attendance records:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const getStatistics = async () => {
        try {
            isLoading.value = true
            const response = await attendanceService.getStatistics({
                startDate: filters.value.startDate,
                endDate: filters.value.endDate,
                employeeId: filters.value.employeeId,
            } as AttendanceFilters)
            statistics.value = response
        } catch (error) {
            console.error('Error fetching attendance statistics:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const getEmployeeStatus = async (employeeId: number) => {
        try {
            isLoading.value = true
            selectedEmployeeId.value = employeeId
            const response = await attendanceService.getStatus(employeeId)
            employeeStatus.value = response
            isStatusDialogOpen.value = true
        } catch (error) {
            console.error('Error fetching employee status:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const exportRecordsCSV = async () => {
        try {
            isLoading.value = true
            const blob = await attendanceService.exportRecordsCSV(filters.value)
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `attendance-records-${filters.value.startDate}-${filters.value.endDate}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Error exporting records CSV:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const exportSummaryCSV = async () => {
        try {
            isLoading.value = true
            const blob = await attendanceService.exportSummaryCSV(filters.value)
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `attendance-summary-${filters.value.startDate}-${filters.value.endDate}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Error exporting summary CSV:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const exportMonthlyPayroll = async () => {
        try {
            isLoading.value = true
            const blob = await attendanceService.exportMonthlyPayroll(
                filters.value
            )
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `monthly-payroll-${filters.value.startDate}-${filters.value.endDate}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Error exporting monthly payroll:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const exportRecordsExcel = async () => {
        try {
            isLoading.value = true
            const blob = await attendanceService.exportRecordsExcel(
                filters.value
            )
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `attendance-records-${filters.value.startDate}-${filters.value.endDate}.xlsx`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Error exporting records Excel:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const processPayroll = async (data: {
        payrollEndDate: string
        employeeIds: number[]
        processedAt: string
    }) => {
        try {
            isLoading.value = true
            await attendanceService.processPayroll(data)
            await getRecords()
        } catch (error) {
            console.error('Error processing payroll:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const checkIn = async (data: {
        employeeId: number
        checkInTime: string
        notes?: string
    }) => {
        try {
            isLoading.value = true
            await attendanceService.checkIn(data)
            await getRecords()
            await getStatistics()
        } catch (error) {
            console.error('Error checking in:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const checkOut = async (data: {
        employeeId: number
        checkOutTime: string
        notes?: string
    }) => {
        try {
            isLoading.value = true
            await attendanceService.checkOut(data)
            await getRecords()
            await getStatistics()
        } catch (error) {
            console.error('Error checking out:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const getLocationTimestamp = async () => {
        try {
            isLoading.value = true
            const response = await attendanceService.getLocationTimestamp()
            locationTimestamps.value = response.items
            totalPages.value = response.calculatedTotalPages
            return response.items
        } catch (error) {
            console.error('Error getting location timestamp:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    return {
        records,
        statistics,
        isLoading,
        filters,
        isStatusDialogOpen,
        selectedEmployeeId,
        employeeStatus,
        isManualAttendanceDialogOpen,
        getRecords,
        getStatistics,
        getEmployeeStatus,
        exportRecordsCSV,
        exportSummaryCSV,
        exportMonthlyPayroll,
        exportRecordsExcel,
        processPayroll,
        checkIn,
        checkOut,
        totalPages,
        getLocationTimestamp,
        locationTimestamps,
    }
})
