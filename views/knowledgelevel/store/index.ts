
import { KnowledgelevelService } from '../service'
import type { Knowledgelevel, KnowledgelevelDto, KnowledgelevelFilters } from '../types'

const knowledgelevelService = new KnowledgelevelService()
export const useKnowledgelevelStore = defineStore('knowledgelevel', () => {
  const knowledgelevels = ref<KnowledgelevelDto[]>([])
  const isLoading = ref(false)
  const filters = ref<KnowledgelevelFilters>({
    pageSize: 10,
    pageNumber: 1,
    name: null,
  })
  const isCreateDialogOpen = ref(false)
  const isEditDialogOpen = ref(false)
  const selectedKnowledgelevelId = ref<string | null>(null)
  const selectedKnowledgelevel = ref<KnowledgelevelDto | null>(null)
  const totalPages = ref(0)

  const getKnowledgelevels = async (knowledgelevelFilters: KnowledgelevelFilters) => {
    if(knowledgelevels.value.length > 0 && JSON.stringify(knowledgelevels.value) !== JSON.stringify(knowledgelevelFilters)) {
      filters.value = knowledgelevelFilters
      return knowledgelevels.value
    }
    try {
      isLoading.value = true
      const response = await knowledgelevelService.get(knowledgelevelFilters)
      filters.value = knowledgelevelFilters
      knowledgelevels.value = response.data.map((knowledgelevel) => ({
        ...knowledgelevel,
      }))
      totalPages.value = response.pagesCount
      return knowledgelevels.value
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const createKnowledgelevel = async (data: Knowledgelevel) => {
    try {
      isLoading.value = true
      await knowledgelevelService.create(data)
      await getKnowledgelevels(filters.value)
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateKnowledgelevel = async (data: Knowledgelevel) => {
    try {
      isLoading.value = true
      await knowledgelevelService.update(selectedKnowledgelevelId.value!, data)
      await getKnowledgelevels(filters.value)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const deleteKnowledgelevel = async (id: string) => {
    try {
      isLoading.value = true
      await knowledgelevelService.delete(id)
      await getKnowledgelevels(filters.value)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  return {
    knowledgelevels,
    isLoading,
    filters,
    getKnowledgelevels,
    createKnowledgelevel,
    updateKnowledgelevel,
    deleteKnowledgelevel,
    isCreateDialogOpen,
    isEditDialogOpen,
    selectedKnowledgelevelId,
    selectedKnowledgelevel,
    totalPages,
  }
})
