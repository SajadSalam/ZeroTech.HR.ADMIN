import type { TableHeader } from '@/components/app-table/types'
import {
    AuditStatus,
    Difficulty,
    KnowledgeLevel,
    QuestionType,
    type Question,
} from '~/views/question-bank/types/question'
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
