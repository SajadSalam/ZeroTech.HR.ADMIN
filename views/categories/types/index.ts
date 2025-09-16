import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'

export type Category = {
  name: string | null
}

export type CategoryDto = BaseDto & Category

export type CategoryFilters = BaseFilters & {
  name: string | null
}
