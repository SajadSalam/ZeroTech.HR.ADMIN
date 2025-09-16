import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'
import type { QuestionBankDto } from '~/views/question-bank/types'
import type { Difficulty, KnowledgeLevel, QuestionType } from '~/views/question-bank/types/question'

export interface Blueprint {
  name: string
  successGrade: number
  halfSuccessGrade: number
  displayResult: boolean
  moveBetweenQuestion: boolean
  randomizeAnswer: boolean
  randomizeChoices: boolean
  maximumGrade: number
  questionBanks: BlueprintQuestionBank[]
}
export type BlueprintDto = Blueprint & BaseDto
export interface BlueprintQuestionBank {
  questionBankId: string
  topics: BlueprintTopic[]
  questionBanks: QuestionBankDto[]
}

export interface BlueprintTopic {
  topicId: string
  questionType: QuestionType
  numberOfQuestions: number
  grade: number
  knowledgeLevelId: string
  difficulty: Difficulty
}
export type BlueprintFilter = {
  search?: string | null
  questionBankId: string | null
  minGrade: string | null
  maxGrade: string | null
  subjectId: string | null
  topicId: string | null
} & BaseFilters

export enum DegreeDisplayType {
  Percentage = 'Percentage',
  Points = 'Points',
  Letters = 'Letters',
}
