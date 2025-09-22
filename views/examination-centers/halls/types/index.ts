import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'
import type { ExaminationCenter } from '../../types'

export type Hall = {
  name: string
  examCenterId: string
  capacity: number
}

export type Supervisor = {
  supervisorId: number
  isPrimary: boolean
  notes: string | null
}

export type HallSupervisor = {
  id: string
  supervisorId: number
  supervisorName: string
  supervisorEmail: string
  isPrimary: boolean
  assignedDate: string
  assignedByEmployeeName: string
  notes: string | null
  isActive: boolean
}

export type HallDto = BaseDto &
  Hall & {
    examCenterId: string | null
    examCenterName: string | null
    examCenter: ExaminationCenter
    supervisors?: HallSupervisor[]
  }
export type HallCreateDto = Hall

export type HallFilters = BaseFilters & {
  examCenterId?: string | null
  name?: string | null
}
