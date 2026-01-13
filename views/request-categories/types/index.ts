import type { BaseDto, BaseFilters } from '~/utils/types'

// Base request category type
export type RequestCategory = {
  name: string
  description?: string
  code: string
  colorCode?: string
  iconClass?: string
  displayOrder?: number
  isEnabled: boolean
}

// Request category DTO with BaseDto extension
export type RequestCategoryDto = BaseDto & RequestCategory & {
  requestTypeCount?: number
  requestTypes?: RequestTypeInCategory[]
}

// Request type in category (simplified)
export type RequestTypeInCategory = {
  id: number | string
  name: string
  code: string
  categoryId: number | string
  isEnabled: boolean
  requiresApproval: boolean
}

// Create request category DTO
export type RequestCategoryCreateDto = RequestCategory

// Update request category DTO
export type RequestCategoryUpdateDto = RequestCategory & {
  id: number | string
}

// Request category filters extending BaseFilters
export type RequestCategoryFilters = BaseFilters & {
  name?: string
  code?: string
  isEnabled?: boolean
}
