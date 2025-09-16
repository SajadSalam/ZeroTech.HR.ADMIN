import type { TableHeader } from '~/components/app-table/types'

export const tableHeader = (t: (key: string) => string) => {
  return [
    {
      key: 'studentFullName',
      label: t('student-name'),
      icon: 'lucide:user',
    },
    {
      key: 'university',
      label: t('university'),
      icon: 'lucide:university',
    },
    {
      key: 'subjects',
      label: t('subject'),
      icon: 'lucide:book',
    },
    // {
    //     key: 'status',
    //     label: t('status'),
    // },
    {
      key: 'totalGrades',
      label: t('grade'),
      icon: 'lucide:check',
    },
    {
      key: 'questionsCount',
      label: t('no-of-questions'),
      icon: 'lucide:book',
    },
    {
      key: 'creationDate',
      label: t('date'),
      icon: 'lucide:calendar',
    },
    {
      key: 'actions',
      label: t('actions'),
      icon: 'lucide:more-vertical',
    },
  ]
}
