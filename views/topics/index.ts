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
      key: 'actions',
      label: t('actions'),
      icon: 'lucide:more-vertical',
    },  
  ]
}