import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'
import type { SubjectDto } from '~/views/subjects/types'
import type { TopicDto } from '~/views/topics/types'

export interface QuestionBank {
  title: string
  subjectId: string
  startEditingDatetimeUtc: string | null
  endEditingDatetimeUtc: string | null
  topicIds?: string[]
  creationPeriod?: string | null
}

export type QuestionBankDto = QuestionBank &
  BaseDto & {
    subject: SubjectDto
    topics: TopicDto[]
    questionTypes: any[]
    totalQuestionCount: number
    startEditingDatetimeUtc: string | null
    endEditingDatetimeUtc: string | null
  }

export type QuestionBankCreateDto = QuestionBank & {
  topicIds: string[]
}
export type QuestionBankFilters = {
  search?: string | null
  subjectId?: string | null
  topics?: string[] | null
} & BaseFilters

