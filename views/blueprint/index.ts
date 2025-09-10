import type { TableHeader } from '~/components/app-table/types'
import { QuestionType } from '../question-bank/types/question'
import { DegreeDisplayType, type Blueprint } from './types'

export const tableHeaders = (t: (key: string) => string) => {
  return [
    {
      key: 'name',
      label: t('name'),
    },
    {
      key: 'questionBanks',
      label: t('question-banks'),
    },
    {
      key: 'studyYear',
      label: t('study-year'),
    },
    {
      key: 'randomizeAnswer',
      label: t('randomize-choices'),
    },
    {
      key: 'displayResult',
      label: t('display-result'),
    },
    {
      key: 'randomizeChoices',
      label: t('randomize-answers'),
    },
    {
      key: 'moveBetweenQuestion',
      label: t('move-between-questions'),
    },
    {
      key: 'successGrade',
      label: t('success-grade'),
    },
    {
      key: 'halfSuccessGrade',
      label: t('half-success-grade'),
    },
    {
      key: 'actions',
      label: t('actions'),
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
      key: 'numberOfQuestions',
      label: t('number-of-questions'),
    },
    {
      key: 'grade',
      label: t('grade-per-question'),
    },
    {
      key: 'knowledgeLevelId',
      label: t('knowledge'),
    },
    {
      key: 'difficulty',
      label: t('difficulty'),
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
      key: 'knowledgeLevelId',
      label: t('knowledge'),
    },
    {
      key: 'difficulty',
      label: t('difficulty'),
    },
  ]
}
