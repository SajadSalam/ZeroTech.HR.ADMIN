export const tableHeader = (t: (key: string) => string) => {
  return [
    {
      key: 'name',
      label: t('topic-name'),
      icon: 'lucide:file-text',
    },
    {
      key: 'subjectName',
      label: t('subject-name'),
      icon: 'lucide:book',
    },
    {
      key: 'actions',
      label: t('actions'),
      icon: 'lucide:more-vertical',
    },
  ]
}