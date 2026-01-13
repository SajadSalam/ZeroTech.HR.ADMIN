import { defineStore } from 'pinia'
import { employeeVacationService } from '../service'
import type { EmployeeVacation } from '../types'

export const useEmployeeVacationStore = defineStore('employeeVacation', () => {
    // State
    const employeeVacation = ref<EmployeeVacation | null>(null)
    const isLoading = ref(false)
    const isDialogOpen = ref(false)

    // Methods
    const getEmployeeVacationBalance = async (employeeId: number | string) => {
        isLoading.value = true
        isDialogOpen.value = true
        try {
            const response =
                await employeeVacationService.getEmployeeVacationBalance(
                    employeeId
                )
            employeeVacation.value = response
        } catch (error) {
            console.error('Error fetching employee vacation balance:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const resetStore = () => {
        employeeVacation.value = null
        isDialogOpen.value = false
    }

    return {
        employeeVacation,
        isLoading,
        isDialogOpen,
        getEmployeeVacationBalance,
        resetStore,
    }
})

