export const tableHeader = (t: (key: string) => string) => {
  return [
    {
      key: 'name',
      label: t('name'),
    },
    {
      key: 'examCenter.name',
      label: t('exam-center'),
    },
    {
      key: 'capacity',
      label: t('capacity'),
    },
    {
      key: 'actions',
      label: t('actions'),
    },
  ]
}