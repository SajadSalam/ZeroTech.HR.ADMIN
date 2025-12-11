import { Difficulty, QuestionType } from './types'

// ============================================
// Question Type Converters
// ============================================

/**
 * Converts string representation to QuestionType enum
 * @param value - String like 'SingleChoice', 'MultipleChoice', etc.
 * @returns QuestionType enum value
 */
export const questionTypeFromString = (value: string): QuestionType => {
  const mapping: Record<string, QuestionType> = {
    SingleChoice: QuestionType.SingleChoice,
    MultipleChoice: QuestionType.MultipleChoice,
    TrueFalse: QuestionType.TrueFalse,
    Ordering: QuestionType.Ordering,
    Matching: QuestionType.Matching,
    ShortAnswer: QuestionType.ShortAnswer,
    FillInBlank: QuestionType.FillInBlank,
  }
  return mapping[value] ?? QuestionType.SingleChoice
}

/**
 * Converts QuestionType enum to string representation
 * @param value - QuestionType enum value
 * @returns String like 'SingleChoice', 'MultipleChoice', etc.
 */
export const questionTypeToString = (value: QuestionType): string => {
  const mapping: Record<QuestionType, string> = {
    [QuestionType.SingleChoice]: 'SingleChoice',
    [QuestionType.MultipleChoice]: 'MultipleChoice',
    [QuestionType.TrueFalse]: 'TrueFalse',
    [QuestionType.Ordering]: 'Ordering',
    [QuestionType.Matching]: 'Matching',
    [QuestionType.ShortAnswer]: 'ShortAnswer',
    [QuestionType.FillInBlank]: 'FillInBlank',
  }
  return mapping[value] ?? 'SingleChoice'
}

/**
 * Gets localized label for a question type
 * @param type - QuestionType enum value
 * @param t - i18n translation function
 * @returns Localized label
 */
export const getQuestionTypeLabel = (
  type: QuestionType | string,
  t: (key: string) => string
): string => {

    if(typeof type === 'string') {
    type = questionTypeFromString(type)
    }
  const labels: Record<QuestionType, string> = {
    [QuestionType.SingleChoice]: t('single-choice'),
    [QuestionType.MultipleChoice]: t('multiple-choice'),
    [QuestionType.TrueFalse]: t('true-false'),
    [QuestionType.Ordering]: t('ordering'),
    [QuestionType.Matching]: t('matching'),
    [QuestionType.ShortAnswer]: t('short-answer'),
    [QuestionType.FillInBlank]: t('fill-in-blank'),
  }
  return labels[type] ?? t('unknown')
}

/**
 * Gets icon name for a question type
 * @param type - QuestionType enum value
 * @returns Phosphor icon name
 */
export const getQuestionTypeIcon = (type: QuestionType): string => {
  const icons: Record<QuestionType, string> = {
    [QuestionType.SingleChoice]: 'ph:radio-button',
    [QuestionType.MultipleChoice]: 'ph:check-square',
    [QuestionType.TrueFalse]: 'ph:toggle-right',
    [QuestionType.Ordering]: 'ph:list-numbers',
    [QuestionType.Matching]: 'ph:arrows-left-right',
    [QuestionType.ShortAnswer]: 'ph:text-aa',
    [QuestionType.FillInBlank]: 'ph:text-indent',
  }
  return icons[type] ?? 'ph:question'
}

// ============================================
// Difficulty Converters
// ============================================

/**
 * Converts string representation to Difficulty enum
 * @param value - String like 'Easy', 'Medium', 'Hard'
 * @returns Difficulty enum value
 */
export const difficultyFromString = (value: string): Difficulty => {
  const mapping: Record<string, Difficulty> = {
    Easy: Difficulty.Easy,
    Medium: Difficulty.Medium,
    Hard: Difficulty.Hard,
  }
  return mapping[value] ?? Difficulty.Easy
}

/**
 * Converts Difficulty enum to string representation
 * @param value - Difficulty enum value
 * @returns String like 'Easy', 'Medium', 'Hard'
 */
export const difficultyToString = (value: Difficulty): string => {
  const mapping: Record<Difficulty, string> = {
    [Difficulty.Easy]: 'Easy',
    [Difficulty.Medium]: 'Medium',
    [Difficulty.Hard]: 'Hard',
  }
  return mapping[value] ?? 'Easy'
}

/**
 * Gets localized label and color for a difficulty level
 * @param difficulty - Difficulty enum value
 * @param t - i18n translation function
 * @returns Object with label and color
 */
export const getDifficultyConfig = (
  difficulty: Difficulty | string,
  t: (key: string) => string
): { label: string; color: 'success' | 'warning' | 'danger' | 'muted' } => {
  if(typeof difficulty === 'string') {
    difficulty = difficultyFromString(difficulty)
  }
  const configs: Record<
    Difficulty,
    { label: string; color: 'success' | 'warning' | 'danger' }
  > = {
    [Difficulty.Easy]: { label: t('easy'), color: 'success' },
    [Difficulty.Medium]: { label: t('medium'), color: 'warning' },
    [Difficulty.Hard]: { label: t('hard'), color: 'danger' },
  }
  return configs[difficulty] ?? { label: t('unknown'), color: 'muted' }
}
