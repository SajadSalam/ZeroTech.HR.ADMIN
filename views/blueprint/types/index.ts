import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'
import type { QuestionBankDto } from '~/views/question-bank/types'
import type { Difficulty, QuestionType } from '~/views/question-bank/types/question'

export interface Blueprint {
  title: string;
  totalQuestionsGrade: number;
  fullGrade: number;
  successGrade: number;
  description: string;
  displayResult: boolean;
  moveBetweenQuestion: boolean;
  randomizeAnswer: boolean;
  randomizeChoices: boolean;
  questionBankNames: string[];
  topicNames: string[];
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

export interface BlueprintCreate {
  title: string;
  successGrade: number;
  fullGrade: number;
  totalQuestionsGrade: number;
  displayResult: boolean;
  moveBetweenQuestion: boolean;
  randomizeAnswer: boolean;
  randomizeChoices: boolean;
  description: string;
  items: BlueprintItem[];
}

export interface BlueprintItem {
  questionBankId: string;
  topicId: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  numberOfQuestions: number;
  gradePerQuestion: number;
}
