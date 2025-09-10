import axios from '~/services/app-client/axios'
import type { BaseFilters, PaginatedResponse } from '~/utils/types/ApiResponses'
import type { QuestionBankReport, QuestionBankReportDto, QuestionBankReportFilters } from '../types'

interface IQuestionBankReportService {
  get: (filters: QuestionBankReportFilters) => Promise<PaginatedResponse<QuestionBankReportDto>>
  create: (data: QuestionBankReport) => Promise<QuestionBankReportDto>
  update: (id: string, data: QuestionBankReport) => Promise<QuestionBankReportDto>
  delete: (id: string) => Promise<void>
}

export class QuestionBankReportService implements IQuestionBankReportService {
  async get(filters: QuestionBankReportFilters): Promise<PaginatedResponse<QuestionBankReportDto>> {
    // const response = await axios.get<PaginatedResponse<QuestionBankReportDto>>('/question-bank-reports', { params: filters });
    // return response.data;
    return {
      data: [
        {
          id: '1',
          subject: 'Mathematics',
          totalQuestions: '100Q',
          questionsCreator: 'Alice Johnson',
          auditor: 'Michael Smith',
          status: 'active',
          deleted: false,
          creationDate: '2025-02-28',
        },
        {
          id: '2',
          subject: 'Physics',
          totalQuestions: '100Q',
          questionsCreator: 'Bob Williams',
          auditor: 'Sophia Brown',
          status: 'inactive',
          deleted: false,
          creationDate: '2025-03-01',
        },
        {
          id: '3',
          subject: 'Chemistry',
          totalQuestions: '100Q',
          questionsCreator: 'Charlie Davis',
          auditor: 'Emma Wilson',
          status: 'active',
          deleted: false,
          creationDate: '2025-03-02',
        },
        {
          id: '4',
          subject: 'Biology',
          totalQuestions: '100Q',
          questionsCreator: 'David Miller',
          auditor: 'Olivia Martinez',
          status: 'active',
          deleted: false,
          creationDate: '2025-03-03',
        },
        {
          id: '5',
          subject: 'History',
          totalQuestions: '100Q',
          questionsCreator: 'Emma Thomas',
          auditor: 'James Anderson',
          status: 'inactive',
          deleted: false,
          creationDate: '2025-03-04',
        },
      ],
      pagesCount: 1,
      currentPage: 1,
      type: 'QuestionBankReportDto',
    }
  }

  async create(data: QuestionBankReport): Promise<QuestionBankReportDto> {
    const response = await axios.post<QuestionBankReportDto>('/question-bank-reports', data)
    return response.data
  }

  async update(id: string, data: QuestionBankReport): Promise<QuestionBankReportDto> {
    const response = await axios.put<QuestionBankReportDto>('/question-bank-reports/' + id, data)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`/question-bank-reports/${id}`)
  }
}
