export const tableHeaders = (t: (key: string) => string) => {
  return [
    {
      key: 'universityIDNumber',
      label: t('university-id-number'),
    },
    {
      key: 'fullName',
      label: t('name'),
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
      key: 'parentOrganizationalStructureArName',
      label: t('college'),
    },
    {
      key: 'organizationalStructureArName',
      label: t('department'),
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
