import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'
import type { CategoryDto } from '~/views/categories/types'
import type { Employee } from '~/views/employee/types'
import type { SubjectDto } from '~/views/subjects/types'
import type { TopicDto } from '~/views/topics/types'
import { QuestionType, type Question } from './question'

export interface QuestionBank {
  title: string
  creationStartDate: string
  creationEndDate: string
}

export type QuestionBankDto = QuestionBank &
  BaseDto & {
    subject: SubjectDto
    questionBankTopics: QuestionBankTopicDto[]
    questionTypes: QuestionType[]
    totalQuestionCount: number
    creationStartDate: string | null
    creationEndDate: string | null
    categories?: CategoryDto[]
  }

export type QuestionBankTopicDto = {
  topicId: string
  topic: TopicDto | null
}

export type QuestionBankCreateDto = QuestionBank & {
  topicIds: string[]
  creationStartDate: string | null
  creationEndDate: string | null
  categories?: string[]
}
export type QuestionBankTopicUpdate = {
  topicId: string
}
export type QuestionBankDetailedDto = QuestionBankDto & {
  questions: (Question & BaseDto)[]
}
export type QuestionBankFilters = {
  search: string | null
  subjectId: string | null
  topics: string[] | null
} & BaseFilters

export interface AssignForm {
  employeeId: string
}
export enum AssignType {
  Creator = 1,
  Auditor = 2,
}

export interface AssignDto {
  employeeId: string
  employee: Employee
  type: number
}

export interface QuestionCustomAnswerProps {
  correctOptionIds?: string[]
  correctBoolean?: boolean
  correctText?: string
}
export const questionTypeOptions = (t: (key: string) => string) => {
  return [
    {
      label: t('multiple-choice'),
      value: QuestionType.MultipleChoice,
    },
    {
      label: t('fill-the-blank'),
      value: QuestionType.Blank,
    },
    {
      label: t('dropdown'),
      value: QuestionType.DropDown,
    },
    {
      label: t('article'),
      value: QuestionType.Article,
    },
    {
      label: t('true-or-false'),
      value: QuestionType.TrueOrFalse,
    },
    {
      label: t('radio'),
      value: QuestionType.Radio,
    },
    {
      label: t('matching'),
      value: QuestionType.Matching
    },
    {
      label: t('reorder'),
      value: QuestionType.Reorder
    },
    {
      label: t('dialogue'),
      value: QuestionType.Dialogue
    },
  ]
}

export const questionTypeMap: { [key: string]: QuestionType } = {
  'multiple-choice': QuestionType.MultipleChoice,
  'fill-the-blank': QuestionType.Blank, // Changed from 'blank' to match label
  'true-or-false': QuestionType.TrueOrFalse,
}

export const importQuestionTypeOptions = (t: (key: string) => string) => {
  return [
    {
      label: t('multiple-choice'),
      value: QuestionType.MultipleChoice,
    },
    {
      label: t('fill-the-blank'),
      value: QuestionType.Blank,
    },

    {
      label: t('true-or-false'),
      value: QuestionType.TrueOrFalse,
    },
  ]
}
export const QUESTION_BANK_ROUTES = {
  BULK_UPLOAD: {
    MULTIPLE_CHOICE: (questionBankId: string) =>
      `/question-bank/${questionBankId}/bulk-radio-upload`,
    BLANK: (questionBankId: string) => `/question-bank/${questionBankId}/bulk-blank-upload`,
    TRUE_FALSE: (questionBankId: string) =>
      `/question-bank/${questionBankId}/bulk-true-false-upload`,
  },
}
