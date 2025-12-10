import type { BaseDto } from "~/utils/types/base-dto"

export enum QuestionType {
    SingleChoice = 1,
    MultipleChoice = 2,
    TrueFalse = 3,
    Ordering = 4,
    Matching = 5,
    ShortAnswer = 6,
    FillInBlank = 7,
}

export enum Difficulty {
    Easy = 1,
    Medium = 2,
    Hard = 3,
}


export enum AuditStatus {
    Pending = 1,
    Approved = 2,
    Rejected = 3,
}

// QuestionChoice interfaces
export interface QuestionChoice {
    questionId: string
    text: string
    isCorrect: boolean
}

export type QuestionChoiceDto = BaseDto & QuestionChoice

// QuestionTextAnswerPattern interfaces
export interface QuestionTextAnswerPattern {
    questionId: string
    pattern: string
}

export type QuestionTextAnswerPatternDto = BaseDto & QuestionTextAnswerPattern

// QuestionOrderingItem interfaces
export interface QuestionOrderingItem {
    questionId: string
    text: string
    correctOrderIndex: number
}

export type QuestionOrderingItemDto = BaseDto & QuestionOrderingItem

// MatchingRightItem interfaces
export interface MatchingRightItem {
    questionId: string
    text: string
}

export type MatchingRightItemDto = BaseDto & MatchingRightItem

// MatchingLeftItem interfaces
export interface MatchingLeftItem {
    questionId: string
    text: string
    correctRightItemId: string
    order: number
}

export type MatchingLeftItemDto = BaseDto & MatchingLeftItem

// Question interfaces
export interface Question {
    questionBankId: string
    topicId: string
    titleEn: string
    titleAr: string
    questionType: QuestionType
    difficulty: Difficulty
    isActive: boolean
    status: AuditStatus
    explanation?: string | null
    attachments?: unknown[] // Attachment type would need to be defined elsewhere
    choices?: QuestionChoiceDto[]
    orderingItems?: QuestionOrderingItemDto[]
    matchingLeftItems?: MatchingLeftItemDto[]
    matchingRightItems?: MatchingRightItemDto[]
    textAnswerPatterns?: QuestionTextAnswerPatternDto[]
}

export type QuestionDto = BaseDto & Question