import { strapiClient } from '~/services/strapi'
import type { PaginatedResponse } from '~/utils/types/ApiResponses'
import type { Award, AwardDto, AwardFilters } from '../types'

interface IAwardService {
    get: (filters: AwardFilters) => Promise<PaginatedResponse<AwardDto>>
    create: (data: Award) => Promise<AwardDto>
    update: (id: string, data: Award) => Promise<AwardDto>
    delete: (id: string) => Promise<void>
}

/**
 * Service class for managing awards.
 * Implements the IAwardService interface.
 */
export class AwardService implements IAwardService {
    /**
     * Retrieves a paginated list of awards based on the provided filters.
     * @param {AwardFilters} _filters - The filters to apply when retrieving awards.
     * @returns {Promise<PaginatedResponse<AwardDto>>} A promise that resolves to a paginated response containing the awards.
     */
    async get(_filters: AwardFilters): Promise<PaginatedResponse<AwardDto>> {
        // remove empty filters
        const filters = Object.fromEntries(
            Object.entries(_filters).filter(([_, value]) => value !== null && value !== undefined)
        )
        const response = await strapiClient.collection('awards').find({
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
            populate: ['link_award_question'],
        })
        console.log(response)
        return {
            data: response.data as unknown as AwardDto[],
            pagesCount: response.meta.pagination?.pageCount ?? 0,
            currentPage: response.meta.pagination?.page ?? 0,
            type: 'awards',
        }
    }

    /**
     * Creates a new award.
     * @param {Award} data - The data for the new award.
     * @returns {Promise<AwardDto>} A promise that resolves to the created award.
     */
    async create(data: Award): Promise<AwardDto> {
        const response = await strapiClient.collection('awards').create(data)
        return response.data as unknown as AwardDto
    }

    /**
     * Updates an existing award.
     * @param {string} id - The ID of the award to update.
     * @param {Award} data - The updated data for the award.
     * @returns {Promise<AwardDto>} A promise that resolves to the updated award.
     */
    async update(id: string, data: Award): Promise<AwardDto> {
        const response = await strapiClient.collection('awards').update(id, data)
        return response.data as unknown as AwardDto
    }

    /**
     * Deletes an award by its ID.
     * @param {string} id - The ID of the award to delete.
     * @returns {Promise<void>} A promise that resolves when the award is deleted.
     */
    async delete(id: string): Promise<void> {
        await strapiClient.collection('awards').delete(id)
    }
}
