import { SubjectService } from '../service'
import type { Subject, SubjectDto, SubjectFilters } from '../types'

const subjectService = new SubjectService()
export const useSubjectStore = defineStore('subject', () => {
  const subjects = ref<SubjectDto[]>([])
  const isLoading = ref(false)
  const filters = ref<SubjectFilters>({
    pageSize: 10,
    pageNumber: 1,
    name: null,
  })
  const isCreateDialogOpen = ref(false)
  const isEditDialogOpen = ref(false)
  const selectedSubjectId = ref<string | null>(null)
  const selectedSubject = ref<SubjectDto | null>(null)
  const totalPages = ref(0)

  const getSubjects = async () => {
    try {
      isLoading.value = true
      const response = await subjectService.get(filters.value)
      subjects.value = response.data
      totalPages.value = response.pagesCount
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const createSubject = async (data: Subject) => {
    try {
      isLoading.value = true
      await subjectService.create(data)
      await getSubjects()
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateSubject = async (data: Subject) => {
    try {
      isLoading.value = true
      await subjectService.update(selectedSubjectId.value!, data)
      await getSubjects()
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const deleteSubject = async (id: string) => {
    try {
      isLoading.value = true
      await subjectService.delete(id)
      await getSubjects()
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  return {
    subjects,
    isLoading,
    filters,
    getSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
    isCreateDialogOpen,
    isEditDialogOpen,
    selectedSubjectId,
    selectedSubject,
    totalPages,
  }
})
