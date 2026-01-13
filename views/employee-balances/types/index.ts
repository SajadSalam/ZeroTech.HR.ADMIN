import type { BaseDto } from '~/utils/types/api'

export interface Balance {
    id: number
    createdAt: string
    createdByUserId: number
    createdBy: string
    createdByUserName: string
    updatedAt: string
    updatedByUserId: number
    updatedBy: string
    updatedByUserName: string
    employeeId: number
    balanceType: string
    allocatedBalance: number
    currentBalance: number
    pendingBalance: number
    availableBalance: number
    periodStartDate: string
    periodEndDate: string
    lastAccrualDate: string
    lastDeductionDate: string
    notes: string
    isActive: boolean
}

export interface EmployeeBalanceSummary {
    employeeId: number
    employeeName: string
    employeeEmail: string
    balances: Balance[]
    lastUpdated: string
    totalBalanceTypes: number
}

export interface CreateBalanceDto {
    balanceType: string
    allocatedBalance: number
    periodStartDate: string
    periodEndDate: string
    notes: string
}

export interface DeductBalanceDto {
    amount: number
    reason: string
    notes: string
}

export interface AddBalanceDto {
    amount: number
    reason: string
    notes: string
}

export enum BalanceType {
    ANNUAL = 'ANNUAL',
    SICK = 'SICK',
    PERSONAL = 'PERSONAL',
    MATERNITY = 'MATERNITY',
    PATERNITY = 'PATERNITY',
}