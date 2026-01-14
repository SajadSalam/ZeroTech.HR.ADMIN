import type { ZoneDto } from './types'

export const tableHeader = () => [
  {
    key: 'name',
    label: 'اسم المنطقة',
    sortable: true,
  },
  {
    key: 'zoneType',
    label: 'نوع المنطقة',
    sortable: true,
  },
  {
    key: 'description',
    label: 'الوصف',
    sortable: false,
  },
  {
    key: 'formattedArea',
    label: 'المساحة',
    sortable: true,
  },
  {
    key: 'priority',
    label: 'الأولوية',
    sortable: true,
  },
  {
    key: 'isOperational',
    label: 'الحالة التشغيلية',
    sortable: true,
  },
  {
    key: 'isActive',
    label: 'الحالة',
    sortable: true,
  },
  {
    key: 'actions',
    label: 'الإجراءات',
    sortable: false,
  },
]

export const zoneTypes = [
  { value: 'Commercial', label: 'تجاري' },
  { value: 'Residential', label: 'سكني' },
  { value: 'Industrial', label: 'صناعي' },
  { value: 'Mixed-Use', label: 'مختلط' },
  { value: 'Recreational', label: 'ترفيهي' },
]