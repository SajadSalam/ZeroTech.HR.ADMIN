import axios from '~/services/app-client/axios'
import type { BaseFilters, PaginatedResponse } from '~/utils/types/ApiResponses'
import type {
  EvaluatorPerformance,
  EvaluatorPerformanceDto,
  EvaluatorPerformanceFilters,
} from '../types'

interface IEvaluatorPerformanceService {
  get: (filters: EvaluatorPerformanceFilters) => Promise<PaginatedResponse<EvaluatorPerformanceDto>>
  create: (data: EvaluatorPerformance) => Promise<EvaluatorPerformanceDto>
  update: (id: string, data: EvaluatorPerformance) => Promise<EvaluatorPerformanceDto>
  delete: (id: string) => Promise<void>
}

export class EvaluatorPerformanceService implements IEvaluatorPerformanceService {
  async get(
    filters: EvaluatorPerformanceFilters
  ): Promise<PaginatedResponse<EvaluatorPerformanceDto>> {
    // const response = await axios.get<PaginatedResponse<EvaluatorPerformanceDto>>('/evaluator-reports', { params: filters });
    // return response.data;
    return {
      data: [
        {
          id: '1',
          fullName: 'John',
          examName: 'Math Exam',
          nationalId: '1234567890',
          email: 'john@example.com',
          phoneNumber: '1234567890',
          gender: 'Male',
          type: 'internal',
          colleage: 'Engineering',
          department: 'Computer Science',
          stage: 'First',
          grade: '70',
          status: 'active',
          deleted: false,
          creationDate: '2025-03-01',
        },
        {
          id: '2',
          fullName: 'Alice',
          examName: 'Science Exam',
          nationalId: '1234567890',
          email: 'alice@example.com',
          phoneNumber: '1234567890',
          gender: 'Female',
          type: 'internal',
          colleage: 'Engineering',
          department: 'Computer Science',
          stage: 'Second',
          grade: '80',
          status: 'active',
          deleted: false,
          creationDate: '2025-03-05',
        },
        {
          id: '3',
          fullName: 'David',
          examName: 'History Test',
          nationalId: '1234567890',
          email: 'david@example.com',
          phoneNumber: '1234567890',
          gender: 'Male',
          type: 'external',
          colleage: 'Engineering',
          department: 'Computer Science',
          stage: 'Third',
          grade: '90',
          status: 'active',
          deleted: true,
          creationDate: '2025-03-10',
        },
        {
          id: '4',
          fullName: 'Emma',
          examName: 'Literature Exam',
          nationalId: '1234567890',
          email: 'emma@example.com',
          phoneNumber: '1234567890',
          gender: 'Female',
          type: 'external',
          colleage: 'Engineering',
          department: 'Computer Science',
          stage: 'Fourth',
          grade: '50',
          status: 'active',
          deleted: false,
          creationDate: '2025-03-12',
        },
        {
          id: '5',
          fullName: 'Michael',
          examName: 'Geography Quiz',
          nationalId: '1234567890',
          email: 'michael@example.com',
          phoneNumber: '1234567890',
          gender: 'Male',
          type: 'external',
          colleage: 'Engineering',
          department: 'Computer Science',
          stage: 'Fifth',
          grade: '60',
          status: 'inactive',
          deleted: false,
          creationDate: '2025-03-15',
        },
      ],
      pagesCount: 1,
      currentPage: 1,
      type: 'EvaluatorPerformanceDto',
    }
  }

  async create(data: EvaluatorPerformance): Promise<EvaluatorPerformanceDto> {
    const response = await axios.post<EvaluatorPerformanceDto>('/evaluator-reports', data)
    return response.data
  }

  async update(id: string, data: EvaluatorPerformance): Promise<EvaluatorPerformanceDto> {
    const response = await axios.put<EvaluatorPerformanceDto>('/evaluator-reports/' + id, data)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`/evaluator-reports/${id}`)
  }
}
