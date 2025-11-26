import axiosIns from '~/services/app-client/axios'
import type { AuditLog, AuditLogFilters } from '../types'
import type { PaginatedResponse } from '~/utils/types/ApiResponses'

interface IAuditLogService {
  get: (filters: AuditLogFilters) => Promise<PaginatedResponse<AuditLog>>
}

/**
 * Service class for handling audit log-related operations.
 *
 * @implements {IAuditLogService}
 */
export class AuditLogService implements IAuditLogService {
  /**
   * Retrieves a paginated list of audit logs based on the provided filters.
   * @param {AuditLogFilters} filters - The filters to apply when retrieving audit logs.
   * @returns {Promise<PaginatedResponse<AuditLogFilters>>} A promise that resolves to a paginated response containing the audit logs.
   */
  async get(filters: AuditLogFilters): Promise<PaginatedResponse<AuditLog>> {
    const response = await axiosIns.get<PaginatedResponse<AuditLog>>('/auditlog', {
      params: filters,
    })
    return response.data
  }
}
