import type { BaseFilters } from '~/utils/types/ApiResponses'
import { GroupService } from '../service'
import type { Group, GroupCreate, GroupDto, GroupsFilters } from '../types'

const groupService = new GroupService()
export const useGroupStore = defineStore('group', () => {
  const groups = ref<GroupDto[]>([])
  const isLoading = ref(false)
  const filters = ref<GroupsFilters>({
    pageSize: 10,
    pageNumber: 1,
    orginizations: null,
    search: null,
  })
  const isCreateDialogOpen = ref(false)
  const isEditDialogOpen = ref(false)
  const selectedGroupId = ref<string | null>(null)
  const selectedGroup = ref<GroupDto | null>(null)
  const totalPages = ref(0)

  const getGroups = async (groupFilters: BaseFilters) => {
    try {
      isLoading.value = true
      const response = await groupService.get(groupFilters)
      groups.value = response.data
      totalPages.value = response.pagesCount
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const createGroup = async (data: Group) => {
    try {
      isLoading.value = true
      await groupService.create(data)
      await getGroups(filters.value)
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }
  const updateGroup = async (data: GroupCreate) => {
    try {
      isLoading.value = true
      await groupService.update(selectedGroupId.value as string, data)
      await getGroups(filters.value)
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deleteGroup = async (id: string) => {
    try {
      isLoading.value = true
      await groupService.delete(id)
      await getGroups(filters.value)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  return {
    groups,
    isLoading,
    filters,
    getGroups,
    createGroup,
    deleteGroup,
    isCreateDialogOpen,
    isEditDialogOpen,
    selectedGroupId,
    selectedGroup,
    totalPages,
    updateGroup,
  }
})
