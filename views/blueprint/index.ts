import type { TableHeader } from '~/components/app-table/types'

export const tableHeaders = (t: (key: string) => string) => {
  return [
    {
      key: 'title',
      label: t('title'),
      icon: 'lucide:file-text',
    },
    {
      key: 'questionBankNames',
      label: t('question-banks'),
      icon: 'lucide:library',
    },
    {
      key: 'topicNames',
      label: t('topics'),
      icon: 'lucide:tags',
    },
    {
      key: 'randomizeAnswer',
      label: t('randomize-answers'),
      icon: 'lucide:shuffle',
    },
    {
      key: 'randomizeChoices',
      label: t('randomize-choices'),
      icon: 'lucide:shuffle',
    },
    {
      key: 'displayResult',
      label: t('display-result'),
      icon: 'lucide:check-circle',
    },
    {
      key: 'moveBetweenQuestion',
      label: t('move-between-questions'),
      icon: 'lucide:move',
    },
    {
      key: 'successGrade',
      label: t('success-grade'),
      icon: 'lucide:check',
    },
    {
      key: 'fullGrade',
      label: t('full-grade'),
      icon: 'lucide:scale',
    },
    {
      key: 'totalQuestionsGrade',
      label: t('total-questions-grade'),
      icon: 'lucide:list',
    },
    {
      key: 'actions',
      label: t('actions'),
      icon: 'lucide:more-vertical',
    },
  ]
}

export const tableDetailHeaders = (t: (key: string) => string) => {
  return [
    {
      key: 'topicId',
      label: t('topics'),
    },
    {
      key: 'questionType',
      label: t('question-type'),
    },
    {
      key: 'difficulty',
      label: t('difficulty'),
    },  
    {
      key: 'numberOfQuestions',
      label: t('number-of-questions'),
    },
    {
      key: 'grade',
      label: t('grade-per-question'),
    },
  ]
}