import type { BaseFilters } from '~/utils/types/ApiResponses'

export interface Student {
  fullName: string
  universityIDNumber: string
  phoneNumber: string
  email: string
  password: string
  studyProgramId: number
  courseId: number
  courseName: string
  organizationalStructureId: number
  organizationalStructureArName: string
  organizationalStructureEnName: string
  organizationalStructureUniteTypeId: number
  organizationalStructureParentId: number
  parentOrganizationalStructureArName: string
  parentOrganizationalStructureEnName: string
  parentOrganizationalStructureUniteTypeId: number
  gender: number
  grade?: number | null
  status?: number | string
}

export type StudentFilters = BaseFilters & {
  search?: string
  universityIDNumber?: string
}
export enum StudentStatus {
  NOT_TAKEN = 1,
  PASSED = 2,
  FAILED = 3,
  ABSENCE = 4,
}
