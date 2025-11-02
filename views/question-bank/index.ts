import type { TableHeader } from '@/components/app-table/types'
import {
    AuditStatus,
    Difficulty,
    KnowledgeLevel,
    QuestionType,
    type Question,
} from '~/views/question-bank/types/question'

export const tableHeader = (t: (key: string) => string) => {
  return [
    {
      key: 'id',
      label: '#',
    },
    {
      key: 'title',
      label: t('title'),
      icon: 'lucide:file-text',
    },
    {
      key: 'subject.name',
      label: t('subject'),
      icon: 'lucide:book',
    },
    {
      key: 'questionBankTopics.length',
      label: t('topics'),
      icon: 'lucide:bookmark',
    },
    {
      key: 'totalQuestionCount',
      label: t('question-count'),
      icon: 'lucide:activity',
    },
    {
      key: 'categories',
      label: t('categories'),
      icon: 'lucide:tag',
    },
    {
      key: 'creationPeriod',
      label: t('creation-period'),
      icon: 'lucide:calendar',
    },

    {
      key: 'auditor',
      label: t('auditor'),
      icon: 'lucide:user',
    },
    {
      key: 'creator',
      label: t('creator'),
      icon: 'lucide:user',
    },
    {
      key: 'actions',
      label: t('actions'),
      icon: 'lucide:more-vertical',
    },
  ]
}
export const questionsTableHeaders = (t: (key: string) => string) => {
  return [
    { label: '#', key: 'index',icon: '' },
    { label: t('type'), key: 'type',icon: 'lucide:file-text' },
    { label: t('title'), key: 'title',icon: 'lucide:file-text' },
    { label: t('difficulty'), key: 'difficulty',icon: 'lucide:align-center-vertical' },
    { label: t('knowledge'), key: 'knowledgeLevelId',icon: 'lucide:book' },
    { label: t('creator'), key: 'creatorFullName',icon: 'lucide:user' },
    { label: t('auditor'), key: 'auditorFullName',icon: 'lucide:user' },
    { label: t('audit-date'), key: 'auditDate',icon: 'lucide:calendar' },
    { label: t('audit-status'), key: 'auditStatus',icon: 'lucide:check-circle' },
    { label: t('question-bank'), key: 'questionBankName',icon: 'lucide:file-text' },
    { label: t('actions'), key: 'actions',icon: 'lucide:more-vertical' },
  ] as TableHeader[]
}


