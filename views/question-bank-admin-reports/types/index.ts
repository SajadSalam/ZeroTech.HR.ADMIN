import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'

export type QuestionBankReport = {
  id: string | null
  subject: string | null
  totalQuestions: string | null
  questionsCreator: string | null
  auditor: string | null
  status: string | null
}

export type QuestionBankReportDto = BaseDto &
  QuestionBankReport & {
    id: string | null
    subject: string | null
    totalQuestions: string | null
    questionsCreator: string | null
    auditor: string | null
    status: string | null
  }
export type QuestionBankReportFilters = BaseFilters & {
  subject?: string | null
}
