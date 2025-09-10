import axiosIns from '~/services/app-client/axios'
import type { Employee, EmployeeFilters } from '../types'
import type { WithoutPagination } from '~/utils/types/ApiResponses'

interface IEmployeeService {
  get: (filters: EmployeeFilters) => Promise<WithoutPagination<Employee>>
}

/**
 * Service class for handling employee-related operations.
 *
 * @implements {IEmployeeService}
 */
export class EmployeeService implements IEmployeeService {
  /**
   * Retrieves a paginated list of employees based on the provided filters.
   * @param {EmployeeFilters} filters - The filters to apply when retrieving employees.
   * @returns {Promise<WithoutPagination<EmployeeFilters>>} A promise that resolves to a paginated response containing the employees.
   */
  async get(filters: EmployeeFilters): Promise<WithoutPagination<Employee>> {
    const response = await axiosIns.get<WithoutPagination<Employee>>('/ums/employees', {
      params: filters,
    })
    return response.data
  }
}
