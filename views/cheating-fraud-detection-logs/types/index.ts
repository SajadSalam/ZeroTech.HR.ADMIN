import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'

export type CheatingFraudDetectionLogs = {
  id: string | null
  studentId: string | null
  studentName: string | null
  examName: string | null
  violationType: string | null
  timeStamp: string | null
  status: string | null
}

export type CheatingFraudDetectionLogsDto = BaseDto &
  CheatingFraudDetectionLogs & {
    id: string | null
    studentId: string | null
    studentName: string | null
    examName: string | null
    violationType: string | null
    timeStamp: string | null
    status: string | null
  }

export type CheatingFraudDetectionLogsFilters = BaseFilters & {
  studentId?: string | null
}
