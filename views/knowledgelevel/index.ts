export const tableHeader = (t: (key: string) => string) => {
  return [
    {
      key: 'name',
      label: t('knowledgelevel'),
    },
    {
      key: 'actions',
      label: t('actions'),
    },
  ]
}
