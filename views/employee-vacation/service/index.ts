import axios from '~/services/app-client/axios'
import type { EmployeeVacation } from '../types'

interface IEmployeeVacationService {
    getEmployeeVacationBalance: (
        employeeId: number | string
    ) => Promise<EmployeeVacation>
}

export class EmployeeVacationService implements IEmployeeVacationService {
    async getEmployeeVacationBalance(
        employeeId: number | string
    ): Promise<EmployeeVacation> {
        try {
            const response = await axios.get<EmployeeVacation>(
                `/Employee/${employeeId}/vacation-balance`
            )
            return response.data
        } catch (error) {
            console.error('Error fetching employee vacation balance:', error)
            throw error
        }
    }
}

export const employeeVacationService = new EmployeeVacationService()

