import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'
import type { SubjectDto } from '~/views/subjects/types'

export type Topic = {
  name: string | null
}

export type TopicDto = BaseDto &
  Topic & {
    subjectId: string | null
    subjectName: string | null
    subject: SubjectDto
  }
export type TopicCreateDto = Topic & {
  subjectId: string | null
}

export type TopicFilters = BaseFilters & {
  subjectId?: string | null
  name?: string | null
}
