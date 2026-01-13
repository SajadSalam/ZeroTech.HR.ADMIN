import type { AxiosError } from 'axios'

export interface PaginatedResponse<T> {
  items: T[]
  pagesCount: number
  currentPage: number
  type: string
  totalItems?: number
}

export interface WithoutPagination<T> {
  items: T[]
}
export interface SingleObjectResponse<T> {
  item: T
  code: number
  message?: string
  error?: null
}
export interface BaseFilters extends Record<string, any> {
  pageNumber: number
  pageSize: number
}

export type ApiError<T> = AxiosError<PaginatedResponse<T>>
