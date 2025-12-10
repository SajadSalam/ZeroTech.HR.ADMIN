import axiosIns from "~/services/app-client/axios";
import type { BaseFilters, PaginatedResponse } from "~/utils/types/ApiResponses";
import type { QuestionDto } from "../types";
import type { QuestionRequest } from "../types/request";

export interface QuestionFilters extends BaseFilters {
    search?: string | null
    questionBankId?: string | null
    topicId?: string | null
    questionType?: number | null
    difficulty?: number | null
}

export interface IQuestionService {
    get: (filters: QuestionFilters) => Promise<PaginatedResponse<QuestionDto>>
    getById: (id: string) => Promise<QuestionDto>
    create: (data: QuestionRequest) => Promise<QuestionDto>
    update: (id: string, data: QuestionRequest) => Promise<QuestionDto>
    delete: (id: string) => Promise<void>
}

export class QuestionService implements IQuestionService {
    async get(filters: QuestionFilters): Promise<PaginatedResponse<QuestionDto>> {
        const response = await axiosIns.get<PaginatedResponse<QuestionDto>>('/questions', {
            params: filters,
        })
        return response.data
    }

    async getById(id: string): Promise<QuestionDto> {
        const response = await axiosIns.get<QuestionDto>(`/questions/${id}`)
        return response.data
    }

    /**
     * Creates a new question.
     * @param data - The data for the new question.
     * @returns A promise that resolves to the created question data.
     */
    async create(data: QuestionRequest): Promise<QuestionDto> {
        const response = await axiosIns.post<QuestionDto>('/questions', data)
        return response.data
    }

    /**
     * Updates an existing question by its ID.
     * @param id - The ID of the question to update.
     * @param data - The updated data for the question.
     * @returns A promise that resolves to the updated question data.
     */
    async update(id: string, data: QuestionRequest): Promise<QuestionDto> {
        const response = await axiosIns.put<QuestionDto>(`/questions/${id}`, data)
        return response.data
    }

    /**
     * Deletes a question by its ID.
     * @param id - The ID of the question to delete.
     * @returns A promise that resolves when the question is deleted.
     */
    async delete(id: string): Promise<void> {
        await axiosIns.delete(`/questions/${id}`)
    }
}