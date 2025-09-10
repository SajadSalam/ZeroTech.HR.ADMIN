export const tableHeader = (t: (key: string) => string) => {
  return [
    {
      key: 'name',
      label: t('category_name'),
    },

    {
      key: 'actions',
      label: t('actions'),
    },
  ]
}
