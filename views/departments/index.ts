import type { DepartmentDto } from './types'

export const tableHeader = () => {
  return [
    {
      key: 'name',
      label: 'اسم القسم',
    },
    {
      key: 'code',
      label: 'رمز القسم',
    },
    {
      key: 'manager',
      label: 'المدير',
    },
    {
      key: 'parentDepartment',
      label: 'القسم الأب',
    },
    {
      key: 'budget',
      label: 'الميزانية',
    },
    {
      key: 'location',
      label: 'الموقع',
    },
    {
      key: 'actions',
      label: 'الإجراءات',
    },
  ]
}

// Fake data for departments
export const fakeData: DepartmentDto[] = [
  {
    id: 1,
    name: 'Human Resources',
    description: 'Manages employee relations and policies',
    code: 'HR',
    managerId: 5,
    manager: {
      id: 5,
      fullName: 'John Smith',
      email: 'john.smith@company.com',
      username: 'jsmith'
    },
    parentDepartmentId: null,
    parentDepartment: null,
    subDepartments: [
      {
        id: 10,
        name: 'Recruitment',
        code: 'HR_REC',
        description: 'Handles hiring processes',
        managerId: null,
        manager: null,
        parentDepartmentId: 1,
        parentDepartment: null,
        budget: 25000.00,
        location: 'Building A, Floor 3',
        contactEmail: 'recruitment@company.com',
        contactPhone: '+1-555-0124',
        createdAt: '2024-01-20T10:30:00Z',
        updatedAt: '2024-03-20T14:45:00Z',
        isActive: true,
        deleted: false,
        creationDate: '2024-01-20T10:30:00Z'
      }
    ],
    budget: 150000.00,
    location: 'Building A, Floor 3',
    contactEmail: 'hr@company.com',
    contactPhone: '+1-555-0123',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-03-20T14:45:00Z',
    isActive: true,
    deleted: false,
    creationDate: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Information Technology',
    description: 'Manages IT infrastructure and support',
    code: 'IT',
    managerId: 8,
    manager: {
      id: 8,
      fullName: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      username: 'sjohnson'
    },
    parentDepartmentId: null,
    parentDepartment: null,
    subDepartments: [
      {
        id: 11,
        name: 'IT Support',
        code: 'IT_SUP',
        description: 'Technical support team',
        managerId: 12,
        manager: {
          id: 12,
          fullName: 'Mike Wilson',
          email: 'mike.wilson@company.com',
          username: 'mwilson'
        },
        parentDepartmentId: 2,
        parentDepartment: null,
        budget: 30000.00,
        location: 'Building C, Floor 1',
        contactEmail: 'support@company.com',
        contactPhone: '+1-555-0125',
        createdAt: '2024-01-25T10:30:00Z',
        updatedAt: '2024-03-20T14:45:00Z',
        isActive: true,
        deleted: false,
        creationDate: '2024-01-25T10:30:00Z'
      }
    ],
    budget: 200000.00,
    location: 'Building C, Floor 2',
    contactEmail: 'it@company.com',
    contactPhone: '+1-555-0456',
    createdAt: '2024-01-18T10:30:00Z',
    updatedAt: '2024-03-20T14:45:00Z',
    isActive: true,
    deleted: false,
    creationDate: '2024-01-18T10:30:00Z'
  },
  {
    id: 3,
    name: 'Marketing',
    description: 'Handles marketing and promotions',
    code: 'MKT',
    managerId: 15,
    manager: {
      id: 15,
      fullName: 'Emily Davis',
      email: 'emily.davis@company.com',
      username: 'edavis'
    },
    parentDepartmentId: null,
    parentDepartment: null,
    subDepartments: [],
    budget: 75000.00,
    location: 'Building B, Floor 2',
    contactEmail: 'marketing@company.com',
    contactPhone: '+1-555-0789',
    createdAt: '2024-02-01T10:30:00Z',
    updatedAt: '2024-03-20T14:45:00Z',
    isActive: true,
    deleted: false,
    creationDate: '2024-02-01T10:30:00Z'
  },
  {
    id: 4,
    name: 'Finance',
    description: 'Manages financial operations and accounting',
    code: 'FIN',
    managerId: 20,
    manager: {
      id: 20,
      fullName: 'Robert Brown',
      email: 'robert.brown@company.com',
      username: 'rbrown'
    },
    parentDepartmentId: null,
    parentDepartment: null,
    subDepartments: [
      {
        id: 12,
        name: 'Accounting',
        code: 'FIN_ACC',
        description: 'Handles accounting and bookkeeping',
        managerId: 22,
        manager: {
          id: 22,
          fullName: 'Lisa Anderson',
          email: 'lisa.anderson@company.com',
          username: 'landerson'
        },
        parentDepartmentId: 4,
        parentDepartment: null,
        budget: 40000.00,
        location: 'Building A, Floor 1',
        contactEmail: 'accounting@company.com',
        contactPhone: '+1-555-0126',
        createdAt: '2024-02-05T10:30:00Z',
        updatedAt: '2024-03-20T14:45:00Z',
        isActive: true,
        deleted: false,
        creationDate: '2024-02-05T10:30:00Z'
      }
    ],
    budget: 120000.00,
    location: 'Building A, Floor 1',
    contactEmail: 'finance@company.com',
    contactPhone: '+1-555-0321',
    createdAt: '2024-01-22T10:30:00Z',
    updatedAt: '2024-03-20T14:45:00Z',
    isActive: true,
    deleted: false,
    creationDate: '2024-01-22T10:30:00Z'
  },
  {
    id: 5,
    name: 'Sales',
    description: 'Manages sales operations and customer relations',
    code: 'SALES',
    managerId: 25,
    manager: {
      id: 25,
      fullName: 'David Miller',
      email: 'david.miller@company.com',
      username: 'dmiller'
    },
    parentDepartmentId: null,
    parentDepartment: null,
    subDepartments: [],
    budget: 90000.00,
    location: 'Building B, Floor 1',
    contactEmail: 'sales@company.com',
    contactPhone: '+1-555-0654',
    createdAt: '2024-02-10T10:30:00Z',
    updatedAt: '2024-03-20T14:45:00Z',
    isActive: true,
    deleted: false,
    creationDate: '2024-02-10T10:30:00Z'
  }
]
