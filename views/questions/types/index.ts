import type { BaseDto } from "~/utils/types/base-dto"

interface Question {
  title: string
}
export type QuestionDto = BaseDto & Question

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