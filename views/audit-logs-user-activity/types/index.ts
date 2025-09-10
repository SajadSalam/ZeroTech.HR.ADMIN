import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'

export type AuditLogsUserActivity = {
  id: string | null
  userRole: string | null
  date: string | null
  actionType: string | null
}

export type AuditLogsUserActivityDto = BaseDto &
  AuditLogsUserActivity & {
    id: string | null
    userRole: string | null
    date: string | null
    actionType: string | null
  }
export type AuditLogsUserActivityFilters = BaseFilters & {
  userRole?: string | null
}
