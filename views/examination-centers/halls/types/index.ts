import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'
import type { ExaminationCenter } from '../../types'

export type Hall = {
  name: string
  examCenterId: string
  capacity: number
}

export type HallDto = BaseDto &
  Hall & {
    examCenterId: string | null
    examCenterName: string | null
    examCenter: ExaminationCenter
  }
export type HallCreateDto = Hall

export type HallFilters = BaseFilters & {
  examCenterId?: string | null
  name?: string | null
}