export const difficultyOptions = (t: (key: string) => string) => {
  return [
    {
      label: t('easy'),
      value: Difficulty.Easy,
    },
    {
      label: t('medium'),
      value: Difficulty.Medium,
    },
    {
      label: t('hard'),
      value: Difficulty.Hard,
    },
  ]
}
export const knowledgeLevelOptions = (t: (key: string) => string) => {
  return [
    {
      label: t('remember'),
      value: KnowledgeLevel.Remember,
    },
    {
      label: t('understand'),
      value: KnowledgeLevel.Understand,
    },
    {
      label: t('apply'),
      value: KnowledgeLevel.Apply,
    },
    {
      label: t('analyze'),
      value: KnowledgeLevel.Analyze,
    },
    {
      label: t('evaluate'),
      value: KnowledgeLevel.Evaluate,
    },
    {
      label: t('create'),
      value: KnowledgeLevel.Create,
    },
  ]
}
export const questionsFakeData: Question[] = [
  // Multiple Choice Question
  {
    id: '1',
    title: 'What is the capital of France?',
    alternateTitle: 'French Capital Question',
    isAlternateTitleShown: false,
    image: null,
    order: 1,
    type: QuestionType.MultipleChoice,
    options: [
      { title: 'Paris', image: null, order: 1, isCorrect: true },
      { title: 'Berlin', image: null, order: 2, isCorrect: false },
      { title: 'Madrid', image: null, order: 3, isCorrect: false },
    ],
    correctBoolean: false,
    correctText: 'Paris',
    knowledgeLevelId: '1',
    difficulty: Difficulty.Easy,
    createdBy: 'Admin',
    creationDate: '2025-02-25',
    auditBy: 'Reviewer',
    auditDate: '2025-02-26',
    auditStatus: AuditStatus.Pending,
    isContentShown: true,
    topicId: '1',
  },

  // Fill in the Blank Question
  {
    id: '2',
    title: 'The chemical symbol for water is ___.',
    alternateTitle: '',
    isAlternateTitleShown: false,
    image: null,
    order: 2,
    type: QuestionType.Blank,
    options: [],
    correctBoolean: false,
    correctText: 'H2O',
    knowledgeLevelId: '1',
    difficulty: Difficulty.Easy,
    createdBy: 'Admin',
    creationDate: '2025-02-25',
    auditBy: 'Reviewer',
    auditDate: '2025-02-26',
    auditStatus: AuditStatus.Rejected,
    isContentShown: true,
    topicId: '1',
  },

  // DropDown Question
  {
    title: 'Select the correct answer: The sun rises in the ___.',
    image: null,
    order: 3,
    type: QuestionType.DropDown,
    options: [
      { title: 'East', image: null, order: 1, isCorrect: true },
      { title: 'West', image: null, order: 2, isCorrect: false },
    ],
    correctBoolean: false,
    correctText: 'East',
    knowledgeLevelId: '1',
    difficulty: Difficulty.Easy,
    createdBy: 'Admin',
    creationDate: '2025-02-25',
    auditBy: 'Reviewer',
    auditDate: '2025-02-26',
    auditStatus: AuditStatus.Approved,
    isContentShown: true,
    topicId: '1',
  },

  // Article Question
  {
    title: 'Write an essay on climate change.',
    image: null,
    order: 4,
    type: QuestionType.Article,
    options: [],
    correctBoolean: false,
    correctText: '',
    knowledgeLevelId: '5',
    difficulty: Difficulty.Hard,
    createdBy: 'Admin',
    creationDate: '2025-02-25',
    auditBy: 'Reviewer',
    auditDate: '2025-02-26',
    auditStatus: AuditStatus.Approved,
    isContentShown: true,
    topicId: '1',
  },

  // True or False Question
  {
    title: 'The Earth is flat.',
    image: null,
    order: 5,
    type: QuestionType.TrueOrFalse,
    options: [],
    correctBoolean: false,
    correctText: 'False',
    knowledgeLevelId: '1',
    difficulty: Difficulty.Easy,
    createdBy: 'Admin',
    creationDate: '2025-02-25',
    auditBy: 'Reviewer',
    auditDate: '2025-02-26',
    auditStatus: AuditStatus.Rejected,
    isContentShown: true,
    topicId: '1',
  },

  // Radio Choice Question
  {
    title: 'Which planet is known as the Red Planet?',
    image: null,
    order: 6,
    type: QuestionType.Radio,
    options: [
      { title: 'Mars', image: null, order: 1, isCorrect: true },
      { title: 'Venus', image: null, order: 2, isCorrect: false },
      { title: 'Jupiter', image: null, order: 3, isCorrect: false },
    ],
    correctBoolean: false,
    correctText: 'Mars',
    knowledgeLevelId: '1',
    difficulty: Difficulty.Easy,
    createdBy: 'Admin',
    creationDate: '2025-02-25',
    auditBy: 'Reviewer',
    auditDate: '2025-02-26',
    auditStatus: AuditStatus.Approved,
    isContentShown: true,
    topicId: '1',
  },

  // Matching Question
  {
    title: 'Match the countries to their capitals:',
    image: null,
    order: 7,
    type: QuestionType.Matching,
    options: [],
    correctBoolean: false,
    correctText: '',
    knowledgeLevelId: '2',
    difficulty: Difficulty.Medium,
    matchingPairs: [
      { left: 'France', right: 'Paris' },
      { left: 'Germany', right: 'Berlin' },
      { left: 'Spain', right: 'Madrid' },
    ],
    createdBy: 'Admin',
    creationDate: '2025-02-25',
    auditBy: 'Reviewer',
    auditDate: '2025-02-26',
    auditStatus: AuditStatus.Approved,
    isContentShown: true,
    topicId: '1',
  },

  // Reorder Question
  {
    title: 'Arrange the planets in order from the Sun:',
    image: null,
    order: 8,
    type: QuestionType.Reorder,
    options: [],
    correctBoolean: false,
    correctText: '',
    knowledgeLevelId: '3',
    difficulty: Difficulty.Medium,
    orderItems: [
      { title: 'Mercury', order: 1 },
      { title: 'Venus', order: 2 },
      { title: 'Earth', order: 3 },
      { title: 'Mars', order: 4 },
    ],
    createdBy: 'Admin',
    creationDate: '2025-02-25',
    auditBy: 'Reviewer',
    auditDate: '2025-02-26',
    auditStatus: AuditStatus.Approved,
    isContentShown: true,
    topicId: '1',
  },

  // Dialogue Question
  {
    id: '9',
    title: 'Physics Lab Dialogue: Understanding Motion',
    alternateTitle: 'Lab Conversation About Physics - Alternative Format',
    isAlternateTitleShown: true,
    image: null,
    order: 9,
    type: QuestionType.Dialogue,
    options: [],
    correctBoolean: false,
    correctText: '',
    knowledgeLevelId: '4',
    knowledgeLevelSimplifiedIntId: 4,
    difficulty: Difficulty.Hard,
    createdBy: 'Admin',
    creationDate: '2025-02-25',
    auditBy: 'Reviewer',
    auditDate: '2025-02-26',
    auditStatus: AuditStatus.Approved,
    isContentShown: true,
    topicId: '1',
    subQuestions: [
      {
        id: '9-1',
        title: 'What is the acceleration due to gravity on Earth?',
        alternateTitle: 'Earth Gravity Question',
        isAlternateTitleShown: false,
        image: null,
        order: 1,
        type: QuestionType.MultipleChoice,
        options: [
          { id: '9-1-1', title: '9.8 m/s²', alternateTitle: '', isAlternateTitleShown: false, image: null, order: 1, isCorrect: true },
          { id: '9-1-2', title: '10.8 m/s²', alternateTitle: '', isAlternateTitleShown: false, image: null, order: 2, isCorrect: false },
          { id: '9-1-3', title: '8.8 m/s²', alternateTitle: '', isAlternateTitleShown: false, image: null, order: 3, isCorrect: false },
        ],
        correctBoolean: false,
        correctText: '',
        knowledgeLevelId: '1',
        knowledgeLevelSimplifiedIntId: 1,
        difficulty: Difficulty.Easy,
        topicId: '1',
        parentQuestionId: '9',
      },
      {
        id: '9-2',
        title: 'Explain the difference between velocity and acceleration.',
        alternateTitle: '',
        isAlternateTitleShown: false,
        image: null,
        order: 2,
        type: QuestionType.Article,
        options: [],
        correctBoolean: false,
        correctText: 'Velocity is the rate of change of displacement, while acceleration is the rate of change of velocity.',
        knowledgeLevelId: '2',
        knowledgeLevelSimplifiedIntId: 2,
        difficulty: Difficulty.Medium,
        topicId: '1',
        parentQuestionId: '9',
      },
      {
        id: '9-3',
        title: 'Is acceleration always in the same direction as velocity?',
        alternateTitle: '',
        isAlternateTitleShown: false,
        image: null,
        order: 3,
        type: QuestionType.TrueOrFalse,
        options: [],
        correctBoolean: false,
        correctText: '',
        knowledgeLevelId: '3',
        knowledgeLevelSimplifiedIntId: 3,
        difficulty: Difficulty.Medium,
        topicId: '1',
        parentQuestionId: '9',
      },
    ],
  },
]
