import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'

export type Permission = {
    id: number
    isActive: boolean
    name: string
    displayName: string
    description: string
    category: string
    isSystemPermission: boolean
}

export type Role = {
    name: string
    description: string
    isActive: boolean
    isSystemRole: boolean
    permissions: Permission[]
}

export type RoleDto = BaseDto & Role

export type RoleFilters = BaseFilters & {
    name?: string
}

