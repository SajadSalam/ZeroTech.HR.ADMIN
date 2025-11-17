import type { TableHeader } from '~/components/app-table/types'
import { QuestionType } from '../question-bank/types/question'
import { DegreeDisplayType, type Blueprint } from './types'

export const tableHeaders = (t: (key: string) => string) => {
  return [
    {
      key: 'name',
      label: t('name'),
      icon: 'lucide:file-text',
    },
    {
      key: 'questionBanks',
      label: t('question-banks'),
      icon: 'lucide:file',
    },
    {
      key: 'studyYear',
      label: t('study-year'),
      icon: 'lucide:calendar',
    },
    {
      key: 'randomizeAnswer',
      label: t('randomize-choices'),
      icon: 'lucide:shuffle',
    },
    {
      key: 'displayResult',
      label: t('display-result'),
      icon: 'lucide:check-circle',
    },
    {
      key: 'randomizeChoices',
      label: t('randomize-answers'),
      icon: 'lucide:shuffle',
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
      key: 'halfSuccessGrade',
      label: t('half-success-grade'),
      icon: 'lucide:list-checks',
    },
    {
      key: 'actions',
      label: t('actions'),
      icon: 'lucide:more-vertical',
    },
  ]
}

export const tableCreateHeaders = (t: (key: string) => string) => {
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

export const tableDetailHeaders = (t: (key: string) => string) => {
  return [
    {
      key: 'topicName',
      label: t('topics'),
    },
    {
      key: 'questionType',
      label: t('question-type'),
    },
    {
      key: 'numberOfQuestions',
      label: t('number-of-questions'),
    },
    {
      key: 'grade',
      label: t('grade-per-question'),
    },
    {
      key: 'difficulty',
      label: t('difficulty'),
    },
  ]
}
