import { useI18n } from 'vue-i18n'
import { createValidator } from '~/services/validationWithI18n'
import { Validator } from '~/services/validator'
import { Difficulty, QuestionType, type MatchingLeftItem, type MatchingRightItem, type QuestionChoice, type QuestionOrderingItem, type QuestionTextAnswerPattern } from '../../types'
import type {
    MatchingLeftItemRequest,
    MatchingRightItemRequest,
    QuestionChoiceRequest,
    QuestionOrderingItemRequest,
    QuestionRequest,
    QuestionTextAnswerPatternRequest,
} from '../../types/request'
import {
    difficultyFromString,
    difficultyToString,
    questionTypeFromString,
    questionTypeToString,
} from '../../utils'

// Form state interface that matches the validator requirements
export interface QuestionFormState {
  questionBankId: string
  topicId: string
  titleEn: string
  titleAr: string
  questionType: QuestionType | null
  difficulty: Difficulty | null
  isActive: boolean
  explanation: string
  choices: QuestionChoiceRequest[]
  orderingItems: QuestionOrderingItemRequest[]
  matchingLeftItems: MatchingLeftItemRequest[]
  matchingRightItems: MatchingRightItemRequest[]
  textAnswerPatterns: QuestionTextAnswerPatternRequest[]
}

// Helper type for accessing form body fields
type FormBody = {
  [K in keyof QuestionFormState]: {
    $model: QuestionFormState[K]
    $errors: { $message: string }[]
  }
} & {
  $validate: () => Promise<boolean>
  $errors: { $message: string }[]
  $reset: () => void
}

