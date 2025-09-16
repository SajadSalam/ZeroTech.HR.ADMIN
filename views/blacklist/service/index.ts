import axios from '~/services/app-client/axios'
import type { PaginatedResponse } from '~/utils/types/ApiResponses'
import type { BlacklistDto, BlacklistFilters, UnblacklistRequest } from '../types'

interface IBlacklistService {
  get: (filters: BlacklistFilters) => Promise<PaginatedResponse<BlacklistDto>>
  unblacklist: (id: number, data: UnblacklistRequest) => Promise<void>
}

/**
 * Service class for managing blacklist entries.
 * Implements the IBlacklistService interface.
 */
export class BlacklistService implements IBlacklistService {
  /**
   * Retrieves a paginated list of blacklist entries based on the provided filters.
   * @param {BlacklistFilters} filters - The filters to apply when retrieving blacklist entries.
   * @returns {Promise<PaginatedResponse<BlacklistDto>>} A promise that resolves to a paginated response containing the blacklist entries.
   */
  async get(filters: BlacklistFilters): Promise<PaginatedResponse<BlacklistDto>> {
    const response = await axios.get<PaginatedResponse<BlacklistDto>>('/externalstudentblacklist', {
      params: filters,
    })
    return response.data
  }

  /**
   * Unblacklists a student by their blacklist entry ID.
   * @param {number} id - The ID of the blacklist entry to unblacklist.
   * @param {UnblacklistRequest} data - The unblacklist request data containing the reason.
   * @returns {Promise<void>} A promise that resolves when the student is unblacklisted.
   */
  async unblacklist(id: number, data: UnblacklistRequest): Promise<void> {
    await axios.post(`/externalstudentblacklist/${id}/unblacklist`, data)
  }
}