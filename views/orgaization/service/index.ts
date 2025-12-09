import axiosIns from '~/services/app-client/axios'
import type { Organization, OrganizationFilters } from '../types'

interface IOrganizationService {
  getTree: (filters: OrganizationFilters) => Promise<Organization[]>
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
  async getTree(filters: OrganizationFilters): Promise<Organization[]> {
    if(filters.parentId == null || filters.parentId == 'null' || isNullOrEmpty(filters.parentId as string)) {
      delete filters.parentId
    }
    const response = await axiosIns.get<Organization[]>(
      '/ums/organizational-structure/tree',
      { params: filters }
    )
    return response.data
  }
}
