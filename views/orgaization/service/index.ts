import type { WithoutPagination } from '~/utils/types/ApiResponses'
import type { Organization, OrganizationFilters } from '../types'
import axiosIns from '~/services/app-client/axios'

interface IOrganizationService {
  getTree: (filters: OrganizationFilters) => Promise<WithoutPagination<Organization>>
}

/**
 * Service class for handling organization-related operations.
 *
 * @implements {IOrganizationService}
 */

export class OrganizationService implements IOrganizationService {
  /**
   * Retrieves a paginated list of subjects based on the provided filters.
   * @param {OrganizationFilters} filters - The filters to apply when retrieving subjects.
   * @returns {Promise<WithoutPagination<OrganizationFilters>>} A promise that resolves to a paginated response containing the subjects.
   */
  async getTree(filters: OrganizationFilters): Promise<WithoutPagination<Organization>> {
    const response = await axiosIns.get<WithoutPagination<Organization>>(
      '/ums/organizational-structure/tree',
      { params: filters }
    )
    return response.data
  }
}
