export const tableHeader = (t: (key: string) => string) => {
  return [
    {
      key: 'name',
      label: t('category_name'),
      icon: 'lucide:file-text',
    },

    {
      key: 'actions',
      label: t('actions'),
      icon: 'lucide:more-vertical',
    },
  ]
}
