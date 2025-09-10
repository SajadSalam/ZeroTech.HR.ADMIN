export const tableHeader = (t: (key: string) => string) => {
  return [
    {
      key: 'name',
      label: t('name'),
    },
    {
      key: 'organizationalStructures',
      label: t('organizations'),
    },
    {
      key: 'actions',
      label: t('actions'),
    },
  ]
}
