import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'
import type { Employee } from '~/views/employee/types'
import type { SubjectDto } from '~/views/subjects/types'
import type { TopicDto } from '~/views/topics/types'
import { QuestionType, type Question } from './question'

export interface QuestionBank {
  title: string
  subjectId: string
  startEditingDatetimeUtc: string | null
  endEditingDatetimeUtc: string | null
  topicIds?: string[]
}

export type QuestionBankDto = QuestionBank &
  BaseDto & {
    subject: SubjectDto
    questionBankTopics: QuestionBankTopicDto[]
    questionTypes: QuestionType[]
    totalQuestionCount: number
    startEditingDatetimeUtc: string | null
    endEditingDatetimeUtc: string | null
  }

export type QuestionBankTopicDto = {
  topicId: string
  topic: TopicDto | null
}

export type QuestionBankCreateDto = QuestionBank & {
  topicIds: string[]
}
export type QuestionBankTopicUpdate = {
  topicId: string
}
export type QuestionBankDetailedDto = QuestionBankDto & {
  questions?: (Question & BaseDto)[]
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

export interface ImportQuestionTypeOption {
  label: string
  value: QuestionType
  subType?: string
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
    // {
    //   label: t('article'),
    //   value: QuestionType.Article,
    // },
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
      label: t('radio'),
      value: QuestionType.Radio,
    },
    {
      label: t('fill-the-blank'),
      value: QuestionType.Blank,
    },
    {
      label: t('true-or-false'),
      value: QuestionType.TrueOrFalse,
    },
    {
      label: t('dialogue-radio'),
      value: QuestionType.Dialogue,
      subType: 'radio',
    },
    {
      label: t('dialogue-blank'),
      value: QuestionType.Dialogue,
      subType: 'blank',
    },
  ]
}
export const QUESTION_BANK_ROUTES = {
  BULK_UPLOAD: {
    RADIO: (questionBankId: string) =>
      `/question-bank/${questionBankId}/bulk-radio-upload`,
    BLANK: (questionBankId: string) => `/question-bank/${questionBankId}/bulk-blank-upload`,
    TRUE_FALSE: (questionBankId: string) =>
      `/question-bank/${questionBankId}/bulk-true-false-upload`,
    DIALOGUE_RADIO: (questionBankId: string) =>
      `/question-bank/${questionBankId}/bulk-dialogue-radio-upload`,
    DIALOGUE_BLANK: (questionBankId: string) =>
      `/question-bank/${questionBankId}/bulk-dialogue-blank-upload`,
  },
  TEMPLATE_DOWNLOAD: {
    ARABIC: (type: string) => `/questiontemplate/arabic/${type}`,
  },
}
