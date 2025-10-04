import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'

export type AwardStatus = 'inprogress' | 'completed'

export type Award = {
    awardName: string | null
    awardStatus: AwardStatus | null
    academicYear: string | null
    version: string | null
    lunchDate: string | null
    applicationEndDate: string | null
    honoringDate: string | null
    resultDate: string | null
    formRequirement: string | null
    criteria: string | null
    examTime: number | null
    delayAllowedTime: number | null
    publishedAt: string | null
    examDate: string | null
}

export type AwardDto = BaseDto & Award

export type AwardFilters = BaseFilters & {
    awardName: string | null
    awardStatus: AwardStatus | null
    academicYear: string | null
}
