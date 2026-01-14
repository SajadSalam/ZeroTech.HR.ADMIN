import { EmployeeService } from "../service"
import type { EmployeeCreateDto, EmployeeDto, EmployeeFilters, EmployeeUpdateDto } from "../types"

const employeeService = new EmployeeService

export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref<EmployeeDto[]>([])
  const isLoading = ref(false)
  const filters = ref<EmployeeFilters>({
    pageSize: 10,
    pageNumber: 1,
    fullName: null,
    email: null,
    phone: null,
    departmentId: null,
    positionId: null,
    status: null,
    createdAt: null,
    updatedAt: null,
  })
  const isCreateDialogOpen = ref(false)
  const isEditDialogOpen = ref(false)
  const selectedEmployeeId = ref<number | null>(null)
  const selectedEmployee = ref<EmployeeDto | null>(null)
  const totalPages = ref(0)

  const getEmployees = async () => {
    try {
      isLoading.value = true
      const response = await employeeService.get(filters.value)
      employees.value = response.items
      console.log(response)
      totalPages.value = response.calculatedTotalPages
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      isLoading.value = false
    }
  }

  const getEmployeeById = async (id: number) => {
    try {
      isLoading.value = true
      const employee = await employeeService.getById(id)
      return employee
    } catch (error) {
      console.error('Error fetching employee by ID:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }


  const createEmployee = async (data: EmployeeCreateDto) => {
    try {
      isLoading.value = true
      await employeeService.create(data)
      await getEmployees()  
    } catch (error) {
      console.error('Error creating employee:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateEmployee = async (data: EmployeeUpdateDto) => {
    try {
      isLoading.value = true
      await employeeService.update(selectedEmployeeId.value!, data)
      await getEmployees()
    } catch (error) {
      console.error('Error updating employee:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deleteEmployee = async (id: number) => {
    try {
      isLoading.value = true
      await employeeService.delete(id)
      useRouter().push('/employees')
      await getEmployees()
    } catch (error) {
      console.error('Error deleting employee:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const setSelectedEmployee = (employee: EmployeeDto) => {
    selectedEmployee.value = employee
    selectedEmployeeId.value = employee.id
  }

  return {
    employees,
    isLoading,
    filters,
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    isCreateDialogOpen,
    isEditDialogOpen,
    selectedEmployeeId,
    selectedEmployee,
    setSelectedEmployee,
    totalPages,
  }
})
