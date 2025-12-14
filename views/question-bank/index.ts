import type { TableHeader } from '~/components/app-table/types'
import {
    Difficulty,
    QuestionType,
} from '~/views/questions/types'

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
      key: 'subject.titleAr',
      label: t('subject'),
      icon: 'lucide:book',
    },
    {
      key: 'topics.length',
      label: t('topics'),
      icon: 'lucide:bookmark',
    },
    {
      key: 'totalQuestionCount',
      label: t('question-count'),
      icon: 'lucide:activity',
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
      name: "Easy"
    },
    {
      label: t('medium'),
      value: Difficulty.Medium,
      name: "Medium"
    },
    {
      label: t('hard'),
      value: Difficulty.Hard,
      name: "Hard"
    },
  ]
}

export const questionTypeOptions = (t: (key: string) => string) => {
  return [
    {
      label: t('single-choice'),
      value: QuestionType.SingleChoice,
      name: "SingleChoice",
    },
    {
      label: t('multiple-choice'),
      value: QuestionType.MultipleChoice,
      name: "MultipleChoice",
    },
    {
      label: t('true-false'),
      value: QuestionType.TrueFalse,
      name: "True/False",
    },
    {
      label: t('ordering'),
      value: QuestionType.Ordering,
      name: "Ordering",
    },
    {
      label: t('matching'),
      value: QuestionType.Matching,
      name: "Matching",
    },
    {
      label: t('short-answer'),
      value: QuestionType.ShortAnswer,
      name: "ShortAnswer",
    },
    {
      label: t('fill-in-blank'),
      value: QuestionType.FillInBlank,
      name: "FillInBlank",
    },
  ]
}
