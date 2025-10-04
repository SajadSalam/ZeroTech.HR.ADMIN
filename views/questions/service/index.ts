import axios from '~/services/app-client/axios'
import { strapiClient } from '~/services/strapi'
import type { PaginatedResponse } from '~/utils/types/ApiResponses'
import type { Question, QuestionDto, QuestionFilters } from '../types'

interface IQuestionService {
    get: (filters: QuestionFilters) => Promise<PaginatedResponse<QuestionDto>>
    create: (data: Question) => Promise<QuestionDto>
    update: (id: string, data: Question) => Promise<QuestionDto>
    delete: (id: string) => Promise<void>
    importQuestions: (file: string) => Promise<void>
    multipleUpdate: (link_award_question: string, questionIds: string[]) => Promise<QuestionDto[]>
}

/**
 * Service class for managing questions.
 * Implements the IQuestionService interface.
 */
export class QuestionService implements IQuestionService {
    /**
     * Retrieves a paginated list of questions based on the provided filters.
     * @param {QuestionFilters} _filters - The filters to apply when retrieving questions.
     * @returns {Promise<PaginatedResponse<QuestionDto>>} A promise that resolves to a paginated response containing the questions.
     */
    async get(_filters: QuestionFilters): Promise<PaginatedResponse<QuestionDto>> {
        // remove empty filters
        const filters = Object.fromEntries(
            Object.entries(_filters).filter(([_, value]) => value !== null && value !== undefined)
        )
        const response = await strapiClient.collection('questions').find({
            filters: {
                ...filters,

                // remove pageSize & page from filters
                pageSize: undefined,
                pageNumber: undefined,
                page: undefined,
            },
            pagination: {
                page: _filters.pageNumber,
                pageSize: _filters.pageSize,
            },
            populate: {
                options: {
                    fields: ['title', 'isTrueAnswer'],
                },
                link_award_question: {
                    populate: 'award'
                }
            },
        })
        console.log(response)
        return {
            data: response.data as unknown as QuestionDto[],
            pagesCount: response.meta.pagination?.pageCount ?? 0,
            currentPage: response.meta.pagination?.page ?? 0,
            type: 'questions',
        }
    }

    /**
     * Creates a new question.
     * @param {Question} data - The data for the new question.
     * @returns {Promise<QuestionDto>} A promise that resolves to the created question.
     */
    async create(data: Question): Promise<QuestionDto> {
        const response = await strapiClient.collection('questions').create(data)
        return response.data as unknown as QuestionDto
    }

    /**
     * Updates an existing question.
     * @param {string} id - The ID of the question to update.
     * @param {Question} data - The updated data for the question.
     * @returns {Promise<QuestionDto>} A promise that resolves to the updated question.
     */
    async update(id: string, data: Question): Promise<QuestionDto> {
        const response = await strapiClient.collection('questions').update(id, data)
        return response.data as unknown as QuestionDto
    }

    /**
     * Deletes a question by its ID.
     * @param {string} id - The ID of the question to delete.
     * @returns {Promise<void>} A promise that resolves when the question is deleted.
     */
    async delete(id: string): Promise<void> {
        await strapiClient.collection('questions').delete(id)
    }


    async importQuestions(file: string): Promise<void> {
        const response = await axios.post('/questions/add-by-excel', {
            file,
        },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': undefined
                },
            }
        )
        return response.data
    }

    async multipleUpdate(link_award_question: string, questionIds: string[]): Promise<QuestionDto[]> {
        const response = await axios.post('/questions/multi', {
            questionIds,
            link_award_question
        })
        return response.data as unknown as QuestionDto[]
    }
}
