import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'

export type Subject = {
  name: string | null
  code: string | null
  englishName: string | null
}

export type SubjectDto = BaseDto & Subject

export type SubjectFilters = BaseFilters & {
  name: string | null
  code: string | null
  englishName: string | null
}
