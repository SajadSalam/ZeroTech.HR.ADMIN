import { AuditLogService } from "../service"
import type { AuditLog, AuditLogFilters } from "../types"

const auditLogService = new AuditLogService()
export const useAuditLogStore = defineStore('auditLog', () => {
  const auditLogs = ref<AuditLog[]>([])
  const loading = ref(false)
  const isAuditLogDialogOpen = ref<boolean>(false)
  const toggleAuditLogDialogVisibility = () => {
    isAuditLogDialogOpen.value = !isAuditLogDialogOpen.value
  }
  const filters = ref<AuditLogFilters>({
    entityType: null,
    entityId: null,
    action: null,
    startDate: null,
    endDate: null,
  })

  const getAuditLogs = async (filters: AuditLogFilters) => {
    try {
      loading.value = true
      const res = await auditLogService.get(filters)
      auditLogs.value = res.data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }
  return {
    auditLogs,
    loading,
    getAuditLogs,
    filters,
    isAuditLogDialogOpen,
    toggleAuditLogDialogVisibility,
  }
})
