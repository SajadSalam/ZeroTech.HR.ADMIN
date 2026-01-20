import type { EmployeeDto } from './types'

export const tableHeader = () => {
  return [
    {
      key: 'fullName',
      label: 'اسم الموظف',
    },
    {
      key: 'employeeNumber',
      label: 'الرقم الوظيفي',
    },
    {
      key: 'department.name',
      label: 'القسم',
    },
    {
      key: 'branch.name',
      label: 'المنطقة',
    },
    {
      key: 'zone.name',
      label: 'المنطقة الجغرافية',
    },
    {
      key: 'contractType',
      label: 'نوع العقد',
    },
    {
      key: 'hireDate',
      label: 'تاريخ التعيين',
    },
    {
      key: 'actions',
      label: 'الإجراءات',
    },
  ]
}

export const contractTypes = [
    {
        label: 'دوام كامل',
        value: 1,
    },
    {
        label: 'دوام جزئي',
        value: 2,
    },
    {
        label: 'عقد ',
        value: 3,
    },
    {
        label: 'مؤقت',
        value: 4,
    },
    {
        label: 'متدرب',
        value: 5,
    },
]

// Fake data for employees
export const fakeData: EmployeeDto[] = [
  {
    id: 1,
    name: 'John Smith',
    code: '123456',
    department: 'Human Resources',
    zone: 'Zone 1',
    status: 'Active',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    code: '123457',
    department: 'Information Technology',
    zone: 'Zone 3',
    status: 'Active',
    createdAt: '2024-01-15T10:30:00Z',
  },
]
