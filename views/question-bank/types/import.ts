import { QuestionType } from '~/views/questions/types'

/**
 * Question type options for import
 */
export interface ImportQuestionTypeOption {
  label: string
  value: QuestionType
  endpoint: string
  templateEndpoint: string
}

/**
 * Import question response from API
 */
export interface ImportQuestionResponse {
  message?: string
  totalRows: number
  successCount: number
  errorCount: number
  hasErrors: boolean
  errors: ImportQuestionError[]
}

/**
 * Individual import error details
 */
export interface ImportQuestionError {
  rowNumber: number
  questionTitle: string
  field: string
  errorMessage: string
  errorMessageAr: string
  errorDetails?: string
}

/**
 * Helper function to get import question type options
 */
export const importQuestionTypeOptions = (t: (key: string) => string): ImportQuestionTypeOption[] => [
  {
    label: t('single-choice'),
    value: QuestionType.SingleChoice,
    endpoint: 'import-choices',
    templateEndpoint: 'download-choices-template',
  },
  {
    label: t('fill-in-blank'),
    value: QuestionType.FillInBlank,
    endpoint: 'import-fill-in-blank',
    templateEndpoint: 'download-fill-in-blank-template',
  },
   {
    label: t('true-or-false'),
    value: QuestionType.TrueFalse,
    endpoint: 'import-true-false',
    templateEndpoint: 'download-true-false-template',
  },
]


