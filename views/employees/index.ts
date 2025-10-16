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
