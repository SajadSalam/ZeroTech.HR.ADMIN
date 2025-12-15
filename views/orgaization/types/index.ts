export interface Organization {
  parentId: number | null
  uniteTypeId: number
  name: string
  children?: (() => Promise<Organization[]>) | Organization[]
  id: number
}

export interface OrganizationFilters {
  parentId?: number | null | string
  search?: string | null
}
