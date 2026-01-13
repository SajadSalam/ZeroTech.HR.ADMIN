export interface DepartmentManager {
    id: number
    fullName: string
    email: string
    username: string
}

export interface ParentDepartment {
    id: number
    name: string
    code: string
}

export interface Department {
    id: number
    name: string
    code: string
    description: string
    manager: DepartmentManager
    parentDepartment?: ParentDepartment
}

export interface SubDepartment {
    id: number
    name: string
    code: string
    description: string
    manager: DepartmentManager
}

export interface Branch {
    id: number
    name: string
}

export interface WorkSchedule {
    id: number
    name: string
    description: string
    isActive: boolean
}

export interface User {
    id: number
    username: string
    email: string
    fullName: string
}

export interface Attachment {
    id: number
    createdAt: string
    createdByUserId: number
    createdBy: string
    createdByUserName: string
    updatedAt: string
    updatedByUserId: number
    updatedBy: string
    updatedByUserName: string
    isActive: boolean
    employeeId: number
    attachmentType: string
    fileName: string
    filePath: string
    fileSize: number
    fileSizeFormatted: string
    contentType: string
    description: string
    uploadedAt: string
    isPrimary: boolean
    downloadUrl: string
    isImage: boolean
    fileExtension: string
}

export interface EmployeeVacation {
    id: number
    createdAt: string
    createdByUserId: number
    createdBy: string
    createdByUserName: string
    updatedAt: string
    updatedByUserId: number
    updatedBy: string
    updatedByUserName: string
    isActive: boolean

    fullName: string
    email: string
    phone: string
    identityNumber: string
    gender: number
    genderDisplay: string
    birthDate: string
    age: number
    employeeNumber: string

    departmentId: number
    department: Department

    jobTitle: string
    contractType: number
    contractTypeDisplay: string

    branchId: number
    branch: Branch

    hireDate: string
    salary: number
    yearsOfService: number
    monthsOfService: number
    daysOfService: number

    workScheduleId: number
    workSchedule: WorkSchedule

    vacationBalance: number
    vacationAccrualRatePerMonth: number
    vacationAccrualRatePerDay: number
    vacationBalanceAsOfDate: string

    userId: number
    user: User

    attachments: Attachment[]
    attachmentCount: number
}

