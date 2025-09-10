import axios from '~/services/app-client/axios'
import type { BaseFilters, PaginatedResponse } from '~/utils/types/ApiResponses'
import type {
  AuditLogsUserActivity,
  AuditLogsUserActivityDto,
  AuditLogsUserActivityFilters,
} from '../types'

interface IAuditLogsUserActivityService {
  get: (
    filters: AuditLogsUserActivityFilters
  ) => Promise<PaginatedResponse<AuditLogsUserActivityDto>>
  create: (data: AuditLogsUserActivity) => Promise<AuditLogsUserActivityDto>
  update: (id: string, data: AuditLogsUserActivity) => Promise<AuditLogsUserActivityDto>
  delete: (id: string) => Promise<void>
}

export class AuditLogsUserActivityService implements IAuditLogsUserActivityService {
  async get(
    filters: AuditLogsUserActivityFilters
  ): Promise<PaginatedResponse<AuditLogsUserActivityDto>> {
    // const response = await axios.get<PaginatedResponse<EvaluatorPerformanceDto>>('/evaluator-reports', { params: filters });
    // return response.data;
    return {
      data: [
        {
          id: '1',
          userRole: 'Admin',
          date: '2025-03-01',
          actionType: 'Internal',
          deleted: false,
          creationDate: '2025-03-01',
        },
        {
          id: '2',
          userRole: 'Student',
          date: '2025-03-02',
          actionType: 'Internal',
          deleted: false,
          creationDate: '2025-03-02',
        },
        {
          id: '3',
          userRole: 'Teacher',
          date: '2025-03-03',
          actionType: 'Internal',
          deleted: false,
          creationDate: '2025-03-03',
        },
        {
          id: '4',
          userRole: 'Student',
          date: '2025-03-04',
          actionType: 'Internal',
          deleted: false,
          creationDate: '2025-03-05',
        },
        {
          id: '5',
          userRole: 'Student',
          date: '2025-03-06',
          actionType: 'Internal',
          deleted: false,
          creationDate: '2025-03-06',
        },
        {
          id: '6',
          userRole: 'Student',
          date: '2025-03-10',
          actionType: 'Internal',
          deleted: false,
          creationDate: '2025-03-10',
        },
        {
          id: '7',
          userRole: 'Student',
          date: '2025-03-12',
          actionType: 'Internal',
          deleted: false,
          creationDate: '2025-03-12',
        },
        {
          id: '8',
          userRole: 'Student',
          date: '2025-03-14',
          actionType: 'Internal',
          deleted: false,
          creationDate: '2025-03-14',
        },
        {
          id: '9',
          userRole: 'Student',
          date: '2025-03-16',
          actionType: 'Internal',
          deleted: false,
          creationDate: '2025-03-16',
        },
      ],
      pagesCount: 1,
      currentPage: 1,
      type: 'AuditLogsUserActivityDto',
    }
  }

  async create(data: AuditLogsUserActivity): Promise<AuditLogsUserActivityDto> {
    const response = await axios.post<AuditLogsUserActivityDto>('/audit-logs-user-activity', data)
    return response.data
  }

  async update(id: string, data: AuditLogsUserActivity): Promise<AuditLogsUserActivityDto> {
    const response = await axios.put<AuditLogsUserActivityDto>(
      '/audit-logs-user-activity/' + id,
      data
    )
    return response.data
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`/audit-logs-user-activity/${id}`)
  }
}
