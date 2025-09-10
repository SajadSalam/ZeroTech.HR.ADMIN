import { AuditLogsUserActivityService } from '../service'
import type {
  AuditLogsUserActivity,
  AuditLogsUserActivityDto,
  AuditLogsUserActivityFilters,
} from '../types'

const auditLogsUserActivityService = new AuditLogsUserActivityService()
export const useAuditLogsUserActivityStore = defineStore('auditLogsUserActivity', () => {
  const auditLogsUserActivities = ref<AuditLogsUserActivityDto[]>([])
  const isLoading = ref(false)
  const filters = ref<AuditLogsUserActivityFilters>({
    pageSize: 10,
    pageNumber: 1,
    fullName: null,
  })
  const totalPages = ref(0)

  const getAuditLogsUserActivities = async (
    auditLogsUserActivityFilters: AuditLogsUserActivityFilters
  ) => {
    try {
      isLoading.value = true
      const response = await auditLogsUserActivityService.get(auditLogsUserActivityFilters)
      auditLogsUserActivities.value = response.data.map((auditLogsUserActivityFilter) => ({
        ...auditLogsUserActivityFilter,
        id: auditLogsUserActivityFilter.id,
        userRole: auditLogsUserActivityFilter.userRole,
        date: auditLogsUserActivityFilter.date,
        actionType: auditLogsUserActivityFilter.actionType,
      }))
      totalPages.value = response.pagesCount
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }
  return {
    auditLogsUserActivities,
    isLoading,
    filters,
    getAuditLogsUserActivities,
    totalPages,
  }
})
