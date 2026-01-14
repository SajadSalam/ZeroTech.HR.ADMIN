import type { ApprovalChainDto } from './types'

export const tableHeader = () => [
  {
    key: 'name',
    label: 'اسم السلسلة',
    sortable: true,
  },
  {
    key: 'requestType',
    label: 'نوع الطلب',
    sortable: true,
  },
  {
    key: 'department',
    label: 'القسم',
    sortable: true,
  },
  {
    key: 'priority',
    label: 'الأولوية',
    sortable: true,
  },
  {
    key: 'stepsCount',
    label: 'عدد الخطوات',
    sortable: false,
  },
  {
    key: 'maxCompletionHours',
    label: 'الحد الأقصى (ساعة)',
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

export const ActiveStatusOptions = [
  { value: true, label: 'نشط' },
  { value: false, label: 'غير نشط' },
]

export const timeoutActions = [
  { value: 'AutoApprove', label: 'موافقة تلقائية' },
  { value: 'AutoReject', label: 'رفض تلقائي' },
  { value: 'Escalate', label: 'تصعيد' },
  { value: 'Notify', label: 'إشعار فقط' },
]