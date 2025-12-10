// Request interfaces for creating/updating questions
export interface QuestionChoiceRequest {
    text: string
    isCorrect: boolean
}

export interface QuestionOrderingItemRequest {
    text: string
    correctOrderIndex: number
}

export interface MatchingLeftItemRequest {
    text: string
    correctRightItemId: string
    order: number
}

export interface MatchingRightItemRequest {
    id: string
    text: string
}

export interface QuestionTextAnswerPatternRequest {
    pattern: string
}

export interface QuestionRequest {
    questionBankId: string
    topicId: string
    titleEn: string
    titleAr: string
    questionType: string // QuestionType enum value as string
    difficulty: string // Difficulty enum value as string
    isActive: boolean
    explanation?: string
    choices?: QuestionChoiceRequest[]
    orderingItems?: QuestionOrderingItemRequest[]
    matchingLeftItems?: MatchingLeftItemRequest[]
    matchingRightItems?: MatchingRightItemRequest[]
    textAnswerPatterns?: QuestionTextAnswerPatternRequest[]
}

