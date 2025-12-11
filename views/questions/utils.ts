import { Difficulty, QuestionType } from "./types"

export const mapQuestionTypeStringToEnum = (type: string): QuestionType => {
  switch (type) {
    case 'SingleChoice':
      return QuestionType.SingleChoice
    case 'MultipleChoice':
      return QuestionType.MultipleChoice
    case 'TrueFalse':
      return QuestionType.TrueFalse
    case 'Ordering':
      return QuestionType.Ordering
    case 'Matching':
      return QuestionType.Matching
    case 'ShortAnswer':
      return QuestionType.ShortAnswer
    case 'FillInBlank':
      return QuestionType.FillInBlank
    default:
      return QuestionType.SingleChoice
  }
}
// Get question type label
export const getQuestionTypeLabel = (type: QuestionType, t: (key: string) => string): string => {
    if(typeof type === 'string') {
        type = mapQuestionTypeStringToEnum(type)
    }
  const labels: Record<QuestionType, string> = {
    [QuestionType.SingleChoice]: t('single-choice'),
    [QuestionType.MultipleChoice]: t('multiple-choice'),
    [QuestionType.TrueFalse]: t('true-false'),
    [QuestionType.Ordering]: t('ordering'),
    [QuestionType.Matching]: t('matching'),
    [QuestionType.ShortAnswer]: t('short-answer'),
    [QuestionType.FillInBlank]: t('fill-the-blank'),
  }
  return labels[type] || t('unknown')
}

// Get question type icon
export const getQuestionTypeIcon = (type: QuestionType): string => {
    if(typeof type === 'string') {
        type = mapQuestionTypeStringToEnum(type)
    }
  const icons: Record<QuestionType, string> = {
    [QuestionType.SingleChoice]: 'ph:radio-button',
    [QuestionType.MultipleChoice]: 'ph:check-square',
    [QuestionType.TrueFalse]: 'ph:toggle-right',
    [QuestionType.Ordering]: 'ph:list-numbers',
    [QuestionType.Matching]: 'ph:arrows-left-right',
    [QuestionType.ShortAnswer]: 'ph:text-aa',
    [QuestionType.FillInBlank]: 'ph:text-indent',
  }
  return icons[type] || 'ph:question'
}
export const mapQuestionTypeEnumToString = (questionType: QuestionType): string => {
  switch (questionType) {
    case QuestionType.SingleChoice:
      return 'SingleChoice'
    case QuestionType.MultipleChoice:
      return 'MultipleChoice'
    case QuestionType.TrueFalse:
      return 'TrueFalse'
    case QuestionType.Ordering:
      return 'Ordering'
    case QuestionType.Matching:
      return 'Matching'
    case QuestionType.ShortAnswer:
      return 'ShortAnswer'
    case QuestionType.FillInBlank:
      return 'FillInBlank'
    default:
      return 'SingleChoice'
  }
}
export const mapDifficultyStringToEnum = (difficulty: string): Difficulty => {
  switch (difficulty) {
    case 'Easy':
      return Difficulty.Easy
    case 'Medium':
      return Difficulty.Medium
    case 'Hard':
      return Difficulty.Hard
    default:
      return Difficulty.Easy
  }
}

export const mapDifficultyEnumToString = (difficulty: Difficulty): string => {
  switch (difficulty) {
    case Difficulty.Easy:
      return 'Easy'
    case Difficulty.Medium:
      return 'Medium'
    case Difficulty.Hard:
      return 'Hard'
  }
}
// Get difficulty label and color
export const getDifficultyConfig = (difficulty: Difficulty, t: (key: string) => string) => {
    if(typeof difficulty === 'string') {
        difficulty = mapDifficultyStringToEnum(difficulty)
    }
  const configs = {
    [Difficulty.Easy]: { label: t('easy'), color: 'success' },
    [Difficulty.Medium]: { label: t('medium'), color: 'warning' },
    [Difficulty.Hard]: { label: t('hard'), color: 'danger' },
  }
  return configs[difficulty] || { label: t('unknown'), color: 'muted' }
}