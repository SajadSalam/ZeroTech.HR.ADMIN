import type { AttendanceRecord } from './types'

export const tableHeader = () => [
  {
    key: 'employeeName',
    label: 'اسم الموظف',
    sortable: true,
  },
  {
    key: 'employeeNumber',
    label: 'الرقم الوظيفي',
    sortable: true,
  },
  {
    key: 'attendanceDate',
    label: 'تاريخ الحضور',
    sortable: true,
  },
  {
    key: 'checkInTime',
    label: 'وقت الدخول',
    sortable: true,
  },
  {
    key: 'checkOutTime',
    label: 'وقت الخروج',
    sortable: true,
  },
  {
    key: 'workScheduleShiftName',
    label: 'الشفت',
    sortable: true,
  },
  {
    key: 'hoursWorked',
    label: 'ساعات العمل',
    sortable: true,
  },
  {
    key: 'overtimeHours',
    label: 'ساعات إضافية',
    sortable: true,
  },
  {
    key: 'isLateCheckIn',
    label: 'تأخير دخول',
    sortable: true,
  },
  {
    key: 'isEarlyCheckOut',
    label: 'خروج مبكر',
    sortable: true,
  },
  {
    key: 'actions',
    label: 'الإجراءات',
    sortable: false,
  },
]

