import { HallService } from '../service'
import type { Hall, HallDto, HallFilters, Supervisor } from '../types'

const hallService = new HallService()
export const useHallStore = defineStore('hall', () => {
  const halls = ref<HallDto[]>([])
  const isLoading = ref(false)
  const filters = ref<HallFilters>({
    pageSize: 50,
    pageNumber: 1,
    examCenterId: null,
    name: null,
  })
  const isCreateDialogOpen = ref(false)
  const isEditDialogOpen = ref(false)
  const selectedHallId = ref<string | null>(null)
  const selectedHall = ref<HallDto | null>(null)
  const isAssignSupervisorDialogOpen = ref(false)
  const totalPages = ref(0)

  const getHalls = async (hallFilters: HallFilters) => {
    try {
      isLoading.value = true
      const response = await hallService.get(hallFilters)
      halls.value = response.data.map((hall) => ({
        ...hall,
        // examCenterId: hall.examCenter.id,
        // examCenterName: hall.examCenter.name,
      }))
      totalPages.value = response.pagesCount
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const createHall = async (data: Hall) => {
    try {
      isLoading.value = true
      await hallService.create(data)
      await getHalls(filters.value)
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateHall = async (data: Hall) => {
    try {
      isLoading.value = true
      await hallService.update(selectedHallId.value!, data)
      await getHalls(filters.value)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const deleteHall = async (id: string) => {
    try {
      isLoading.value = true
      await hallService.delete(id)
      await getHalls(filters.value)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const assignSupervisor = async (id: string, data: { supervisorId: string }) => {
    try {
      isLoading.value = true
      await hallService.assignSupervisor(id, data)
      await getHalls(filters.value)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const assignMultipleSupervisors = async (id: string, data: { supervisors: Supervisor[] }) => {
    try {
      isLoading.value = true
      await hallService.assignMultipleSupervisors(id, data)
      await getHalls(filters.value)
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    halls,
    isLoading,
    filters,
    getHalls,
    createHall,
    updateHall,
    deleteHall,
    isCreateDialogOpen,
    isEditDialogOpen,
    selectedHallId,
    selectedHall,
    totalPages,
    isAssignSupervisorDialogOpen,
    assignSupervisor,
    assignMultipleSupervisors,
  }
})
