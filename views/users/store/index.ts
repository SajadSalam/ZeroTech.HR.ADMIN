import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserDto, UserFilters, AssignRoleDto, UserProfileUpdateDto } from '../types'
import type { RoleDto } from '~/views/roles/types'
import { userService } from '../service'
import { useAuthStore } from '~/views/auth/store/auth'

export const useUserStore = defineStore('user', () => {
    // State
    const authStore = useAuthStore()
    const users = ref<UserDto[]>([])
    const isLoading = ref(false)
    const isProfileUpdating = ref(false)
    const isProfileDialogOpen = ref(false)
    const filters = ref<UserFilters>({
        pageSize: 10,
        pageNumber: 1,
        username: '',
        email: '',
    })
    const totalPages = ref(0)
    const isRolesDialogOpen = ref(false)
    const isAssignRoleDialogOpen = ref(false)
    const selectedUserId = ref<number | null>(null)
    const selectedUser = ref<UserDto | null>(null)
    const userRoles = ref<RoleDto[]>([
        {
            id: '1',
            documentId: '1',
            deleted: false,
            creationDate: new Date().toISOString(),
            name: 'Admin',
            description: 'Admin role',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isSystemRole: false,
            permissions: [],
        },
        {
            id: '2',
            documentId: '2',
            deleted: false,
            creationDate: new Date().toISOString(),
            name: 'User',
            description: 'User role',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isSystemRole: false,
            permissions: [],
        },
    ])

    // Methods
    const getUsers = async () => {
        try {
            isLoading.value = true
            const response = await userService.get(filters.value)
            users.value = response.items
            totalPages.value = response.calculatedTotalPages
        } catch (error) {
            console.error('Error fetching users:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const getUserRoles = async (userId: number) => {
        try {
            isLoading.value = true
            const roles = await userService.getUserRoles(userId)
            userRoles.value = roles
        } catch (error) {
            console.error('Error fetching user roles:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const assignRole = async (data: AssignRoleDto) => {
        try {
            isLoading.value = true
            await userService.assignRole(data)
            await getUsers()
        } catch (error) {
            console.error('Error assigning role:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const removeRole = async (userId: number, roleId: string) => {
        try {
            isLoading.value = true
            await userService.removeRole(userId, roleId)
            await getUserRoles(userId)
        } catch (error) {
            console.error('Error removing role:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const unlockUser = async (userId: number) => {
        try {
            isLoading.value = true
            await userService.unlockUser(userId)
        } catch (error) {
            console.error('Error locking out user:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const updateProfile = async (data: UserProfileUpdateDto) => {
        try {
            isProfileUpdating.value = true
            const response = await userService.updateProfile(data)
            authStore.setUserData(response)
            return response 
        } catch (error) {
            console.error('Error updating profile:', error)
            throw error
        } finally {
            isProfileUpdating.value = false
        }
    }

    return {
        users,
        isLoading,
        isProfileUpdating,
        isProfileDialogOpen,
        filters,
        totalPages,
        isRolesDialogOpen,
        isAssignRoleDialogOpen,
        selectedUserId,
        selectedUser,
        userRoles,
        getUsers,
        getUserRoles,
        assignRole,
        removeRole,
        unlockUser,
        updateProfile,
    }
})

