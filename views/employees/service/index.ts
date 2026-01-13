import axios from '~/services/app-client/axios'
import type { PaginatedResponse } from '~/utils/types'
import type { EmployeeDto, EmployeeFilters } from '../types'
import type { EmployeeCreateDto } from '../types'
import type { EmployeeUpdateDto } from '../types'

interface IEmployeeService {
    get: (filters: EmployeeFilters) => Promise<PaginatedResponse<EmployeeDto>>
    getEnabled: () => Promise<EmployeeDto[]>
    getWithCounts: () => Promise<EmployeeDto[]>
    getById: (id: string | number) => Promise<EmployeeDto>
    getByCode: (code: string) => Promise<EmployeeDto>
    getWithRequestTypes: (id: string | number) => Promise<EmployeeDto>
    create: (data: EmployeeCreateDto) => Promise<EmployeeDto>
    update: (
        id: string | number,
        data: EmployeeUpdateDto
    ) => Promise<EmployeeDto>
    delete: (id: string | number) => Promise<void>
}

export class EmployeeService implements IEmployeeService {
    private baseUrl = '/Employee'

    async get(
        filters: EmployeeFilters
    ): Promise<PaginatedResponse<EmployeeDto>> {
        try {
            const response = await axios.get<PaginatedResponse<EmployeeDto>>(
                `${this.baseUrl}`,
                { params:filters as any }
            )
            return response.data
        } catch (error) {
            console.error('Error fetching employees:', error)
            throw error
        }
    }

    async getById(id: string | number): Promise<EmployeeDto> {
        try {
            const response = await axios.get(`${this.baseUrl}/${id}`)
            return response.data
        } catch (error) {
            console.error(
                `Error fetching employee with id ${id}:`,
                error
            )
            throw error
        }
    }

    async getByCode(code: string): Promise<EmployeeDto> {
        try {
            const response = await axios.get(`${this.baseUrl}/by-code/${code}`)
            return response.data
        } catch (error) {
            console.error(
                `Error fetching employee with code ${code}:`,
                error
            )
            throw error
        }
    }
    async create(data: EmployeeCreateDto): Promise<EmployeeDto> {
        try {
            const response = await axios.post(this.baseUrl, data)
            return response.data
        } catch (error) {
            console.error('Error creating employees:', error)
            throw error
        }
    }

    async update(
        id: string | number,
        data: EmployeeUpdateDto
    ): Promise<EmployeeDto> {
        try {
            const response = await axios.put(`${this.baseUrl}/${id}`, data)
            return response.data
        } catch (error) {
            console.error(`Error updating employees with id ${id}:`, error)
            throw error
        }
    }

    async delete(id: string | number): Promise<void> {
        try {
            await axios.delete(`${this.baseUrl}/${id}`)
        } catch (error) {
            console.error(`Error deleting employees with id ${id}:`, error)
            throw error
        }
    }
}

export const employeeService = new EmployeeService()

