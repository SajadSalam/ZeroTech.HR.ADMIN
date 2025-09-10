export const tableHeader = (t: (key: string) => string) => {
  return [
    {
      key: 'userRole',
      label: t('user-role'),
    },
    {
      key: 'date',
      label: t('date'),
    },
    {
      key: 'actionType',
      label: t('action-type'),
    },
    {
      key: 'actions',
      label: t('actions'),
    },
  ]
}
