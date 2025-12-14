import { BlueprintService } from '../service'
import type { BlueprintCreate, BlueprintDto, BlueprintFilter } from '../types'
const blueprintService = new BlueprintService()
export const useBlueprintStore = defineStore('blueprint', () => {
  const blueprints = ref<BlueprintDto[]>([])
  const totalPages = ref(0)
  const isLoading = ref(false)
  const filters = ref<BlueprintFilter>({
    page: 1,
    pageSize: 50,
    search: null,
    questionBankId: null,
    successGrade: null,
    fullGrade: null,
    topicId: null,
  })
  const getBlueprints = async () => {
    try {
      isLoading.value = true

      const response = await blueprintService.get(filters.value)
      blueprints.value = response.items
      totalPages.value = response.pageCount
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }
  const create = async (blueprint: BlueprintCreate) => {
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

  const update = async (id: string, blueprint: BlueprintCreate) => {
    try {
      isLoading.value = true
      await blueprintService.update(id, blueprint)
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
  

  return {
    blueprints,
    getBlueprints,
    isLoading,
    totalPages,
    filters,
    create,
    update,
    getById,
    deleteBlueprint,
  }
})
