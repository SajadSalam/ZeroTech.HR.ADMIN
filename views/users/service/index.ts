import type { PaginatedResponse } from '~/utils/types/ApiResponses'
import type { UserDto, UserFilters, AssignRoleDto, UserProfileUpdateDto } from '../types'
import type { MeResponse } from '~/views/auth/types'
import type { RoleDto } from '~/views/roles/types'
import axiosIns from '~/services/app-client/axios'

interface IUserService {
    get: (filters: UserFilters) => Promise<PaginatedResponse<UserDto>>
    getUserRoles: (userId: number) => Promise<RoleDto[]>
    assignRole: (data: AssignRoleDto) => Promise<void>
    removeRole: (userId: number, roleId: string) => Promise<void>
    updateProfile: (data: UserProfileUpdateDto) => Promise<MeResponse>
}

export class UserService implements IUserService {
    async get(filters: UserFilters): Promise<PaginatedResponse<UserDto>> {
        const response = await axiosIns.get<PaginatedResponse<UserDto>>(
            '/User',
            {
                params: filters,
            }
        )
        return response.data
    }

    async getUserRoles(userId: number): Promise<RoleDto[]> {
        const response = await axiosIns.get<RoleDto[]>(`/User/${userId}/roles`)
        return response.data
    }

    async assignRole(data: AssignRoleDto): Promise<void> {
        await axiosIns.post('/User/assign-role', data)
    }

    async removeRole(userId: number, roleId: string): Promise<void> {
        await axiosIns.delete(`/User/${userId}/roles/${roleId}`)
    }

    async unlockUser(userId: number): Promise<void> {
        await axiosIns.post(`/User/${userId}/unlock`)
    }

    async updateProfile(data: UserProfileUpdateDto): Promise<MeResponse> {
        const response = await axiosIns.put<MeResponse>('/User/profile', data)
        return response.data
    }
}

export const userService = new UserService()

