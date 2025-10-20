import { defineStore } from 'pinia'
import { employeeBalanceService } from '../service'
import type {
    EmployeeBalanceSummary,
    Balance,
    CreateBalanceDto,
    DeductBalanceDto,
    AddBalanceDto,
} from '../types'

export const useEmployeeBalanceStore = defineStore('employeeBalance', () => {
    // State
    const balanceSummary = ref<EmployeeBalanceSummary | null>(null)
    const isLoading = ref(false)
    const currentEmployeeId = ref<number | string | null>(null)
    const isCreateDialogOpen = ref(false)
    const isDeductDialogOpen = ref(false)
    const isAddDialogOpen = ref(false)
    const selectedBalance = ref<Balance | null>(null)

    // Methods
    const getEmployeeBalance = async (employeeId: number | string) => {
        try {
            isLoading.value = true
            currentEmployeeId.value = employeeId
            const response =
                await employeeBalanceService.getEmployeeBalance(employeeId)
            balanceSummary.value = response
        } catch (error) {
            console.error('Error fetching employee balance:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const createBalance = async (data: CreateBalanceDto) => {
        if (!currentEmployeeId.value) {
            throw new Error('No employee ID set')
        }
        try {
            isLoading.value = true
            await employeeBalanceService.createBalance(
                currentEmployeeId.value,
                data
            )
            await getEmployeeBalance(currentEmployeeId.value)
        } catch (error) {
            console.error('Error creating balance:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const deductBalance = async (
        balanceType: string,
        data: DeductBalanceDto
    ) => {
        if (!currentEmployeeId.value) {
            throw new Error('No employee ID set')
        }
        try {
            isLoading.value = true
            await employeeBalanceService.deductBalance(
                currentEmployeeId.value,
                balanceType,
                data
            )
            await getEmployeeBalance(currentEmployeeId.value)
        } catch (error) {
            console.error('Error deducting balance:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const addBalance = async (balanceType: string, data: AddBalanceDto) => {
        if (!currentEmployeeId.value) {
            throw new Error('No employee ID set')
        }
        try {
            isLoading.value = true
            await employeeBalanceService.addBalance(
                currentEmployeeId.value,
                balanceType,
                data
            )
            await getEmployeeBalance(currentEmployeeId.value)
        } catch (error) {
            console.error('Error adding balance:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const resetStore = () => {
        balanceSummary.value = null
        currentEmployeeId.value = null
        selectedBalance.value = null
        isCreateDialogOpen.value = false
        isDeductDialogOpen.value = false
        isAddDialogOpen.value = false
    }

    return {
        balanceSummary,
        isLoading,
        currentEmployeeId,
        isCreateDialogOpen,
        isDeductDialogOpen,
        isAddDialogOpen,
        selectedBalance,
        getEmployeeBalance,
        createBalance,
        deductBalance,
        addBalance,
        resetStore,
    }
})

