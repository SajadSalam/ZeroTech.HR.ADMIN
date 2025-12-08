import axios from '~/services/app-client/axios'
import type {
    EmployeeBalanceSummary,
    CreateBalanceDto,
    DeductBalanceDto,
    AddBalanceDto,
    Balance,
} from '../types'

interface IEmployeeBalanceService {
    getEmployeeBalance: (
        employeeId: number | string
    ) => Promise<EmployeeBalanceSummary>
    createBalance: (
        employeeId: number | string,
        data: CreateBalanceDto
    ) => Promise<Balance>
    deductBalance: (
        employeeId: number | string,
        balanceType: string,
        data: DeductBalanceDto
    ) => Promise<Balance>
    addBalance: (
        employeeId: number | string,
        balanceType: string,
        data: AddBalanceDto
    ) => Promise<Balance>
}

export class EmployeeBalanceService implements IEmployeeBalanceService {
    async getEmployeeBalance(
        employeeId: number | string
    ): Promise<EmployeeBalanceSummary> {
        try {
            const response = await axios.get<EmployeeBalanceSummary>(
                `/employee/${employeeId}/balance`
            )
            return response.data
        } catch (error) {
            console.error('Error fetching employee balance:', error)
            throw error
        }
    }

    async createBalance(
        employeeId: number | string,
        data: CreateBalanceDto
    ): Promise<Balance> {
        try {
            const response = await axios.post<Balance>(
                `/employee/${employeeId}/balance`,
                data
            )
            return response.data
        } catch (error) {
            console.error('Error creating balance:', error)
            throw error
        }
    }

    async deductBalance(
        employeeId: number | string,
        balanceType: string,
        data: DeductBalanceDto
    ): Promise<Balance> {
        try {
            const response = await axios.post<Balance>(
                `/employee/${employeeId}/balance/${balanceType}/deduct`,
                data
            )
            return response.data
        } catch (error) {
            console.error('Error deducting balance:', error)
            throw error
        }
    }

    async addBalance(
        employeeId: number | string,
        balanceType: string,
        data: AddBalanceDto
    ): Promise<Balance> {
        try {
            const response = await axios.post<Balance>(
                `/employee/${employeeId}/balance/${balanceType}/add`,
                data
            )
            return response.data
        } catch (error) {
            console.error('Error adding balance:', error)
            throw error
        }
    }
}

export const employeeBalanceService = new EmployeeBalanceService()

