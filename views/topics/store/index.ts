import { TopicService } from '../service'
import type { Topic, TopicDto, TopicFilters } from '../types'

const topicService = new TopicService()
export const useTopicStore = defineStore('topic', () => {
  const topics = ref<TopicDto[]>([])
  const isLoading = ref(false)
  const filters = ref<TopicFilters>({
    pageSize: 50,
    pageNumber: 1,
    subjectId: null,
    name: null,
  })
  const isCreateDialogOpen = ref(false)
  const isEditDialogOpen = ref(false)
  const selectedTopicId = ref<string | null>(null)
  const selectedTopic = ref<TopicDto | null>(null)
  const totalPages = ref(0)

  const getTopics = async (topicFilters: TopicFilters) => {
    try {
      isLoading.value = true
      const response = await topicService.get(topicFilters)
      topics.value = response.data.map((topic) => ({
        ...topic,
        subjectId: topic.subject.id,
        subjectName: topic.subject.name,
      }))
      totalPages.value = response.pagesCount
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const createTopic = async (data: Topic) => {
    try {
      isLoading.value = true
      await topicService.create(data)
      await getTopics(filters.value)
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateTopic = async (data: Topic) => {
    try {
      isLoading.value = true
      await topicService.update(selectedTopicId.value!, data)
      await getTopics(filters.value)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  const deleteTopic = async (id: string) => {
    try {
      isLoading.value = true
      await topicService.delete(id)
      await getTopics(filters.value)
    } catch (error) {
    } finally {
      isLoading.value = false
    }
  }

  return {
    topics,
    isLoading,
    filters,
    getTopics,
    createTopic,
    updateTopic,
    deleteTopic,
    isCreateDialogOpen,
    isEditDialogOpen,
    selectedTopicId,
    selectedTopic,
    totalPages,
  }
})
