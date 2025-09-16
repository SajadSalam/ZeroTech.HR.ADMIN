<script setup lang="ts">
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import AppTable from '~/components/app-table/AppTable.vue'
import { useCategoryStore } from '~/views/categories/store'
import { tableHeader } from '~/views/categories'
import CategoryCreate from '~/views/categories/components/CategoryCreate.vue'
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'
import CategoryEdit from '~/views/categories/components/CategoryEdit.vue'
import type { Category, CategoryDto, CategoryFilters } from '~/views/categories/types'
import { useAuthStore } from '~/views/auth/store/auth'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
definePageMeta({
  title: 'categories',
  description: 'create_and_manage_categories',
})

const categoryStore = useCategoryStore()
const appTableStore = useAppTableStore()
const isLoading = computed(() => categoryStore.isLoading)
const categories = computed(() => categoryStore.category || [])
const filters = computed<CategoryFilters>({
  get() {
    return categoryStore.filters
  },
  set(value) {
    categoryStore.filters = value
  },
})
const getCategory = async () => {
  appTableStore.setLoading(true)
  await categoryStore.getCategory()
  appTableStore.setLoading(false)
}
const deleteItem = async (item: CategoryDto) => {
  await categoryStore.deleteCategory(item.id)
}
getCategory()
watch(
  filters,
  () => {
    getCategory()
  },
  { deep: true }
)
const openEdit = (item: CategoryDto) => {}
const { hasPrivilege } = useAuthStore()
</script>

<template>
  <div>
    <AppCrud
      v-model:current-page="filters.pageNumber"
      :add-button-text="$t('add_new_category')"
      :add-btn-action="() => (categoryStore.isCreateDialogOpen = true)"
      :pagination="true"
      :total-pages="categoryStore.totalPages"
      :title="$t('categories')"
    >
      <template #filters>
        <BaseInput v-model="filters.name" :placeholder="$t('search')" />
      </template>
      <AppTable
        title="Categories"
        :headers="tableHeader($t)"
        :items="categories"
        :is-loading="isLoading"
      >
        <template #data-actions="{ item }">
          <AppCrudActions
            :item="item"
            :edit-button-action="
              () => {
                categoryStore.selectedCategory = item
                categoryStore.selectedCategoryId = item.id
                categoryStore.isEditDialogOpen = true
              }
            "
            :delete-service="categoryStore.deleteCategory"
          />
        </template>
      </AppTable>
    </AppCrud>
    <CategoryCreate />
    <CategoryEdit />
  </div>
</template>
