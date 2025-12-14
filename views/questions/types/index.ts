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
    RequestUpdate = 2,
    Approve = 3    ,
    Cancel = 4,
}

// QuestionChoice interfaces
export interface QuestionChoice {
    id?: string
    text: string
    isCorrect: boolean
}

export type QuestionChoiceDto = BaseDto & QuestionChoice

// QuestionTextAnswerPattern interfaces
export interface QuestionTextAnswerPattern {
    id?: string
    pattern: string
}

export type QuestionTextAnswerPatternDto = BaseDto & QuestionTextAnswerPattern

// QuestionOrderingItem interfaces
export interface QuestionOrderingItem {
    id?: string
    text: string
    correctOrderIndex: number
}

export type QuestionOrderingItemDto = BaseDto & QuestionOrderingItem

// MatchingRightItem interfaces
export interface MatchingRightItem {
    id?: string
    text: string
}

export type MatchingRightItemDto = BaseDto & MatchingRightItem

// MatchingLeftItem interfaces
export interface MatchingLeftItem {
    id?: string
    text: string
    correctRightItemId: string
    order: number
}

export type MatchingLeftItemDto = BaseDto & MatchingLeftItem

// Question interfaces
export interface Question {
    id?: string
    questionBankId: string
    topicId: string
    topic?: {
        id: string
        titleEn: string
        titleAr: string
    }
    titleEn: string
    titleAr: string
    questionType: QuestionType | string
    difficulty: Difficulty | string
    isActive: boolean
    status: AuditStatus | string
    auditStatus?: AuditStatus
    creator?: {
        id: number
        name: string
    }
    auditor?: {
        id: number
        name: string
    } | null
    auditDate?: string | null
    explanation?: string | null
    attachments?: unknown[] // Attachment type would need to be defined elsewhere
    choices?: QuestionChoiceDto[]
    orderingItems?: QuestionOrderingItemDto[]
    matchingLeftItems?: MatchingLeftItemDto[]
    matchingRightItems?: MatchingRightItemDto[]
    textAnswerPatterns?: QuestionTextAnswerPatternDto[]
    createdAtUtc?: string
    updateAtUtc?: string
}

export type QuestionDto = BaseDto & Question