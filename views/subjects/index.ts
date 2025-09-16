
export const tableHeader = (t: (key: string) => string) => {
  return [
    {
      key: 'name',
      label: t('subject-name'),
      icon: 'lucide:book',
    },

    {
      key: 'code',
      label: t('subject_code'),
      icon: 'lucide:code',
    },
    {
      key: 'englishName',
      label: t('subject_english_name'),
      icon: 'lucide:book',
    },

    {
      key: 'actions',
      label: t('actions'),
      icon: 'lucide:more-vertical',
    },
  ]
}
