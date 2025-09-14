export const tableHeader = (t: (key: string) => string) => {
  return [
    {
      key: 'externalStudentName',
      label: t('student-name'),
      icon: 'ph:user-duotone',
    },
    {
      key: 'externalStudentNationalId',
      label: t('national-id'),
      icon: 'lucide:id-card',
    },
    {
      key: 'examCenterName',
      label: t('exam-center'),
      icon: 'ph:building-duotone',
    },
    {
      key: 'hallName',
      label: t('hall'),
      icon: 'ph:map-pin-duotone',
    },
    {
      key: 'reason',
      label: t('blacklist-reason'),
      icon: 'ph:file-text-duotone',
    },
    {
      key: 'blacklistedAt',
      label: t('blacklisted-date'),
      icon: 'ph:calendar-duotone',
    },
    {
      key: 'isUnblacklisted',
      label: t('status'),
      icon: 'ph:check-circle-duotone',
    },
    {
      key: 'actions',
      label: t('actions'),
      icon: 'ph:dots-three-vertical-duotone',
    },
  ]
}