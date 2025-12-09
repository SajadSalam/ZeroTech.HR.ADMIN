import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'
import type { QuestionBankDto } from '~/views/question-bank/types'
import type { Difficulty, QuestionType } from '~/views/questions/types'

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

export type BlueprintFilter = {
  questionBankId: string | null
  topicId: string | null
  SuccessGrade: string | null
  FullGrade: string | null
} & BaseFilters

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
export interface BlueprintTopic {
  topicId: string;
  topicTitleEn: string;
  topicTitleAr: string;
  questionType: QuestionType;
  numberOfQuestions: number;
  grade: number;
  difficulty: Difficulty;
  order: number;
}
export interface BlueprintQuestionBankItem {
  id: string;
  examTemplateId: string;
  questionBankId: string;
  questionBankTitle: string;
  topicId: string;
  topicTitleEn: string;
  topicTitleAr: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  numberOfQuestions: number;
  gradePerQuestion: number;
  itemTotalGrade: number;
  order: number;
}

export interface BlueprintQuestionBank {
  questionBankId: string;
  questionBankTitle: string;
  topics: BlueprintTopic[];
}
export interface BlueprintDetailes extends BlueprintDto {
  questionBanks: BlueprintQuestionBank[];
  items: BlueprintQuestionBankItem[];
}

export interface CountDetails {
  id: string;
  title: string;
  totalCount: number;
  topics: TopicDetails[];
}

export interface TopicDetails {
  id: string;
  titleEn: string;
  titleAr: string;
  types: QuestionTypeStats[];
}

export interface QuestionTypeStats {
  name: string;
  value: number;
  difficulty: DifficultyStats[];
}

export interface DifficultyStats {
  name: string;
  value: number;
  count: number;
}
