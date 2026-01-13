import type { PayrollBatchDto, EmployeePayrollDto } from './types'

export const payrollBatchTableHeaders = () => {
  return [
    {
      key: 'title',
      label: 'عنوان الدفعة',
    },
    {
      key: 'periodStartDate',
      label: 'تاريخ البداية',
    },
    {
      key: 'periodEndDate',
      label: 'تاريخ النهاية',
    },
    {
      key: 'statusDisplay',
      label: 'الحالة',
    },
    {
      key: 'totalEmployees',
      label: 'عدد الموظفين',
    },
    {
      key: 'processedCount',
      label: 'المعالج',
    },
    {
      key: 'totalNetPay',
      label: 'إجمالي الصافي',
    },
    {
      key: 'completionPercentage',
      label: 'نسبة الإنجاز',
    },
    {
      key: 'processedByUserName',
      label: 'معالج بواسطة',
    },
    {
      key: 'actions',
      label: 'الإجراءات',
    },
  ]
}

export const employeePayrollTableHeaders = () => {
  return [
    {
      key: 'employeeNumber',
      label: 'رقم الموظف',
    },
    {
      key: 'employeeName',
      label: 'اسم الموظف',
    },
    {
      key: 'departmentName',
      label: 'القسم',
    },
    {
      key: 'jobTitle',
      label: 'المسمى الوظيفي',
    },
    {
      key: 'baseSalary',
      label: 'الراتب الأساسي',
    },
    {
      key: 'actualWorkingDays',
      label: 'أيام العمل الفعلية',
    },
    {
      key: 'absentDays',
      label: 'أيام الغياب',
    },
    {
      key: 'overtimeHours',
      label: 'ساعات إضافية',
    },
    {
      key: 'totalDeductions',
      label: 'إجمالي الخصومات',
    },
    {
      key: 'netPay',
      label: 'الراتب الصافي',
    },
    {
      key: 'statusDisplay',
      label: 'الحالة',
    },
    {
      key: 'actions',
      label: 'الإجراءات',
    },
  ]
}

export const employeePayrollDetailsTableHeaders = () => {
  return [
    {
      key: 'payrollBatchTitle',
      label: 'دفعة الراتب',
    },
    {
      key: 'baseSalary',
      label: 'الراتب الأساسي',
    },
    {
      key: 'scheduledWorkingDays',
      label: 'أيام العمل المجدولة',
    },
    {
      key: 'actualWorkingDays',
      label: 'أيام العمل الفعلية',
    },
    {
      key: 'absentDays',
      label: 'أيام الغياب',
    },
    {
      key: 'lateDays',
      label: 'أيام التأخير',
    },
    {
      key: 'regularHours',
      label: 'الساعات العادية',
    },
    {
      key: 'overtimeHours',
      label: 'الساعات الإضافية',
    },
    {
      key: 'overtimePay',
      label: 'أجر الساعات الإضافية',
    },
    {
      key: 'totalLateMinutes',
      label: 'إجمالي دقائق التأخير',
    },
    {
      key: 'lateDeductions',
      label: 'خصومات التأخير',
    },
    {
      key: 'absenceDeductions',
      label: 'خصومات الغياب',
    },
    {
      key: 'totalDeductions',
      label: 'إجمالي الخصومات',
    },
    {
      key: 'grossPay',
      label: 'الراتب الإجمالي',
    },
    {
      key: 'netPay',
      label: 'الراتب الصافي',
    },
    {
      key: 'dailyRate',
      label: 'المعدل اليومي',
    },
    {
      key: 'hourlyRate',
      label: 'المعدل بالساعة',
    },
    {
      key: 'deductionPercentage',
      label: 'نسبة الخصم',
    },
    {
      key: 'attendanceRate',
      label: 'نسبة الحضور',
    },
    {
      key: 'statusDisplay',
      label: 'الحالة',
    },
  ]
}
