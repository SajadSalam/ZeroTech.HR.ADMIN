import type { TableHeader } from '~/components/app-table/types'
import type { SubjectDto } from './types'

export const tableHeader = (t: (key: string) => string) => {
  return [
    {
      key: 'name',
      label: t('subject-name'),
    },

    {
      key: 'code',
      label: t('subject_code'),
    },
    {
      key: 'englishName',
      label: t('subject_english_name'),
    },

    {
      key: 'actions',
      label: t('actions'),
    },
  ]
}
export const fakeData: SubjectDto[] = [
  {
    id: '1',
    name: 'Physics',
    Code: '123',
    englishName: 'Physics',
    deleted: false,
    creationDate: '',
  },
  {
    id: '2',
    name: 'Mathematics',
    Code: '456',
    englishName: 'Mathematics',
    deleted: false,
    creationDate: '',
  },
  {
    id: '3',
    name: 'Chemistry',
    Code: '789',
    englishName: 'Chemistry',
    deleted: false,
    creationDate: '  ',
  },
  {
    id: '4',
    name: 'Biology',
    Code: '101',
    englishName: 'Biology',
    deleted: false,
    creationDate: '',
  },
]
