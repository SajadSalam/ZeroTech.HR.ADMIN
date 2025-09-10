import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'

export type Knowledgelevel = {
  name: string | null
}

export type KnowledgelevelDto = BaseDto & Knowledgelevel
export type KnowledgelevelCreateDto = Knowledgelevel 

export type KnowledgelevelFilters = BaseFilters & {
  name?: string | null
}