export const useQuestionForm = (
  questionBankId?: string,
  topicId?: string
) => {
  const { t } = useI18n()

  // Flag to track if we're currently filling the form (prevents watcher from clearing data)
  const isFillingForm = ref(false)

  // Initial form state
  const getInitialState = (): QuestionFormState => ({
    questionBankId: questionBankId || '',
    topicId: topicId || '',
    titleEn: '',
    titleAr: '',
    questionType: null,
    difficulty: null,
    isActive: true,
    explanation: '',
    choices: [],
    orderingItems: [],
    matchingLeftItems: [],
    matchingRightItems: [],
    textAnswerPatterns: [],
  })

  // Create validator with rules
  const validator = new Validator<QuestionFormState>(
    getInitialState(),
    {
      topicId: {
        required: createValidator(t, 'topic', 'required'),
      },
      titleEn: {
        required: createValidator(t, 'title-en', 'required'),
        maxLength: createValidator(t, 'title-en', 'maxLength', 500),
      },
      titleAr: {
        required: createValidator(t, 'title-ar', 'required'),
        maxLength: createValidator(t, 'title-ar', 'maxLength', 500),
      },
      questionType: {
        required: createValidator(t, 'question-type', 'required'),
      },
      difficulty: {
        required: createValidator(t, 'difficulty', 'required'),
      },
    }
  )

  // Cast validation to our typed FormBody for better type safety
  const body = validator.validation as unknown as Ref<FormBody>

  // Question type options
  const questionTypeOptions = computed(() => [
    { value: QuestionType.SingleChoice, label: t('single-choice') },
    { value: QuestionType.MultipleChoice, label: t('multiple-choice') },
    { value: QuestionType.TrueFalse, label: t('true-false') },
    { value: QuestionType.Ordering, label: t('ordering') },
    { value: QuestionType.Matching, label: t('matching') },
    { value: QuestionType.ShortAnswer, label: t('short-answer') },
    { value: QuestionType.FillInBlank, label: t('fill-in-blank') },
  ])

  // Difficulty options
  const difficultyOptions = computed(() => [
    { value: Difficulty.Easy, label: t('easy') },
    { value: Difficulty.Medium, label: t('medium') },
    { value: Difficulty.Hard, label: t('hard') },
  ])

  // Check if current question type requires choices
  const requiresChoices = computed(() => {
    const type = body.value.questionType.$model
    return (
      type === QuestionType.SingleChoice ||
      type === QuestionType.MultipleChoice ||
      type === QuestionType.TrueFalse
    )
  })

  // Check if current question type requires ordering items
  const requiresOrdering = computed(() => {
    return body.value.questionType.$model === QuestionType.Ordering
  })

  // Check if current question type requires matching items
  const requiresMatching = computed(() => {
    return body.value.questionType.$model === QuestionType.Matching
  })

  // Check if current question type requires text answer patterns
  const requiresTextAnswer = computed(() => {
    const type = body.value.questionType.$model
    return type === QuestionType.ShortAnswer || type === QuestionType.FillInBlank
  })

  // Choices management
  const addChoice = () => {
    body.value.choices.$model.push({
      text: '',
      isCorrect: false,
    })
  }

  const removeChoice = (index: number) => {
    body.value.choices.$model.splice(index, 1)
  }

  const setCorrectChoice = (index: number, isSingleChoice: boolean = true) => {
    if (isSingleChoice) {
      body.value.choices.$model.forEach((choice, i) => {
        choice.isCorrect = i === index
      })
    } else {
      body.value.choices.$model[index].isCorrect = !body.value.choices.$model[index].isCorrect
    }
  }

  // Initialize true/false choices
  const initTrueFalseChoices = () => {
    body.value.choices.$model = [
      { text: t('true'), isCorrect: true },
      { text: t('false'), isCorrect: false },
    ]
  }

  // Ordering items management
  const addOrderingItem = () => {
    const currentLength = body.value.orderingItems.$model.length
    body.value.orderingItems.$model.push({
      text: '',
      correctOrderIndex: currentLength + 1,
    })
  }

  const removeOrderingItem = (index: number) => {
    body.value.orderingItems.$model.splice(index, 1)
    // Reindex the remaining items
    body.value.orderingItems.$model.forEach((item, i) => {
      item.correctOrderIndex = i + 1
    })
  }

  const updateOrderingIndex = (index: number, newOrder: number) => {
    body.value.orderingItems.$model[index].correctOrderIndex = newOrder
  }

  // Matching items management
  const generateMatchingRightItemId = () => {
    return crypto.randomUUID()
  }

  const addMatchingPair = () => {
    const rightItemId = generateMatchingRightItemId()
    const currentLength = body.value.matchingLeftItems.$model.length

    body.value.matchingRightItems.$model.push({
      id: rightItemId,
      text: '',
    })

    body.value.matchingLeftItems.$model.push({
      text: '',
      correctRightItemId: rightItemId,
      order: currentLength + 1,
    })
  }

  const removeMatchingPair = (index: number) => {
    const leftItem = body.value.matchingLeftItems.$model[index]
    const rightItemIndex = body.value.matchingRightItems.$model.findIndex(
      (item) => item.id === leftItem.correctRightItemId
    )

    body.value.matchingLeftItems.$model.splice(index, 1)
    if (rightItemIndex !== -1) {
      body.value.matchingRightItems.$model.splice(rightItemIndex, 1)
    }

    // Reindex the remaining items
    body.value.matchingLeftItems.$model.forEach((item, i) => {
      item.order = i + 1
    })
  }

  const addExtraRightItem = () => {
    body.value.matchingRightItems.$model.push({
      id: generateMatchingRightItemId(),
      text: '',
    })
  }

  const removeRightItem = (index: number) => {
    const rightItem = body.value.matchingRightItems.$model[index]
    // Remove any left items that reference this right item
    body.value.matchingLeftItems.$model = body.value.matchingLeftItems.$model.filter(
      (item) => item.correctRightItemId !== rightItem.id
    )
    body.value.matchingRightItems.$model.splice(index, 1)
  }

  // Text answer patterns management
  const addTextAnswerPattern = () => {
    body.value.textAnswerPatterns.$model.push({
      pattern: '',
    })
  }

  const removeTextAnswerPattern = (index: number) => {
    body.value.textAnswerPatterns.$model.splice(index, 1)
  }

  // Validate type-specific fields
  const validateTypeSpecificFields = (): string[] => {
    const errors: string[] = []
    const type = body.value.questionType.$model

    if (requiresChoices.value) {
      if (body.value.choices.$model.length < 2) {
        errors.push(t('validation.min-choices', { min: 2 }))
      }
      
      const hasCorrectAnswer = body.value.choices.$model.some((c) => c.isCorrect)
      if (!hasCorrectAnswer) {
        errors.push(t('validation.require-correct-answer'))
      }

      const emptyChoices = body.value.choices.$model.some((c) => !c.text.trim())
      if (emptyChoices) {
        errors.push(t('validation.choice-text-required'))
      }

      // For single choice, only one correct answer
      if (type === QuestionType.SingleChoice || type === QuestionType.TrueFalse) {
        const correctCount = body.value.choices.$model.filter((c) => c.isCorrect).length
        if (correctCount > 1) {
          errors.push(t('validation.single-correct-only'))
        }
      }

      // For multiple choice, at least one correct answer
      if (type === QuestionType.MultipleChoice) {
        const correctCount = body.value.choices.$model.filter((c) => c.isCorrect).length
        if (correctCount < 1) {
          errors.push(t('validation.require-correct-answer'))
        }
      }
    }

    if (requiresOrdering.value) {
      if (body.value.orderingItems.$model.length < 2) {
        errors.push(t('validation.min-ordering-items', { min: 2 }))
      }

      const emptyItems = body.value.orderingItems.$model.some((i) => !i.text.trim())
      if (emptyItems) {
        errors.push(t('validation.ordering-text-required'))
      }

      // Check for valid order indices
      const invalidIndices = body.value.orderingItems.$model.some(
        (i) => i.correctOrderIndex < 1
      )
      if (invalidIndices) {
        errors.push(t('validation.ordering-index-positive'))
      }
    }

    if (requiresMatching.value) {
      if (body.value.matchingLeftItems.$model.length < 2) {
        errors.push(t('validation.min-matching-items', { min: 2 }))
      }

      if (body.value.matchingRightItems.$model.length < 2) {
        errors.push(t('validation.min-matching-right-items', { min: 2 }))
      }

      const emptyLeftItems = body.value.matchingLeftItems.$model.some((i) => !i.text.trim())
      const emptyRightItems = body.value.matchingRightItems.$model.some((i) => !i.text.trim())
      if (emptyLeftItems || emptyRightItems) {
        errors.push(t('validation.matching-text-required'))
      }

      // Check that all left items have valid right item references
      const invalidReferences = body.value.matchingLeftItems.$model.some(
        (left) =>
          !body.value.matchingRightItems.$model.find(
            (right) => right.id === left.correctRightItemId
          )
      )
      if (invalidReferences) {
        errors.push(t('validation.matching-invalid-reference'))
      }
    }

    if (requiresTextAnswer.value) {
      if (body.value.textAnswerPatterns.$model.length < 1) {
        errors.push(t('validation.min-text-patterns', { min: 1 }))
      }

      const emptyPatterns = body.value.textAnswerPatterns.$model.some((p) => !p.pattern.trim())
      if (emptyPatterns) {
        errors.push(t('validation.pattern-required'))
      }
    }

    return errors
  }

  // Full validation
  const validate = async (): Promise<{ isValid: boolean; errors: string[] }> => {
    const isBodyValid = await body.value.$validate()
    const typeErrors = validateTypeSpecificFields()

    return {
      isValid: isBodyValid && typeErrors.length === 0,
      errors: [
        ...body.value.$errors.map((e) => e.$message as string),
        ...typeErrors,
      ],
    }
  }

  // Extract form data for API submission
  const extractFormData = (): QuestionRequest => {
    const formData = validator.extractBody()
    const type = formData.questionType

    const request: QuestionRequest = {
      questionBankId: formData.questionBankId,
      topicId: formData.topicId,
      titleEn: formData.titleEn,
      titleAr: formData.titleAr,
      questionType: questionTypeToString(type!),
      difficulty: difficultyToString(formData.difficulty!),
      isActive: formData.isActive,
      explanation: formData.explanation || undefined,
    }

    // Only include type-specific data
    if (
      type === QuestionType.SingleChoice ||
      type === QuestionType.MultipleChoice ||
      type === QuestionType.TrueFalse
    ) {
      request.choices = formData.choices
    }

    if (type === QuestionType.Ordering) {
      request.orderingItems = formData.orderingItems
    }

    if (type === QuestionType.Matching) {
      request.matchingLeftItems = formData.matchingLeftItems
      request.matchingRightItems = formData.matchingRightItems
    }

    if (type === QuestionType.ShortAnswer || type === QuestionType.FillInBlank) {
      request.textAnswerPatterns = formData.textAnswerPatterns
    }

    return request
  }

  // Reset form
  const resetForm = async () => {
    await validator.resetBody()
    body.value.questionBankId.$model = questionBankId || ''
    body.value.topicId.$model = topicId || ''
    body.value.choices.$model = []
    body.value.orderingItems.$model = []
    body.value.matchingLeftItems.$model = []
    body.value.matchingRightItems.$model = []
    body.value.textAnswerPatterns.$model = []
  }

  // Fill form with existing data
  const fillForm = (data: QuestionRequest) => {
    // Set flag to prevent watcher from clearing data
    isFillingForm.value = true
    
    body.value.questionBankId.$model = data.questionBankId
    body.value.topicId.$model = data.topicId
    body.value.titleEn.$model = data.titleEn
    body.value.titleAr.$model = data.titleAr
    
    // Handle questionType - can be string or number from API
    if (typeof data.questionType === 'string') {
      body.value.questionType.$model = questionTypeFromString(data.questionType)
    } else {
      body.value.questionType.$model = Number(data.questionType) as QuestionType
    }
    
    // Handle difficulty - can be string or number from API
    if (typeof data.difficulty === 'string') {
      body.value.difficulty.$model = difficultyFromString(data.difficulty)
    } else {
      body.value.difficulty.$model = Number(data.difficulty) as Difficulty
    }
    
    body.value.isActive.$model = data.isActive
    body.value.explanation.$model = data.explanation || ''

    // Map choices - remove id and questionId fields from DTOs
    if (data.choices) {
      body.value.choices.$model = data.choices.map((choice: QuestionChoice) => ({
        text: choice.text,
        isCorrect: choice.isCorrect,
      }))
    }

    // Map ordering items - remove id and questionId fields from DTOs
    if (data.orderingItems) {
      body.value.orderingItems.$model = data.orderingItems.map((item: QuestionOrderingItem) => ({
        text: item.text,
        correctOrderIndex: item.correctOrderIndex,
      }))
    }

    // Map matching left items - remove id and questionId fields from DTOs
    if (data.matchingLeftItems) {
      body.value.matchingLeftItems.$model = data.matchingLeftItems.map((item: MatchingLeftItem) => ({
        text: item.text,
        correctRightItemId: item.correctRightItemId,
        order: item.order,
      }))
    }

    // Map matching right items - keep id but remove questionId from DTOs
    if (data.matchingRightItems) {
      body.value.matchingRightItems.$model = data.matchingRightItems.map((item: MatchingRightItem) => ({
        id: item.id || '',
        text: item.text,
      }))
    }

    // Map text answer patterns - remove id and questionId fields from DTOs
    if (data.textAnswerPatterns) {
      body.value.textAnswerPatterns.$model = data.textAnswerPatterns.map((pattern: QuestionTextAnswerPattern) => ({
        id: pattern.id || '',
        pattern: pattern.pattern,
      }))
    }

    // Reset flag after filling is complete
    nextTick(() => {
      isFillingForm.value = false
    })
  }

  // Watch question type changes to initialize default data
  watch(
    () => body.value.questionType.$model,
    (newType, oldType) => {
      if (newType === oldType) return
      
      // Don't clear data when we're filling the form with existing data
      if (isFillingForm.value) return

      // Clear all type-specific data when type changes
      body.value.choices.$model = []
      body.value.orderingItems.$model = []
      body.value.matchingLeftItems.$model = []
      body.value.matchingRightItems.$model = []
      body.value.textAnswerPatterns.$model = []

      // Initialize defaults based on new type
      if (newType === QuestionType.TrueFalse) {
        initTrueFalseChoices()
      } else if (
        newType === QuestionType.SingleChoice ||
        newType === QuestionType.MultipleChoice
      ) {
        // Add 4 default empty choices
        for (let i = 0; i < 4; i++) {
          addChoice()
        }
      } else if (newType === QuestionType.Ordering) {
        // Add 3 default ordering items
        for (let i = 0; i < 3; i++) {   
          addOrderingItem()
        }
      } else if (newType === QuestionType.Matching) {
        // Add 3 default matching pairs
        for (let i = 0; i < 3; i++) {
          addMatchingPair()
        }
      } else if (
        newType === QuestionType.ShortAnswer ||
        newType === QuestionType.FillInBlank
      ) {
        // Add one default text answer pattern
        addTextAnswerPattern()
      }
    }
  )

  return {
    body,
    validator,
    questionTypeOptions,
    difficultyOptions,
    requiresChoices,
    requiresOrdering,
    requiresMatching,
    requiresTextAnswer,
    addChoice,
    removeChoice,
    setCorrectChoice,
    initTrueFalseChoices,
    addOrderingItem,
    removeOrderingItem,
    updateOrderingIndex,
    addMatchingPair,
    removeMatchingPair,
    addExtraRightItem,
    removeRightItem,
    addTextAnswerPattern,
    removeTextAnswerPattern,
    validate,
    extractFormData,
    resetForm,
    fillForm,
    QuestionType,
    Difficulty,
  }
}

