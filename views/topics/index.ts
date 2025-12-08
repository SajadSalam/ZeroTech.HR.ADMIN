export const tableHeader = (t: (key: string) => string) => {
  return [
    {
      key: 'titleAr',
      label: t('topic-name'),
      icon: 'lucide:file-text',
    },
    {
      key: 'titleEn',
      label: t('topic-name-en'),
      icon: 'lucide:file-text',
    },
    {
      key: 'subject.titleEn',
      label: t('subject'),
      icon: 'lucide:book',
    },
    {
      key: 'actions',
      label: t('actions'),
      icon: 'lucide:more-vertical',
    },  
  ]
}