import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'
import type { QuestionBankDto } from '~/views/question-bank/types'
import type { Difficulty, QuestionType } from '~/views/questions/types'

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
}

export interface BlueprintTopic {
  topicId: string
  questionType: QuestionType | null
  numberOfQuestions: number
  grade: number
  difficulty: Difficulty | null
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

export interface QuestionBankBlueprintDetails {
  title: string
  subject: {
    id: string
    name: string
    questionCount: number
  }
  topics: {
    id: string
    name: string
    questionCount: number
  }[]
  questionTypes: {
    topicId: string
    questionType: number
    questionCount: number
  }[]
  difficulties: {
    difficulty: number
    questionCount: number
  }[]
}