import axiosIns from '~/services/app-client/axios'
import { strapiClient } from '~/services/strapi'
import type { PaginatedResponse } from '~/utils/types/ApiResponses'
import type { ApplicantDto, ApplicantFilters } from '../types'

interface ApplicantPaginatedResponse extends PaginatedResponse<ApplicantDto> {
  totalItems: number
}

export interface BulkOperationResponse {
  success: boolean
  message: string
  data: {
    successful: string[]
    failed: string[]
    totalProcessed: number
  }
}

interface IApplicantService {
  get: (filters: ApplicantFilters) => Promise<ApplicantPaginatedResponse>
  accept: (documentId: string) => Promise<void>
  reject: (documentId: string, reason: string) => Promise<void>
  bulkAccept: (applicantIds: string[]) => Promise<BulkOperationResponse>
  bulkReject: (applicantIds: string[], reason?: string) => Promise<BulkOperationResponse>
}

/**
 * Service class for managing applicants.
 * Implements the IApplicantService interface.
 */
export class ApplicantService implements IApplicantService {
  /**
   * Retrieves a paginated list of applicants based on the provided filters.
   * @param {ApplicantFilters} filters - The filters to apply when retrieving applicants.
   * @returns {Promise<ApplicantPaginatedResponse>} A promise that resolves to a paginated response containing the applicants.
   */
  async get(_filters: ApplicantFilters): Promise<ApplicantPaginatedResponse> {
    const filters = Object.fromEntries(
            Object.entries(_filters).filter(([_, value]) => value !== null && value !== undefined)
        )
        const response = await strapiClient.collection('applicants').find({
            filters: {
                ...filters,

                // remove pageSize & page from filters
                pageSize: undefined,
                pageNumber: undefined,
            },
            pagination: {
                page: _filters.pageNumber,
                pageSize: _filters.pageSize,
            },
            populate: {
                award:{
                    fields:['awardName']
                },
                university:{
                    fields:['label']
                },
                college:{
                    fields:['label']
                },
                department:{
                    fields:['label']
                }
            },
            sort: ['createdAt:desc'],
        })
        return {
            data: response.data as unknown as ApplicantDto[],
            pagesCount: response.meta.pagination?.pageCount ?? 0,
            currentPage: response.meta.pagination?.page ?? 0,
            type: 'applicants',
            totalItems: response.meta.pagination?.total ?? 0,
            pendingApplicants: response?.pendingApplicants ?? 0,
            acceptedApplicants: response?.acceptedApplicants ?? 0,
            rejectedApplicants: response?.rejectedApplicants ?? 0,
        }
  }

  /**
   * Accepts an applicant by their document ID.
   * @param {string} documentId - The document ID of the applicant to accept.
   * @returns {Promise<void>} A promise that resolves when the applicant is accepted.
   */
  async accept(documentId: string): Promise<void> {
    await axiosIns.post(`/applicants/${documentId}/accept`)
  }

  /**
   * Rejects an applicant by their document ID.
   * @param {string} documentId - The document ID of the applicant to reject.
   * @returns {Promise<void>} A promise that resolves when the applicant is rejected.
   */
  async reject(documentId: string, reason: string): Promise<void> {
    await axiosIns.post(`/applicants/${documentId}/reject`, { reason })
  }

  /**
   * Performs bulk accept operation on multiple applicants.
   * @param {string[]} applicantIds - Array of applicant document IDs to accept.
   * @returns {Promise<BulkOperationResponse>} A promise that resolves with the bulk operation results.
   */
  async bulkAccept(applicantIds: string[]): Promise<BulkOperationResponse> {
    const response = await axiosIns.post('/applicants-bulk/accept', { applicantIds })
    return response.data
  }

  /**
   * Performs bulk reject operation on multiple applicants.
   * @param {string[]} applicantIds - Array of applicant document IDs to reject.
   * @param {string} reason - Optional reason for rejection.
   * @returns {Promise<BulkOperationResponse>} A promise that resolves with the bulk operation results.
   */
  async bulkReject(applicantIds: string[], reason?: string): Promise<BulkOperationResponse> {
    const response = await axiosIns.post('/applicants-bulk/reject', { 
      applicantIds, 
      ...(reason && { reason })
    })
    return response.data
  }
} 