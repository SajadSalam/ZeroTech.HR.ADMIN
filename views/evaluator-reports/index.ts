export const tableHeader = (t: (key: string) => string) => {
  return [
    {
      key: 'id',
      label: t('id'),
    },
    {
      key: 'fullName',
      label: t('full-name'),
    },
    {
      key: 'examName',
      label: t('exam-name'),
    },
    {
      key: 'nationalId',
      label: t('national-id'),
    },
    {
      key: 'email',
      label: t('email'),
    },
    {
      key: 'phoneNumber',
      label: t('phone-number'),
    },
    {
      key: 'gender',
      label: t('gender'),
    },
    {
      key: 'type',
      label: t('type'),
    },
    {
      key: 'colleage',
      label: t('colleage'),
    },
    {
      key: 'department',
      label: t('department'),
    },
    {
      key: 'stage',
      label: t('stage'),
    },
    {
      key: 'grade',
      label: t('grade'),
    },
    {
      key: 'status',
      label: t('status'),
    },
  ]
}
