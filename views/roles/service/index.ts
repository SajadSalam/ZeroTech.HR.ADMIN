import type { PaginatedResponse } from '~/utils/types/base'

import type { RoleDto, RoleFilters } from '../types'
import axiosIns from '~/services/app-client/axios'

interface IRoleService {
    get: (filters: RoleFilters) => Promise<PaginatedResponse<RoleDto>>
}

export class RoleService implements IRoleService {
    async get(filters: RoleFilters): Promise<PaginatedResponse<RoleDto>> {
        const response = await axiosIns.get<PaginatedResponse<RoleDto>>(
            '/Role',
            {
                params: filters,
            }
        )
        return response.data
    }
}

export const roleService = new RoleService()

