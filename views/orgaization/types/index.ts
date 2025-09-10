export interface Organization {
  arabicName: string
  englishName: string
  parentId: number | null
  uniteTypeId: number
  fullNameAr: string
  fullNameEn: string
  children?: (() => Promise<Organization[]>) | Organization[]
  id: number
}

export interface OrganizationFilters {
  parentId?: number | null | string
  search?: string | null
}
