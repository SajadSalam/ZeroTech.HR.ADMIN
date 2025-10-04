
export const tableHeader = (t: (key: string) => string) => {
  return [
    {
      key: 'fullName',
      label: t('full-name'),
    },
    {
      key: 'birthDate',
      label: t('birth-date'),
    },
    {
      key: 'phoneNumber',
      label: t('phone-number'),
    },
    {
      key: 'email',
      label: t('email'),
    },
    {
      key: 'gender',
      label: t('gender'),
    },
    {
      key: 'university.label',
      label: t('university'),
    },
    {
      key: 'college.label',
      label: t('college'),
    },
    {
      key: 'department.label',
      label: t('department'),
    },
    {
      key: 'createdAt',
      label: t('lunch-date'),
    },
    {
      key: 'isAccepted',
      label: t('isAccepted'),
    },
    {
      key: 'actions',
      label: t('actions'),
    },
  ]
} 