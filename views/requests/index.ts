import type { TableHeader } from '~/components/app-table/types'
import { RequestStatus } from './types'

export const tableHeader = (): TableHeader[] => [
  {
    key: 'id',
    label: 'رقم الطلب',
    sortable: true,
  },
  {
    key: 'employee',
    label: 'الموظف',
    sortable: false,
    render: (item: any) => `${item.employee?.firstName || ''} ${item.employee?.lastName || ''}`.trim(),
  },
  {
    key: 'requestType',
    label: 'نوع الطلب',
    sortable: false,
    render: (item: any) => item.requestType?.name || '',
  },
  {
    key: 'startDate',
    label: 'تاريخ البداية',
    sortable: true,
    render: (item: any) => {
      if (!item.startDate) return ''
      return new Date(item.startDate).toLocaleDateString('en-US')
    },
  },
  {
    key: 'endDate',
    label: 'تاريخ النهاية',
    sortable: true,
    render: (item: any) => {
      if (!item.endDate) return ''
      return new Date(item.endDate).toLocaleDateString('en-US')
    },
  },
  {
    key: 'durationDays',
    label: 'المدة (أيام)',
    sortable: true,
  },
  {
    key: 'status',
    label: 'الحالة',
    sortable: true,
    render: (item: any) => {
      const statusMap: Record<number, string> = {
        1: 'مُقدم',
        2: 'قيد المراجعة',
        3: 'موافق عليه جزئياً',
        4: 'موافق عليه',
        5: 'مرفوض',
        6: 'مكتمل',
        7: 'ملغي',
      }
      return statusMap[item.status] || 'غير معروف'
    },
  },
  {
    key: 'submittedAt',
    label: 'تاريخ التقديم',
    sortable: true,
    render: (item: any) => {
      if (!item.submittedAt) return ''
      return new Date(item.submittedAt).toLocaleDateString('en-US')
    },
  },
  {
    key: 'actions',
    label: 'الإجراءات',
    sortable: false,
  },
]


// Status filter options
export const statusOptions = [
  { value: RequestStatus.Submitted, label: 'مُقدم' },
  { value: RequestStatus.InProgress, label: 'قيد المراجعة' },
  { value: RequestStatus.ApprovedPartially, label: 'موافق عليه جزئياً' },
  { value: RequestStatus.Approved, label: 'موافق عليه' },
  { value: RequestStatus.Rejected, label: 'مرفوض' },
  { value: RequestStatus.Completed, label: 'مكتمل' },
  { value: RequestStatus.Cancelled, label: 'ملغي' },
]