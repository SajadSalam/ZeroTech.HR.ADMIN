import { BlacklistService } from '../service'
import type { BlacklistDto, BlacklistFilters, UnblacklistRequest } from '../types'

const blacklistService = new BlacklistService()

export const useBlacklistStore = defineStore('blacklist', () => {
  const blacklistEntries = ref<BlacklistDto[]>([])
  const isLoading = ref(false)
  const filters = ref<BlacklistFilters>({
    pageSize: 50,
    pageNumber: 1,
    externalStudentName: null,
    examCenterName: null,
    isUnblacklisted: null,
  })
  const isUnblacklistDialogOpen = ref(false)
  const selectedBlacklistEntry = ref<BlacklistDto | null>(null)
  const totalPages = ref(0)

  const getBlacklistEntries = async () => {
    try {
      isLoading.value = true
      const response = await blacklistService.get(filters.value)
      blacklistEntries.value = response.data
      totalPages.value = response.pagesCount
    } catch (error) {
      // Handle error appropriately
    } finally {
      isLoading.value = false
    }
  }

  const unblacklistStudent = async (id: number, data: UnblacklistRequest) => {
    try {
      isLoading.value = true
      await blacklistService.unblacklist(id, data)
      await getBlacklistEntries() // Refresh the list
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    blacklistEntries,
    isLoading,
    filters,
    getBlacklistEntries,
    unblacklistStudent,
    isUnblacklistDialogOpen,
    selectedBlacklistEntry,
    totalPages,
  }
})