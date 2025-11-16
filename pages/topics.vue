<script setup lang="ts">
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import type { BaseFilters } from '~/utils/types/ApiResponses'
import AppTable from '~/components/app-table/AppTable.vue'
import { useTopicStore } from '~/views/topics/store'
import { tableHeader } from '~/views/topics'
import TopicCreate from '~/views/topics/components/TopicCreate.vue'
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'
import TopicEdit from '~/views/topics/components/TopicEdit.vue'
import type { Topic, TopicDto, TopicFilters } from '~/views/topics/types'
import { useAuthStore } from '~/views/auth/store/auth'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
definePageMeta({
  title: 'topics',
  description: 'create-and-manage-topics',
})

const topicStore = useTopicStore()
const appTableStore = useAppTableStore()
const isLoading = computed(() => topicStore.isLoading)
const topics = computed(() => topicStore.topics || [])
const filters = computed<TopicFilters>({
  get() {
    return topicStore.filters
  },
  set(value: TopicFilters) {
    topicStore.filters = value
  },
})
const getTopics = async () => {
  appTableStore.setLoading(true)
  await topicStore.getTopics(filters.value)
  appTableStore.setLoading(false)
}
getTopics()
watch(
  filters,
  () => {
    getTopics()
  },
  { deep: true }
)
const openEdit = (item: TopicDto) => {}

const deleteTopic = async (item: TopicDto) => {
  await topicStore.deleteTopic(item.id)
}
const { hasPrivilege } = useAuthStore()
</script>

<template>
  <div>
    <AppCrud
      v-model:current-page="filters.pageNumber"
      :add-button-text="$t('add-new-topic')"
      :add-btn-action="() => (topicStore.isCreateDialogOpen = true)"
      :pagination="true"
      :total-pages="topicStore.totalPages"
      :title="$t('topics')"
      :hide-create="!hasPrivilege('ums:ems:topics:create')"
    >
      <!-- Search filter -->
      <template #filters>
        <BaseInput v-model="filters.name" :placeholder="$t('search')" />
        <AppAutoCompleteField
         fetchOnSearch
          searchKey="name"
          :placeholder="$t('subject')"
          get-url="/subjects/lookup"
          without-data
          item-label="title"
          item-value="id"
          v-model="filters.subjectId"
        />
      </template>
      <AppTable title="Topics" :headers="tableHeader($t)" :items="topics" :is-loading="isLoading">
        <template #data-actions="data">
          <AppCrudActions
            :hide-delete="!hasPrivilege('ums:ems:topics:delete')"
            :hide-update="!hasPrivilege('ums:ems:topics:update')"
            :item="data.item"
            :edit-button-action="
              () => {
                topicStore.selectedTopic = data.item
                topicStore.selectedTopicId = data.item.id
                topicStore.isEditDialogOpen = true
              }
            "
            :delete-service="topicStore.deleteTopic"
          />
        </template>
      </AppTable>
    </AppCrud>
    <TopicCreate />
    <TopicEdit />
  </div>
</template>
