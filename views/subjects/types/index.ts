import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'

export type Subject = {
  titleAr: string | null
  code: string | null
  titleEn: string | null
}

export type SubjectDto = BaseDto & Subject

export type SubjectFilters = BaseFilters & {
  titleAr: string | null
  code: string | null
  titleEn: string | null
}
