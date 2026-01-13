import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RoleDto, RoleFilters } from '../types'
import { roleService } from '../service'

export const useRoleStore = defineStore('role', () => {
    // State
    const roles = ref<RoleDto[]>([])
    const isLoading = ref(false)
    const filters = ref<RoleFilters>({
        pageSize: 10,
        pageNumber: 1,
        name: '',
    })
    const totalPages = ref(0)

    // Methods
    const getRoles = async () => {
        try {
            isLoading.value = true
            const response = await roleService.get(filters.value)
            roles.value = response.data
            totalPages.value = response.pagesCount
        } catch (error) {
            console.error('Error fetching roles:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    return {
        roles,
        isLoading,
        filters,
        totalPages,
        getRoles,
    }
})

