import { EmployeeService } from '../service'
import type { Employee, EmployeeFilters } from '../types'

const employeeService = new EmployeeService()
export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref<Employee[]>([])
  const loading = ref(false)
  const filters = ref<EmployeeFilters>({
    search: null,
    position: null,
    courses: [],
    collegeId: null,
    pageSize: 50,
    pageNumber: 1,
  })

  const isLoadingCourses = ref(false)
  const getEmployees = async (filters: EmployeeFilters) => {
    try {
      const res = await employeeService.get(filters)
      employees.value = res.items.map((emp: Employee) => ({
        ...emp,
        empFullName: `${emp.empArFirstName} ${emp.empArSecondName} ${emp.empArThirdName} ${emp.empArFourthName}`,
      }))
    } catch (error) {
      return []
    }
  }
  return {
    employees,
    loading,
    getEmployees,
    filters,
  }
})
