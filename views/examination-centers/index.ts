import type { ExaminationCenterDto } from './types'
export const tableHeader = (t: (key: string) => string) => {
  return [
    {
      key: 'collegeName',
      label: t('university'),
      icon: 'lucide:building-2',
    },
    {
      key: 'name',
      label: t('name'),
      icon: 'lucide:building',
    },
    {
      key: 'governorate.arabicName',
      label: t('governorate'),
      icon: 'lucide:map-pin',
    },
    {
      key: 'maxCapacity',
      label: t('max-capacity'),
      icon: 'lucide:users',
    },
    {
      key: 'managerName',
      label: t('exam-center-manager'),
      icon: 'lucide:user',
    },
    {
      key: 'surrogateManagerName',
      label: t('surrogate-manager'),
      icon: 'lucide:user',
    },
    {
      key: 'isActive',
      label: t('is-active'),
      icon: 'lucide:check-circle',
    },
    {
      key: 'creationDate',
      label: t('creation-date'),
      icon: 'lucide:calendar',
    },
    {
      key: 'actions',
      label: t('actions'),
      icon: 'lucide:more-vertical',
    },
  ]
}
