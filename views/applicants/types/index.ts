import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'

export type Applicant = {
  documentId: string | null
  firstName: string | null
  secondName: string | null
  thirdName: string | null
  birthDate: string | null
  phoneNumber: string | null
  email: string | null
  gender: string | null
  isAccepted: boolean | null
}

export type ApplicantDto = BaseDto & Applicant

export type ApplicantFilters = BaseFilters & {
  firstName: string | null
  secondName: string | null
  thirdName: string | null
  email: string | null
  phoneNumber: string | null
  gender: string | null
} 