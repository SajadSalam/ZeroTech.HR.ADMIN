import type {
    DailyStatisticsResponse,
    GenderStatisticsResponse,
    HepiqStatisticsResponse
} from '../service/statistics'
import { StatisticsService } from '../service/statistics'

const statisticsService = new StatisticsService()

export const useStatisticsStore = defineStore('statistics', () => {
  // State for gender statistics
  const genderData = ref<GenderStatisticsResponse['data'] | null>(null)
  const isGenderLoading = ref(false)
  const genderError = ref<string | null>(null)

  // State for HEPIQ statistics
  const hepiqData = ref<HepiqStatisticsResponse['data'] | null>(null)
  const isHepiqLoading = ref(false)
  const hepiqError = ref<string | null>(null)

  // State for daily statistics
  const dailyData = ref<DailyStatisticsResponse['data'] | null>(null)
  const isDailyLoading = ref(false)
  const dailyError = ref<string | null>(null)

  // Actions for gender statistics
  const fetchGenderStatistics = async () => {
    try {
      isGenderLoading.value = true
      genderError.value = null
      const response = await statisticsService.getGenderStatistics()
      genderData.value = response.data
    } catch (error: any) {
      genderError.value = error.response?.data?.message || 'Failed to fetch gender statistics'
      console.error('Error fetching gender statistics:', error)
    } finally {
      isGenderLoading.value = false
    }
  }

  // Actions for HEPIQ statistics
  const fetchHepiqStatistics = async () => {
    try {
      isHepiqLoading.value = true
      hepiqError.value = null
      const response = await statisticsService.getHepiqStatistics()
      hepiqData.value = response.data
    } catch (error: any) {
      hepiqError.value = error.response?.data?.message || 'Failed to fetch HEPIQ statistics'
      console.error('Error fetching HEPIQ statistics:', error)
    } finally {
      isHepiqLoading.value = false
    }
  }

  // Actions for daily statistics
  const fetchDailyStatistics = async () => {
    try {
      isDailyLoading.value = true
      dailyError.value = null
      const response = await statisticsService.getDailyStatistics()
      dailyData.value = response.data
    } catch (error: any) {
      dailyError.value = error.response?.data?.message || 'Failed to fetch daily statistics'
      console.error('Error fetching daily statistics:', error)
    } finally {
      isDailyLoading.value = false
    }
  }

  // Action to fetch all statistics
  const fetchAllStatistics = async () => {
    await Promise.all([
      fetchGenderStatistics(),
      fetchHepiqStatistics(),
      fetchDailyStatistics(),
    ])
  }

  // Computed values for chart readiness
  const isAnyLoading = computed(() => 
    isGenderLoading.value || isHepiqLoading.value || isDailyLoading.value
  )

  const hasAnyError = computed(() => 
    genderError.value || hepiqError.value || dailyError.value
  )

  return {
    // Gender state
    genderData,
    isGenderLoading,
    genderError,
    
    // HEPIQ state
    hepiqData,
    isHepiqLoading,
    hepiqError,
    
    // Daily state
    dailyData,
    isDailyLoading,
    dailyError,
    
    // Actions
    fetchGenderStatistics,
    fetchHepiqStatistics,
    fetchDailyStatistics,
    fetchAllStatistics,
    
    // Computed
    isAnyLoading,
    hasAnyError,
  }
})