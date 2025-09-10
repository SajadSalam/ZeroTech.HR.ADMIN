import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'

export type QuestionDto = BaseDto & Question
export interface Question {
  title: string
  image: File | null
  order: number
  type: QuestionType
  options: Option[]
  correctBoolean: boolean
  correctText: string
  knowledgeLevel: KnowledgeLevel
  difficulty: Difficulty
  isContentShown?: boolean
  matchingPairs?: MatchingItem[]
  orderItems?: OrderItem[]
  createdBy?: string
  creationDate?: string
  auditBy?: string
  auditDate?: string
  auditStatus?: AuditStatus
  topicId: string
  clientId?: string
}
export interface MatchingItem {
  left: string // The first item in the pair
  right: string // The matching item
}
export interface OrderItem {
  title: string
  order: number
}
export interface Option {
  title: string
  image?: File | null
  order: number
  isCorrect: boolean
}

export enum KnowledgeLevel {
  Remember = 1,
  Understand = 2,
  Apply = 3,
  Analyze = 4,
  Evaluate = 5,
  Create = 6,
}

export enum Difficulty {
  Easy = 1,
  Medium = 2,
  Hard = 3,
}

export enum QuestionType {
  MultipleChoice,
  Blank,
  DropDown,
  Article,
  TrueOrFalse,
  Radio,
  Matching,
  Reorder,
}

export enum AuditStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3,
}

export type QuestionFilters = BaseFilters & {
  type: QuestionType | null
  title: string | null
  topicId: string | null
  knowledgeLevel: KnowledgeLevel | null
  difficulty: Difficulty | null
}
