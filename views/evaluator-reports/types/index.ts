import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'

export type EvaluatorPerformance = {
  id: string | null
  fullName: string | null
  examName: string | null
  nationalId: string | null
  email: string | null
  phoneNumber: string | null
  gender: string | null
  type: string | null
  colleage: string | null
  department: string | null
  stage: string | null
  grade: string | null
  status: string | null
}

export type EvaluatorPerformanceDto = BaseDto &
  EvaluatorPerformance & {
    id: string | null
    fullName: string | null
    examName: string | null
    nationalId: string | null
    email: string | null
    phoneNumber: string | null
    gender: string | null
    type: string | null
    colleage: string | null
    department: string | null
    stage: string | null
    grade: string | null
    status: string | null
  }
export type EvaluatorPerformanceFilters = BaseFilters & {
  fullName?: string | null
}
