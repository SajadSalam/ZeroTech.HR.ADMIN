import type { TableHeader } from '~/components/app-table/types'
import type { Exam } from './types'

export const tableHeaders = (t: (key: string) => string) => {
  return [
    {
      key: 'title',
      label: t('title'),
      icon: 'lucide:file-text',
    },
    {
      key: 'examType',
      label: t('type'),
      icon: 'lucide:file-text',
    },
    {
      key: 'orgnaizations',
      label: t('departments'),
      icon: 'lucide:align-horizontal-distribute-center',
    },
    {
      key: 'templateName',
      label: t('blueprint'),
      icon: 'lucide:file-search',
    },
    {
      key: 'startDate',
      label: t('start-date'),
      icon: 'lucide:calendar',
    },
    {
      key: 'endDate',
      label: t('end-date'),
      icon: 'lucide:calendar',
    },

    {
      key: 'time',
      label: t('time'),
      icon: 'lucide:clock',
    },
    {
      key: 'actions',
      label: t('actions'),
      icon: 'lucide:more-vertical',
    },
  ]
}
