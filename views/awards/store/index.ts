import { AwardService } from '../service'
import type { Award, AwardDto, AwardFilters } from '../types'

const awardService = new AwardService()
export const useAwardStore = defineStore('award', () => {
    const awards = ref<AwardDto[]>([])
    const isLoading = ref(false)
    const filters = ref<AwardFilters>({
        pageSize: 10,
        pageNumber: 1,
        awardName: null,
        awardStatus: null,
        academicYear: null,
    })
    const isCreateDialogOpen = ref(false)
    const isEditDialogOpen = ref(false)
    const isLinkQuestionsDialogOpen = ref(false)
    const selectedAwardId = ref<string | null>(null)
    const selectedAward = ref<AwardDto | null>(null)
    const totalPages = ref(0)

    const getAwards = async () => {
        try {
            isLoading.value = true
            const response = await awardService.get(filters.value)
            awards.value = response.data
            totalPages.value = response.pagesCount
        } catch (error) {
        } finally {
            isLoading.value = false
        }
    }

    const createAward = async (data: Award) => {
        try {
            isLoading.value = true
            data.publishedAt = new Date().toISOString()
            await awardService.create(data)
            await getAwards()
        } catch (error) {
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const updateAward = async (data: Award) => {
        try {
            isLoading.value = true
            data.publishedAt = new Date().toISOString()
            await awardService.update(selectedAwardId.value!, data)
            await getAwards()
        } catch (error) {
        } finally {
            isLoading.value = false
        }
    }

    const deleteAward = async (id: string) => {
        console.log('sdfsdgd')

        try {
            isLoading.value = true
            await awardService.delete(id)
            await getAwards()
        } catch (error) {
        } finally {
            isLoading.value = false
        }
    }

    return {
        awards,
        isLoading,
        filters,
        getAwards,
        createAward,
        updateAward,
        deleteAward,
        isCreateDialogOpen,
        isEditDialogOpen,
        selectedAwardId,
        selectedAward,
        totalPages,
        isLinkQuestionsDialogOpen,
    }
})
