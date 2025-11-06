
export const tableHeaders = (t: (key: string) => string) => {
  return [
    {
      key: 'title',
      label: t('title'),
      icon: 'lucide:file-text',
    },
    
    {
      key: 'examType',
      label: t('exam-type'),
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
      label: t('time') + ' (24hrs)',
      icon: 'lucide:clock',
    },
    {
      key: 'groups',
      label: t('groups'),
      icon: 'lucide:file-text',
    },
    {
      key: 'actions',
      label: t('actions'),
      icon: 'lucide:more-vertical',
    },
  ]
}
