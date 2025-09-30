import type { BaseFilters } from '~/utils/types/ApiResponses'
import { BlueprintService } from '../service'
import type { Blueprint, BlueprintDto, BlueprintFilter, QuestionBankBlueprintDetails } from '../types'
const blueprintService = new BlueprintService()
export const useBlueprintStore = defineStore('blueprint', () => {
  const blueprints = ref<BlueprintDto[]>([])
  const isCreateDialogOpen = ref<boolean>(false)
  const totalPages = ref(0)
  const isLoading = ref(false)
  const filters = ref<BlueprintFilter>({
    pageSize: 10,
    pageNumber: 1,
    search: null,
    questionBankId: null,
    minGrade: null,
    maxGrade: null,
    subjectId: null,
    topicId: null,
  })
  const getBlueprints = async () => {
    try {
      isLoading.value = true

      const response = await blueprintService.get(filters.value)
      blueprints.value = response.data
      totalPages.value = response.pagesCount
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }
  const create = async (blueprint: Blueprint) => {
    try {
      isLoading.value = true
      await blueprintService.create(blueprint)
      await getBlueprints()
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }
  const deleteBlueprint = async (id: string) => {
    try {
      isLoading.value = true
      await blueprintService.delete(id)
      await getBlueprints()
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }
  const getById = async (id: string) => {
    try {
      isLoading.value = true
      return await blueprintService.getById(id)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const getQuestionBankBlueprintDetails = async (questionBankId: string): Promise<QuestionBankBlueprintDetails | null> => {
    try {
      isLoading.value = true
      return await blueprintService.getQuestionBankBlueprintDetails(questionBankId)
    } catch (error) {
      return null
    } finally {
      isLoading.value = false
    }
  }
  return {
    blueprints,
    isCreateDialogOpen,
    getBlueprints,
    isLoading,
    totalPages,
    filters,
    create,
    getById,
    deleteBlueprint,
    getQuestionBankBlueprintDetails,
  }
})
