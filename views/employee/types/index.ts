export interface Employee {
  employeeId: number
  empArFirstName: string
  empArSecondName: string
  empArThirdName: string
  empArFourthName: string
  academicRank: null
  collegeId: number
  position: null
  empFullName: string
  name: string
}

export interface EmployeeFilters {
  search: string | null
  position: string | null
  courses: string[]
  collegeId: number | null
  pageSize: number
  pageNumber: number
}
