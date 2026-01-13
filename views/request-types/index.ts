import type { RequestTypeDto } from './types'

export const tableHeader = () => {
  return [
    {
      key: 'name',
      label: 'اسم نوع الطلب',
    },
    {
      key: 'code',
      label: 'رمز النوع',
    },
    {
      key: 'category',
      label: 'الفئة',
    },
    {
      key: 'isEnabled',
      label: 'الحالة',
    },
    {
      key: 'requiresApproval',
      label: 'يتطلب موافقة',
    },
    {
      key: 'affectsAttendance',
      label: 'يؤثر على الحضور',
    },
    {
      key: 'isPaidTime',
      label: 'وقت مدفوع',
    },
    {
      key: 'actions',
      label: 'الإجراءات',
    },
  ]
}

// Fake data for request types
export const fakeData: RequestTypeDto[] = [
  {
    id: 1,
    name: 'إجازة سنوية',
    description: 'طلب إجازة سنوية للموظف',
    code: 'ANNUAL_LEAVE',
    categoryId: 1,
    category: {
      id: 1,
      name: 'الإجازات',
      code: 'LEAVE'
    },
    isEnabled: true,
    requiresApproval: true,
    allowsAttachments: true,
    requiresAttachments: false,
    maxAdvanceDays: 90,
    minAdvanceDays: 1,
    maxDurationDays: 30,
    minDurationHours: 8.0,
    affectsAttendance: true,
    affectsPayroll: false,
    isPaidTime: true,
    validationRules: '{"maxConsecutiveDays": 14}',
    customFields: '[{"name":"reason","type":"text","required":true}]',
    notificationSettings: '{"notifyManager": true, "notifyHR": false}',
    displayOrder: 1,
    colorCode: '#4CAF50',
    iconClass: 'fas fa-calendar-alt',
    allowedDepartments: [
      {
        id: 10,
        requestTypeId: 1,
        departmentId: 5,
        department: {
          id: 5,
          name: 'الهندسة'
        }
      }
    ],
    allowedRoles: [
      {
        id: 15,
        requestTypeId: 1,
        roleId: 3,
        role: {
          id: 3,
          name: 'موظف'
        }
      }
    ],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-03-20T14:45:00Z',
    isActive: true,
    deleted: false,
    creationDate: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'إجازة مرضية',
    description: 'إجازة طبية للمرض',
    code: 'SICK_LEAVE',
    categoryId: 1,
    category: {
      id: 1,
      name: 'الإجازات',
      code: 'LEAVE'
    },
    isEnabled: true,
    requiresApproval: true,
    allowsAttachments: true,
    requiresAttachments: true,
    maxAdvanceDays: 0,
    minAdvanceDays: 0,
    maxDurationDays: 5,
    minDurationHours: 4.0,
    affectsAttendance: true,
    affectsPayroll: true,
    isPaidTime: false,
    validationRules: null,
    customFields: null,
    notificationSettings: '{"notifyManager": true, "notifyHR": true}',
    displayOrder: 2,
    colorCode: '#FF5722',
    iconClass: 'fas fa-user-md',
    allowedDepartments: [],
    allowedRoles: [],
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-03-20T14:45:00Z',
    isActive: true,
    deleted: false,
    creationDate: '2024-01-20T10:30:00Z'
  },
  {
    id: 3,
    name: 'طلب عمل إضافي',
    description: 'طلب للعمل الإضافي خارج ساعات العمل الرسمية',
    code: 'OVERTIME',
    categoryId: 2,
    category: {
      id: 2,
      name: 'العمل الإضافي',
      code: 'OVERTIME'
    },
    isEnabled: true,
    requiresApproval: true,
    allowsAttachments: false,
    requiresAttachments: false,
    maxAdvanceDays: 7,
    minAdvanceDays: 1,
    maxDurationDays: null,
    minDurationHours: 1.0,
    affectsAttendance: false,
    affectsPayroll: true,
    isPaidTime: true,
    validationRules: '{"maxHoursPerWeek": 20}',
    customFields: '[{"name":"justification","type":"textarea","required":true}]',
    notificationSettings: '{"notifyManager": true, "notifyHR": true}',
    displayOrder: 3,
    colorCode: '#2196F3',
    iconClass: 'fas fa-clock',
    allowedDepartments: [],
    allowedRoles: [],
    createdAt: '2024-02-01T10:30:00Z',
    updatedAt: '2024-03-20T14:45:00Z',
    isActive: true,
    deleted: false,
    creationDate: '2024-02-01T10:30:00Z'
  },
  {
    id: 4,
    name: 'طلب تدريب',
    description: 'طلب للحصول على دورة تدريبية',
    code: 'TRAINING_REQUEST',
    categoryId: 3,
    category: {
      id: 3,
      name: 'التطوير المهني',
      code: 'DEVELOPMENT'
    },
    isEnabled: true,
    requiresApproval: true,
    allowsAttachments: true,
    requiresAttachments: false,
    maxAdvanceDays: 30,
    minAdvanceDays: 7,
    maxDurationDays: 10,
    minDurationHours: null,
    affectsAttendance: false,
    affectsPayroll: false,
    isPaidTime: true,
    validationRules: null,
    customFields: '[{"name":"trainingProvider","type":"text","required":true},{"name":"cost","type":"number","required":true}]',
    notificationSettings: '{"notifyManager": true, "notifyHR": true}',
    displayOrder: 4,
    colorCode: '#9C27B0',
    iconClass: 'fas fa-graduation-cap',
    allowedDepartments: [],
    allowedRoles: [],
    createdAt: '2024-02-10T10:30:00Z',
    updatedAt: '2024-03-20T14:45:00Z',
    isActive: true,
    deleted: false,
    creationDate: '2024-02-10T10:30:00Z'
  },
  {
    id: 5,
    name: 'طلب استقالة',
    description: 'طلب ترك العمل والاستقالة',
    code: 'RESIGNATION',
    categoryId: 4,
    category: {
      id: 4,
      name: 'الموارد البشرية',
      code: 'HR'
    },
    isEnabled: true,
    requiresApproval: true,
    allowsAttachments: true,
    requiresAttachments: true,
    maxAdvanceDays: null,
    minAdvanceDays: 30,
    maxDurationDays: null,
    minDurationHours: null,
    affectsAttendance: true,
    affectsPayroll: true,
    isPaidTime: false,
    validationRules: '{"noticePeriodDays": 30}',
    customFields: '[{"name":"reason","type":"textarea","required":true},{"name":"lastWorkingDay","type":"date","required":true}]',
    notificationSettings: '{"notifyManager": true, "notifyHR": true}',
    displayOrder: 5,
    colorCode: '#F44336',
    iconClass: 'fas fa-sign-out-alt',
    allowedDepartments: [],
    allowedRoles: [],
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-03-20T14:45:00Z',
    isActive: true,
    deleted: false,
    creationDate: '2024-02-15T10:30:00Z'
  }
]
