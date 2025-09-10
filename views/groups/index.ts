export const tableHeader = (t: (key: string) => string) => {
  return [
    {
      key: 'name',
      label: t('name'),
      icon: 'lucide:file-text',
    },
    {
      key: 'organizationalStructures',
      label: t('organizations'),
      icon: 'lucide:building',
    },
    {
      key: 'actions',
      label: t('actions'),
      icon: 'lucide:more-vertical',
    },
  ]
}
