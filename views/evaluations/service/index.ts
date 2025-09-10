import axios from '~/services/app-client/axios'
import type { BaseFilters, PaginatedResponse } from '~/utils/types/ApiResponses'
import type { EvaluationDetialedDto, EvaluationDto } from '../types'

interface IEvaluationService {
  get: (filters: BaseFilters) => Promise<PaginatedResponse<EvaluationDto>>
  getDetialed: (examId: string, studentId: number) => Promise<EvaluationDetialedDto>
  excelDownload: (filters: BaseFilters) => Promise<Blob>
}

export class EvaluationService implements IEvaluationService {
  async get(filters: BaseFilters): Promise<PaginatedResponse<EvaluationDto>> {
    const response = await axios.get<PaginatedResponse<EvaluationDto>>('/exam/exams-grades', {
      params: filters,
    })
    return response.data
  }

  async getDetialed(examId: string, studentId: number): Promise<EvaluationDetialedDto> {
    const response = await axios.get<EvaluationDetialedDto>(
      `/exam/exams-grades/${examId}/student/${studentId}`
    )
    return response.data
  }
  async excelDownload(filters: BaseFilters): Promise<Blob> {
    try {
      const filteredFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined)
      )

      // Construct the query string with the filtered filters
      const queryParams = new URLSearchParams(filteredFilters as Record<string, string>).toString()
      const url = `exam/grades-excel?${queryParams}`

      // Make the POST request
      const response = await axios.post(
        url,
        {}, // Empty body since filters are in the query
        {
          responseType: 'blob', // Ensure the response is treated as a blob
        }
      )

      // Create a blob from the response data
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      // Create a download link and trigger download
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', 'grades.xlsx') // Better filename based on content
      document.body.appendChild(link)
      link.click()

      // Clean up
      window.URL.revokeObjectURL(downloadUrl)
      link.remove()

      return blob
    } catch (error) {
      throw error
    }
  }
}
