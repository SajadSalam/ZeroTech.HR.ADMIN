import type { TableHeader } from '@/components/app-table/types'
import {
    AuditStatus,
    Difficulty,
    KnowledgeLevel,
    QuestionType,
    type Question,
} from '~/views/question-bank/types/question'
import { fakeData as subjects } from '../subjects'
import { fakeData as topics } from '../topics'
import type { QuestionBankDto } from './types'

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

// Mock QuestionBank data
export const fakeData: QuestionBankDto[] = [
  {
    title: 'Physics Core Topics',
    id: '1',
    creationDate: '2025-02-20',
    deleted: false,
    subject: subjects[0], // Physics
    questionBankTopics: [topics[0], topics[1], topics[2]], // Topics: Mechanics, Thermodynamics, Optics
  },
  {
    title: 'Advanced Physics - Quantum Mechanics',
    id: '2',
    creationDate: '2025-02-20',
    deleted: false,
    subject: subjects[0], // Physics
    questionBankTopics: [topics[3]], // Topic: Quantum Mechanics
  },
  {
    title: 'Mathematics Algebra',
    id: '3',
    creationDate: '2025-02-20',
    deleted: false,
    subject: subjects[1], // Mathematics
    questionBankTopics: [topics[5]], // Topic: Algebra
  },
  {
    title: 'Geometry and Trigonometry',
    id: '4',
    creationDate: '2025-02-20',
    deleted: false,
    subject: subjects[1], // Mathematics
    questionBankTopics: [topics[6], topics[7]], // Topics: Geometry, Trigonometry
  },
  {
    title: 'Organic Chemistry',
    id: '5',
    creationDate: '2025-02-20',
    deleted: false,
    subject: subjects[2], // Chemistry
    questionBankTopics: [topics[9]], // Topic: Organic Chemistry
  },
  {
    title: 'Physical and Inorganic Chemistry',
    id: '6',
    creationDate: '2025-02-20',
    deleted: false,
    subject: subjects[2], // Chemistry
    questionBankTopics: [topics[10], topics[11]], // Topics: Inorganic Chemistry, Physical Chemistry
  },
  {
    title: 'Introduction to Biology',
    id: '7',
    creationDate: '2025-02-20',
    deleted: false,
    subject: subjects[3], // Biology
    questionBankTopics: [topics[13], topics[14]], // Topics: Zoology, Botany
  },
  {
    title: 'Genetics and Ecology',
    id: '8',
    creationDate: '2025-02-20',
    deleted: false,
    subject: subjects[3], // Biology
    questionBankTopics: [topics[15], topics[16]], // Topics: Genetics, Ecology
  },
]

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
    title: 'What is the capital of France?',
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
  },

  // Fill in the Blank Question
  {
    title: 'The chemical symbol for water is ___.',
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
  },
]
