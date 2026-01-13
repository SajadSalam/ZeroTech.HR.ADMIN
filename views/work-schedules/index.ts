import type { TableHeader } from '~/components/app-table/types'
import { getWorkingDaysArray } from './types'

export const tableHeader = (): TableHeader[] => [
  {
    key: 'name',
    label: 'اسم جدول العمل',
    sortable: true,
    visible: true,
  },
  {
    key: 'type',
    label: 'النوع',
    sortable: false,
    visible: true,
  },
  {
    key: 'flexibility',
    label: 'المرونة',
    sortable: true,
    visible: true,
  },
  {
    key: 'totalWeeklyHours',
    label: 'الساعات الأسبوعية',
    sortable: true,
    visible: true,
  },
  {
    key: 'shifts',
    label: 'الشفتات',
    sortable: false,
    visible: true,
  },
  {
    key: 'assignments',
    label: 'المستخدمين المعينين',
    sortable: false,
    visible: true,
  },
  {
    key: 'lateAttendanceRules',
    label: 'قواعد التأخير',
    sortable: false,
    visible: true,
  },
  {
    key: 'createdAt',
    label: 'تاريخ الإنشاء',
    sortable: true,
    visible: true,
  },
  {
    key: 'actions',
    label: 'الإجراءات',
    sortable: false,
    visible: true,
  },
]

// Helper functions for table display
export const formatScheduleType = (schedule: any) => {
  if (schedule.isGeneralTemplate) {
    return 'قالب عام'
  } else if (schedule.specificUser) {
    return `خاص بـ ${schedule.specificUser.fullName}`
  }
  return 'خاص بمستخدم'
}

export const formatFlexibility = (schedule: any) => {
  if (schedule.isFlexible) {
    return `مرن (${schedule.flexibleHoursRequired} ساعة)`
  }
  return 'ثابت'
}

export const formatShifts = (shifts: any[]) => {
  if (!shifts || shifts.length === 0) return 'لا توجد ورديات'
  
  if (shifts.length === 1) {
    const shift = shifts[0]
    const workingDays = getWorkingDaysArray(shift.workingDays)
    return `${shift.name} (${shift.startTime} - ${shift.endTime})`
  }
  
  return `${shifts.length} ورديات`
}


export const formatassignments = (assignments: any[]) => {
  if (!assignments || assignments.length === 0) return 'لا يوجد مستخدمين'
  
  if (assignments.length === 1) {
    return assignments[0].user?.fullName || 'مستخدم واحد'
  }
  
  return `${assignments.length} مستخدمين`
}

export const formatLateAttendanceRules = (rules: any[]) => {
  if (!rules || rules.length === 0) return 'لا توجد قواعد'
  
  if (rules.length === 1) {
    return `قاعدة واحدة (${rules[0].lateMinutesThreshold} دقيقة)`
  }
  
  return `${rules.length} قواعد`
}

export const formatDate = (dateString: string) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
