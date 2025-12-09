import axiosIns from '~/services/app-client/axios'
import type { PaginatedResponse } from '~/utils/types/ApiResponses'
import type { Employee, EmployeeFilters } from '../types'

interface IEmployeeService {
  get: (filters: EmployeeFilters) => Promise<PaginatedResponse<Employee>>
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
  async get(filters: EmployeeFilters): Promise<PaginatedResponse<Employee>> {
    const response = await axiosIns.get<PaginatedResponse<Employee>>('/ums/employees', {
      params: filters,
    })
    return response.data
  }
}
