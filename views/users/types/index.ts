import type { BaseDto, BaseFilters } from '~/utils/types/base'
import type { Permission, Role } from '~/views/roles/types'

export type User = {
    employeeId: number | null
    username: string
    email: string
    firstName: string
    lastName: string
    fullName: string
    phoneNumber: string
    emailVerified: boolean
    lastLoginAt: string
    isLockedOut: boolean
    roles: Role[]
    permissions: Permission[]
}

export type UserDto = BaseDto & User

export type UserFilters = BaseFilters & {
    username?: string
    email?: string
}

export type AssignRoleDto = {
    userId: number
    roleId: number
    effectiveFrom: string
    effectiveTo: string
}

export type UserProfileUpdateDto = {
    firstName: string
    lastName: string
    phoneNumber: string
}
