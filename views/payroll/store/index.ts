import { payrollService } from '../service'
import type {
    EmployeePayrollDto,
    EmployeePayrollFilters,
    PayrollBatchCreateDto,
    PayrollBatchDto,
    PayrollBatchFilters,
    PayrollBatchUpdateDto,
    PayrollCalculationDto
} from '../types'
import { PayrollBatchStatus } from '../types'

export const usePayrollStore = defineStore('payroll', () => {
  // Payroll Batch State
  const payrollBatches = ref<PayrollBatchDto[]>([])
  const isLoading = ref(false)
  const filters = ref<PayrollBatchFilters>({
    pageSize: 10,
    pageNumber: 1,
    status: null,
    startDate: '',
    endDate: '',
    searchTerm: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })
  const isCreateDialogOpen = ref(false)
  const isEditDialogOpen = ref(false)
  const isCalculateDialogOpen = ref(false)
  const isViewDialogOpen = ref(false)
  const selectedBatchId = ref<number | null>(null)
  const selectedBatch = ref<PayrollBatchDto | null>(null)
  const totalPages = ref(0)

  // Employee Payroll State
  const employeePayrolls = ref<EmployeePayrollDto[]>([])
  const employeePayrollFilters = ref<EmployeePayrollFilters>({
    pageSize: 10,
    pageNumber: 1,
    employeeId: null,
    employeeName: null,
    departmentName: null,
    payrollBatchId: null,
    status: null,
    minNetPay: null,
    maxNetPay: null,
    minDeductionPercentage: null,
    maxDeductionPercentage: null,
  })
  const employeePayrollTotalPages = ref(0)
  const selectedEmployeePayroll = ref<EmployeePayrollDto | null>(null)
  const employeePayrollHistory = ref<EmployeePayrollDto[]>([])

  // Calculation State
  const calculationData = ref<PayrollCalculationDto>({
    batchId: 0,
    employeeIds: null,
    overtimeMultiplier: 1.5,
    lateDeductionFactor: 0.5,
    recalculateExisting: false,
  })

  // Payroll Batch Methods
  const getPayrollBatches = async () => {
    try {
      isLoading.value = true
      const response = await payrollService.getBatches(filters.value)
      payrollBatches.value = response.items
      totalPages.value = response.pagination.totalPages
    } catch (error) {
      console.error('Error fetching payroll batches:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getPayrollBatchById = async (id: number) => {
    try {
      isLoading.value = true
      const batch = await payrollService.getBatchById(id)
      selectedBatch.value = batch
      return batch
    } catch (error) {
      console.error('Error fetching payroll batch by ID:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const createPayrollBatch = async (data: PayrollBatchCreateDto) => {
    try {
      isLoading.value = true
      await payrollService.createBatch(data)
      await getPayrollBatches()
    } catch (error) {
      console.error('Error creating payroll batch:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updatePayrollBatch = async (data: PayrollBatchUpdateDto) => {
    try {
      isLoading.value = true
      await payrollService.updateBatch(selectedBatchId.value!, data)
      await getPayrollBatches()
    } catch (error) {
      console.error('Error updating payroll batch:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deletePayrollBatch = async (id: number) => {
    try {
      isLoading.value = true
      await payrollService.deleteBatch(id)
      await getPayrollBatches()
    } catch (error) {
      console.error('Error deleting payroll batch:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Payroll Calculation Methods
  const calculatePayrollBatch = async (batchId: number, data?: PayrollCalculationDto) => {
    try {
      isLoading.value = true
      const updatedBatch = await payrollService.calculateBatch(batchId, data)
      selectedBatch.value = updatedBatch
      await getPayrollBatches()
      return updatedBatch
    } catch (error) {
      console.error('Error calculating payroll batch:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Batch Status Methods
  const approvePayrollBatch = async (id: number) => {
    try {
      isLoading.value = true
      const updatedBatch = await payrollService.approveBatch(id)
      selectedBatch.value = updatedBatch
      await getPayrollBatches()
      return updatedBatch
    } catch (error) {
      console.error('Error approving payroll batch:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const markBatchAsPaid = async (id: number) => {
    try {
      isLoading.value = true
      const updatedBatch = await payrollService.markBatchAsPaid(id)
      selectedBatch.value = updatedBatch
      await getPayrollBatches()
      return updatedBatch
    } catch (error) {
      console.error('Error marking batch as paid:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const cancelPayrollBatch = async (id: number) => {
    try {
      isLoading.value = true
      const updatedBatch = await payrollService.cancelBatch(id)
      selectedBatch.value = updatedBatch
      await getPayrollBatches()
      return updatedBatch
    } catch (error) {
      console.error('Error cancelling payroll batch:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Employee Payroll Methods
  const getEmployeePayrolls = async () => {
    try {
      isLoading.value = true
      const response = await payrollService.getEmployeePayrolls(employeePayrollFilters.value)
      employeePayrolls.value = response.items
      employeePayrollTotalPages.value = response.calculatedTotalPages
    } catch (error) {
      console.error('Error fetching employee payrolls:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getEmployeePayrollHistory = async (employeeId: number) => {
    try {
      isLoading.value = true
      const history = await payrollService.getEmployeePayrollHistory(employeeId)
      employeePayrollHistory.value = history
      return history
    } catch (error) {
      console.error('Error fetching employee payroll history:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getEmployeePayrollById = async (id: number) => {
    try {
      isLoading.value = true
      const payroll = await payrollService.getEmployeePayrollById(id)
      selectedEmployeePayroll.value = payroll
      return payroll
    } catch (error) {
      console.error('Error fetching employee payroll by ID:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Utility Methods
  const setSelectedBatch = (batch: PayrollBatchDto) => {
    selectedBatch.value = batch
    selectedBatchId.value = batch.id
  }

  const setSelectedEmployeePayroll = (payroll: EmployeePayrollDto) => {
    selectedEmployeePayroll.value = payroll
  }

  const resetCalculationData = () => {
    calculationData.value = {
      batchId: 0,
      employeeIds: null,
      overtimeMultiplier: 1.5,
      lateDeductionFactor: 0.5,
      recalculateExisting: false,
    }
  }

  // Computed Properties
  const canEditBatch = computed(() => {
    return selectedBatch.value?.isEditable ?? false
  })

  const canCalculateBatch = computed(() => {
    return selectedBatch.value?.status === PayrollBatchStatus.Draft
  })

  const canApproveBatch = computed(() => {
    return selectedBatch.value?.status === PayrollBatchStatus.Calculated
  })

  const canMarkAsPaid = computed(() => {
    return selectedBatch.value?.status === PayrollBatchStatus.Approved
  })

  const canCancelBatch = computed(() => {
    return selectedBatch.value?.status === PayrollBatchStatus.Draft || 
           selectedBatch.value?.status === PayrollBatchStatus.Calculated
  })

  return {
    // State
    payrollBatches,
    isLoading,
    filters,
    isCreateDialogOpen,
    isEditDialogOpen,
    isCalculateDialogOpen,
    isViewDialogOpen,
    selectedBatchId,
    selectedBatch,
    totalPages,
    employeePayrolls,
    employeePayrollFilters,
    employeePayrollTotalPages,
    selectedEmployeePayroll,
    employeePayrollHistory,
    calculationData,

    // Batch Methods
    getPayrollBatches,
    getPayrollBatchById,
    createPayrollBatch,
    updatePayrollBatch,
    deletePayrollBatch,

    // Calculation Methods
    calculatePayrollBatch,

    // Status Methods
    approvePayrollBatch,
    markBatchAsPaid,
    cancelPayrollBatch,

    // Employee Payroll Methods
    getEmployeePayrolls,
    getEmployeePayrollHistory,
    getEmployeePayrollById,

    // Utility Methods
    setSelectedBatch,
    setSelectedEmployeePayroll,
    resetCalculationData,

    // Computed Properties
    canEditBatch,
    canCalculateBatch,
    canApproveBatch,
    canMarkAsPaid,
    canCancelBatch,
  }
})
