import { workScheduleService } from '../service'
import type {
    UserAssignment,
    WorkScheduleCreateDto,
    WorkScheduleDto,
    WorkScheduleFilters,
    WorkScheduleUpdateDto
} from '../types'

export const useWorkScheduleStore = defineStore('workSchedule', () => {
  // State
  const workSchedules = ref<WorkScheduleDto[]>([])
  const isLoading = ref(false)
  const filters = ref<WorkScheduleFilters>({
    pageSize: 10,
    pageNumber: 1,
    name: null,
    isFlexible: null,
    isGeneralTemplate: null,
    specificUserId: null,
  })
  const isCreateDialogOpen = ref(false)
  const isEditDialogOpen = ref(false)
  const isUserAssignmentDialogOpen = ref(false)
  const selectedWorkScheduleId = ref<number | null>(null)
  const selectedWorkSchedule = ref<WorkScheduleDto | null>(null)
  const totalPages = ref(0)

  // Methods
  const getWorkSchedules = async () => {
    try {
      isLoading.value = true
      const response = await workScheduleService.get(filters.value)
      workSchedules.value = response.data
      totalPages.value = response.pagesCount
    } catch (error) {
      console.error('Error fetching work schedules:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getWorkScheduleById = async (id: number) => {
    try {
      isLoading.value = true
      const workSchedule = await workScheduleService.getById(id)
      return workSchedule
    } catch (error) {
      console.error('Error fetching work schedule by ID:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getTemplates = async () => {
    try {
      isLoading.value = true
      const response = await workScheduleService.getTemplates(filters.value)
      workSchedules.value = response.data
      totalPages.value = response.pagesCount
    } catch (error) {
      console.error('Error fetching work schedule templates:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const createWorkSchedule = async (data: WorkScheduleCreateDto) => {
    try {
      isLoading.value = true
      await workScheduleService.create(data)
      await getWorkSchedules()
    } catch (error) {
      console.error('Error creating work schedule:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateWorkSchedule = async (data: WorkScheduleUpdateDto) => {
    try {
      isLoading.value = true
      await workScheduleService.update(selectedWorkScheduleId.value!, data)
      await getWorkSchedules()
    } catch (error) {
      console.error('Error updating work schedule:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deleteWorkSchedule = async (id: number) => {
    try {
      isLoading.value = true
      await workScheduleService.delete(id)
      await getWorkSchedules()
    } catch (error) {
      console.error('Error deleting work schedule:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const assignUsers = async (id: number, assignments: UserAssignment[]) => {
    try {
      isLoading.value = true
      const result = await workScheduleService.assignUsers(id, assignments)
      await getWorkSchedules()
      return result
    } catch (error) {
      console.error('Error assigning users to work schedule:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const validateWorkSchedule = async (data: WorkScheduleCreateDto) => {
    try {
      const result = await workScheduleService.validate(data)
      return result
    } catch (error) {
      console.error('Error validating work schedule:', error)
      throw error
    }
  }

  const setSelectedWorkSchedule = (workSchedule: WorkScheduleDto) => {
    selectedWorkSchedule.value = workSchedule
    selectedWorkScheduleId.value = workSchedule.id
  }

  const resetSelectedWorkSchedule = () => {
    selectedWorkSchedule.value = null
    selectedWorkScheduleId.value = null
  }

  const openCreateDialog = () => {
    resetSelectedWorkSchedule()
    isCreateDialogOpen.value = true
  }

  const openEditDialog = (workSchedule: WorkScheduleDto) => {
    setSelectedWorkSchedule(workSchedule)
    isEditDialogOpen.value = true
  }

  const openUserAssignmentDialog = (workSchedule: WorkScheduleDto) => {
    setSelectedWorkSchedule(workSchedule)
    isUserAssignmentDialogOpen.value = true
  }

  const closeDialogs = () => {
    isCreateDialogOpen.value = false
    isEditDialogOpen.value = false
    isUserAssignmentDialogOpen.value = false
    resetSelectedWorkSchedule()
  }

  return {
    // State
    workSchedules,
    isLoading,
    filters,
    isCreateDialogOpen,
    isEditDialogOpen,
    isUserAssignmentDialogOpen,
    selectedWorkScheduleId,
    selectedWorkSchedule,
    totalPages,

    // Methods
    getWorkSchedules,
    getWorkScheduleById,
    getTemplates,
    createWorkSchedule,
    updateWorkSchedule,
    deleteWorkSchedule,
    assignUsers,
    validateWorkSchedule,
    setSelectedWorkSchedule,
    resetSelectedWorkSchedule,
    openCreateDialog,
    openEditDialog,
    openUserAssignmentDialog,
    closeDialogs,
  }
})
