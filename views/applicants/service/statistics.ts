import axiosIns from '~/services/app-client/axios'

export interface GenderStatisticsResponse {
  success: boolean
  message: string
  data: {
    chartData: Array<{
      label: string
      value: number
      percentage: string
    }>
    total: number
  }
}

export interface HepiqStatisticsResponse {
  success: boolean
  message: string
  data: {
    chartData: Array<{
      label: string
      value: number
    }>
    total: number
  }
}

export interface DailyStatisticsResponse {
  success: boolean
  message: string
  data: {
    chartData: Array<{
      date: string
      count: number
      formattedDate: string
    }>
    totalDays: number
    totalApplicants: number
    dateRange: {
      start: string
      end: string
    }
  }
}

interface IStatisticsService {
  getGenderStatistics: () => Promise<GenderStatisticsResponse>
  getHepiqStatistics: () => Promise<HepiqStatisticsResponse>
  getDailyStatistics: () => Promise<DailyStatisticsResponse>
}

/**
 * Service class for managing applicant statistics.
 * Implements the IStatisticsService interface.
 */
export class StatisticsService implements IStatisticsService {
  /**
   * Retrieves gender distribution statistics for pie chart.
   * @returns {Promise<GenderStatisticsResponse>} A promise that resolves to gender statistics data.
   */
  async getGenderStatistics(): Promise<GenderStatisticsResponse> {
    const response = await axiosIns.get('/applicants/statistics/gender')
    return response.data
  }

  /**
   * Retrieves HEPIQ vs Non-HEPIQ statistics for bar chart.
   * @returns {Promise<HepiqStatisticsResponse>} A promise that resolves to HEPIQ statistics data.
   */
  async getHepiqStatistics(): Promise<HepiqStatisticsResponse> {
    const response = await axiosIns.get('/applicants/statistics/hepiq')
    return response.data
  }

  /**
   * Retrieves daily registration statistics for line chart.
   * @returns {Promise<DailyStatisticsResponse>} A promise that resolves to daily statistics data.
   */
  async getDailyStatistics(): Promise<DailyStatisticsResponse> {
    const response = await axiosIns.get('/applicants/statistics/daily')
    return response.data
  }
}