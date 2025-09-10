import type { BaseDto } from '~/utils/types/base-dto'
import type { Organization } from '~/views/orgaization/types'



export interface ExaminationCenter {
  name: string
  isActive: boolean
  collegeId: number
  governorateId: number
  maxCapacity: number
}
export type ExaminationCenterDto = ExaminationCenter &
  BaseDto & {
    college: Organization
    collegeName: string
  }
