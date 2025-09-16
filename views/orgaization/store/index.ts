import { isNullOrEmpty } from '~/utils'
import { OrganizationService } from '../service'
import type { Organization, OrganizationFilters } from '../types'

const organizationService = new OrganizationService()
export const useOrganizationStore = defineStore('organization', () => {
  const organizations = ref<Organization[]>([])
  const loading = ref(false)
  const filters = ref<OrganizationFilters>({
    parentId: null,
    search: '',
  })
  const getOrganizations = async (filters: OrganizationFilters) => {
    try {
      if (isNullOrEmpty(filters.search) && filters.parentId == null) {
        filters.parentId = 'null'
        filters.search = null
      }
      if (!isNullOrEmpty(filters.search)) {
        filters.parentId = null
      }
      const res = await organizationService.getTree(filters)
      const allOrganizations: Organization[] = res.data
      const ret = allOrganizations
        // .filter((org) => org.parentId == (filters.parentId == 'null' ? null : filters.parentId))
        .map((org) => ({
          ...org,
          children: async () => {
            const children = await getOrganizations({ parentId: org.id })
            return children
          },
        }))
      return ret
    } catch (error) {
      return []
    }
  }

  return {
    organizations,
    loading,
    getOrganizations,
    filters,
  }
})
