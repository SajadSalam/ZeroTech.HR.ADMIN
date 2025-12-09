import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'
import type { ExamDto } from '~/views/exams/types'
import type { QuestionDto } from '~/views/questions/types'
import type { Student } from '~/views/students/types'

export type EvaluationDto = {
  exam: ExamDto
  studentFullName: string
  studentId: number
  totalGrades: number
  questionsCount: number
} & BaseDto

export type EvaluationDetialedDto = {
  exam: ExamDto
  student: Student
  questionGrades: QuestionGrades[]
} & BaseDto

export type QuestionGrades = {
  question: QuestionDto
  grade: number
  correctBoolean: boolean | null
  correctText: string | null
  correctOptionIds: string[]
}

export type EvaluationFitlers = BaseFilters & {
  studentFullName: string | null
  minDate: string | null
  maxDate: string | null
  hasCurve: boolean
  examId: string | null
  groupId: string | null
}
