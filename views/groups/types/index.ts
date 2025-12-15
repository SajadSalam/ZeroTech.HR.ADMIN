import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'
import type { Organization } from '~/views/orgaization/types'

export interface Group {
  title: string
}

export type GroupDto = Group &
  BaseDto & {
    organizationalStructureGroups: Organization[]
  }

export type GroupCreate = Group & {
  organizationalStructureIds: number[]
}
export type GroupsFilters = {
  search: string | null
  orginizations: number[] | null
} & BaseFilters
