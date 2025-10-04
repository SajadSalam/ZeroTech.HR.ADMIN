import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'

export type QuestionOption = {
    title: string
    isTrueAnswer: boolean
}

export type Question = {
    title: string | null
    options: QuestionOption[]
    publishedAt: string | null
    link_award_question?: string | null
}

export type QuestionDto = BaseDto & Question

export type QuestionFilters = BaseFilters & {
    title: string | null
}
