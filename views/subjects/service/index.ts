import axios from '~/services/app-client/axios'
import type { BaseFilters, PaginatedResponse } from '~/utils/types/ApiResponses'
import type { Subject, SubjectDto, SubjectFilters } from '../types'

interface ISubjectService {
  get: (filters: SubjectFilters) => Promise<PaginatedResponse<SubjectDto>>
  create: (data: Subject) => Promise<SubjectDto>
  update: (id: string, data: Subject) => Promise<SubjectDto>
  delete: (id: string) => Promise<void>
}

/**
 * Service class for managing subjects.
 * Implements the ISubjectService interface.
 */
export class SubjectService implements ISubjectService {
  /**
   * Retrieves a paginated list of subjects based on the provided filters.
   * @param {SubjectFilters} filters - The filters to apply when retrieving subjects.
   * @returns {Promise<PaginatedResponse<SubjectDto>>} A promise that resolves to a paginated response containing the subjects.
   */
  async get(filters: SubjectFilters): Promise<PaginatedResponse<SubjectDto>> {
    const response = await axios.get<PaginatedResponse<SubjectDto>>('/subjects', {
      params: filters,
    })
    return response.data
  }

  /**
   * Creates a new subject.
   * @param {Subject} data - The data for the new subject.
   * @returns {Promise<SubjectDto>} A promise that resolves to the created subject.
   */
  async create(data: Subject): Promise<SubjectDto> {
    const response = await axios.post<SubjectDto>('/subjects', data)
    return response.data
  }

  /**
   * Updates an existing subject.
   * @param {string} id - The ID of the subject to update.
   * @param {Subject} data - The updated data for the subject.
   * @returns {Promise<SubjectDto>} A promise that resolves to the updated subject.
   */
  async update(id: string, data: Subject): Promise<SubjectDto> {
    const response = await axios.put<SubjectDto>('/subjects/' + id, data)
    return response.data
  }

  /**
   * Deletes a subject by its ID.
   * @param {string} id - The ID of the subject to delete.
   * @returns {Promise<void>} A promise that resolves when the subject is deleted.
   */
  async delete(id: string): Promise<void> {
    await axios.delete(`/subjects/${id}`)
  }
}
