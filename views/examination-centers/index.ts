import type { ExaminationCenterDto } from './types'
export const tableHeader = (t: (key: string) => string) => {
  return [
    {
      key: 'collegeName',
      label: t('college-name'),
    },
    {
      key: 'name',
      label: t('name'),
    },
    {
      key: 'governorate.arabicName',
      label: t('governorate'),
    },
    {
      key: 'maxCapacity',
      label: t('max-capacity'),
    },
    {
      key: 'managerName',
      label: t('exam-center-manager'),
    },
    {
      key: 'surrogateManagerName',
      label: t('surrogate-manager'),
    },
    {
      key: 'isActive',
      label: t('is-active'),
    },
    {
      key: 'creationDate',
      label: t('creation-date'),
    },
    {
      key: 'actions',
      label: t('actions'),
    },
  ]
}
