import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'
import type { Subject, SubjectDto } from '~/views/subjects/types'

export type Topic = {
  titleAr: string | null
  titleEn: string | null
}

export type TopicDto = BaseDto &
  Topic & {
    subjectId: string | null
    subjectName: string | null
    subject: SubjectDto
  }
export type TopicCreateDto = Topic & {
  subject: Subje  ct | null
  titleAr: string | null
  titleEn: string | null
}

export type TopicFilters = BaseFilters & {
  subjectId?: string | null
  name?: string | null
}
