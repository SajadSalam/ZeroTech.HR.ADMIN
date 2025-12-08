import type { AxiosError } from 'axios'

export interface PaginatedResponse<T> {
  items: T[]
  pagesCount: number
  currentPage: number
  type: string
  pageSize: number
  rowCount: number
  firstRowOnPage: number
  lastRowOnPage: number
  isLastPage: boolean
}

export interface WithoutPagination<T> {
  data: T[]
}
export interface SingleObjectResponse<T> {
  data: T
  code: number
  message?: string
  error?: null
}
export interface BaseFilters extends Record<string, any> {
  Page: number
  PageSize: number
  Search: string
}

export type ApiError<T> = AxiosError<PaginatedResponse<T>>
