import axios from '~/services/app-client/axios'
import type { BaseFilters, PaginatedResponse } from '~/utils/types/ApiResponses'
import type {
  CheatingFraudDetectionLogs,
  CheatingFraudDetectionLogsDto,
  CheatingFraudDetectionLogsFilters,
} from '../types'

interface ICheatingFraudDetectionLogsService {
  get: (
    filters: CheatingFraudDetectionLogsFilters
  ) => Promise<PaginatedResponse<CheatingFraudDetectionLogsDto>>
  create: (data: CheatingFraudDetectionLogs) => Promise<CheatingFraudDetectionLogsDto>
  update: (id: string, data: CheatingFraudDetectionLogs) => Promise<CheatingFraudDetectionLogsDto>
  delete: (id: string) => Promise<void>
}

export class CheatingFraudDetectionLogsService implements ICheatingFraudDetectionLogsService {
  async get(
    filters: CheatingFraudDetectionLogsFilters
  ): Promise<PaginatedResponse<CheatingFraudDetectionLogsDto>> {
    // const response = await axios.get<PaginatedResponse<EvaluatorPerformanceDto>>('/evaluator-reports', { params: filters });
    // return response.data;
    return {
      data: [
        {
          id: '1',
          studentId: '1',
          studentName: 'John',
          examName: 'Math Exam',
          violationType: 'Auto',
          timeStamp: '2025-03-01',
          status: 'flagged',
          deleted: false,
          creationDate: '2025-03-01',
        },
        {
          id: '2',
          studentId: '2',
          studentName: 'Alice',
          examName: 'Science Exam',
          violationType: 'Auto',
          timeStamp: '2025-03-01',
          status: 'flagged',
          deleted: false,
          creationDate: '2025-03-01',
        },
        {
          id: '3',
          studentId: '3',
          studentName: 'David',
          examName: 'History Test',
          violationType: 'Manual',
          timeStamp: '2025-03-01',
          status: 'under-review',
          deleted: false,
          creationDate: '2025-03-05',
        },
        {
          id: '4',
          studentId: '4',
          studentName: 'Emma',
          examName: 'Literature Exam',
          violationType: 'Manual',
          timeStamp: '2025-03-01',
          status: 'under-review',
          deleted: false,
          creationDate: '2025-03-10',
        },
        {
          id: '5',
          studentId: '5',
          studentName: 'Michael',
          examName: 'Geography Quiz',
          violationType: 'Auto',
          timeStamp: '2025-03-01',
          status: 'flagged',
          deleted: false,
          creationDate: '2025-03-10',
        },
        {
          id: '6',
          studentId: '6',
          studentName: 'Emma',
          examName: 'Literature Exam',
          violationType: 'Auto',
          timeStamp: '2025-03-01',
          status: 'flagged',
          deleted: false,
          creationDate: '2025-03-10',
        },
        {
          id: '7',
          studentId: '7',
          studentName: 'Michael',
          examName: 'Geography Quiz',
          violationType: 'Manual',
          timeStamp: '2025-03-01',
          status: 'flagged',
          deleted: false,
          creationDate: '2025-03-12',
        },
        {
          id: '8',
          studentId: '8',
          studentName: 'Michael',
          examName: 'Geography Quiz',
          violationType: 'Manual',
          timeStamp: '2025-03-01',
          status: 'under-review',
          deleted: false,
          creationDate: '2025-03-15',
        },
        {
          id: '9',
          studentId: '9',
          studentName: 'Michael',
          examName: 'Geography Quiz',
          violationType: 'Manual',
          timeStamp: '2025-03-01',
          status: 'under-review',
          deleted: false,
          creationDate: '2025-03-15',
        },
      ],
      pagesCount: 1,
      currentPage: 1,
      type: 'CheatingFraudDetectionLogsDto',
    }
  }

  async create(data: CheatingFraudDetectionLogs): Promise<CheatingFraudDetectionLogsDto> {
    const response = await axios.post<CheatingFraudDetectionLogsDto>(
      '/cheating-fraud-detection-logs',
      data
    )
    return response.data
  }

  async update(
    id: string,
    data: CheatingFraudDetectionLogs
  ): Promise<CheatingFraudDetectionLogsDto> {
    const response = await axios.put<CheatingFraudDetectionLogsDto>(
      '/cheating-fraud-detection-logs/' + id,
      data
    )
    return response.data
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`/cheating-fraud-detection-logs/${id}`)
  }
}
