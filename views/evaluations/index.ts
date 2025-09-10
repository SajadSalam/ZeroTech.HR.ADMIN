import type { TableHeader } from '~/components/app-table/types'

export const tableHeader = (t: (key: string) => string) => {
  return [
    {
      key: 'studentFullName',
      label: t('student-name'),
    },
    {
      key: 'university',
      label: t('university'),
    },
    {
      key: 'subjects',
      label: t('subject'),
    },
    // {
    //     key: 'status',
    //     label: t('status'),
    // },
    {
      key: 'totalGrades',
      label: t('grade'),
    },
    {
      key: 'questionsCount',
      label: t('no-of-questions'),
    },
    {
      key: 'creationDate',
      label: t('date'),
    },
    {
      key: 'actions',
      label: t('actions'),
    },
  ]
}
