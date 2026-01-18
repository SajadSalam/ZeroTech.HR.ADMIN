<script setup lang="ts">
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import AppTable from '~/components/app-table/AppTable.vue'
import { useRequestCategoryStore } from '~/views/request-categories/store'
import { tableHeader } from '~/views/request-categories'
import RequestCategoryCreate from '~/views/request-categories/components/RequestCategoryCreate.vue'
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'
import RequestCategoryEdit from '~/views/request-categories/components/RequestCategoryEdit.vue'
import type { RequestCategoryDto, RequestCategoryFilters } from '~/views/request-categories/types'
import { useAuthStore } from '~/views/auth/store/auth'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'

definePageMeta({
  title: 'فئات الطلبات',
  description: 'إدارة فئات الطلبات في النظام',
})

const requestCategoryStore = useRequestCategoryStore()
const appTableStore = useAppTableStore()

const isLoading = computed(() => requestCategoryStore.isLoading)
const requestCategories = computed(() => requestCategoryStore.requestCategories || [])
const filters = computed<RequestCategoryFilters>({
  get() {
    return requestCategoryStore.filters
  },
  set(value) {
    requestCategoryStore.filters = value
  },
})

const getRequestCategories = async () => {
  appTableStore.setLoading(true)
  await requestCategoryStore.getRequestCategories()
  appTableStore.setLoading(false)
}

getRequestCategories()
watch(filters, () => { getRequestCategories() }, { deep: true })
</script>

<template>
  <div>
    <AppCrud
      add-button-text="إضافة فئة جديدة"
      :add-btn-action="() => (requestCategoryStore.isCreateDialogOpen = true)"
      :pagination="true"
      :total-pages="requestCategoryStore.totalPages"
      title="فئات الطلبات"
      @update:current-page="filters.pageNumber = $event"
    >
      <template #filters>
        <BaseInput 
          v-model="filters.name" 
          placeholder="البحث بالاسم" 
        />
        <AppAutoCompleteField
          v-model="filters.isEnabled"
          placeholder="الحالة"
          :items="[{ value: true, label: 'مفعل' }, { value: false, label: 'غير مفعل' }]"
          item-label="label"
          item-value="value"
        />
      </template>
      
      <AppTable
        title="قائمة فئات الطلبات"
        :headers="tableHeader()"
        :items="requestCategories"
        :is-loading="isLoading"
      >
        <template #data-name="{ item }">
          <div class="flex items-center gap-3">
            <div 
              class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
              :style="{ backgroundColor: item.colorCode || '#4CAF50' }"
            >
              <Icon 
                :name="item.iconClass || 'fas fa-folder'" 
                class="size-4"
              />
            </div>
            <div>
              <div class="font-medium text-muted-800 dark:text-muted-100">
                {{ item.name }}
              </div>
              <div class="text-sm text-muted-500">
                {{ item.code }}
              </div>
            </div>
          </div>
        </template>

        <template #data-code="{ item }">
          <BaseTag
            color="primary"
            variant="pastel"
            size="sm"
          >
            {{ item.code }}
          </BaseTag>
        </template>

        <template #data-description="{ item }">
          <div class="max-w-xs truncate" :title="item.description">
            {{ item.description || '-' }}
          </div>
        </template>

        <template #data-colorCode="{ item }">
          <div class="flex items-center gap-2">
            <div 
              class="w-6 h-6 rounded border border-muted-200 dark:border-muted-700"
              :style="{ backgroundColor: item.colorCode || '#4CAF50' }"
            />
            <span class="text-sm text-muted-600 dark:text-muted-400">
              {{ item.colorCode || '-' }}
            </span>
          </div>
        </template>

        <template #data-iconClass="{ item }">
          <div class="flex items-center gap-2">
            <Icon 
              :name="item.iconClass || 'fas fa-folder'" 
              class="size-4 text-muted-600 dark:text-muted-400"
            />
            <span class="text-sm text-muted-600 dark:text-muted-400">
              {{ item.iconClass || '-' }}
            </span>
          </div>
        </template>

        <template #data-displayOrder="{ item }">
          <BaseBadge
            color="muted"
            variant="pastel"
            size="sm"
          >
            {{ item.displayOrder || 0 }}
          </BaseBadge>
        </template>

        <template #data-requestTypeCount="{ item }">
          <BaseBadge
            color="info"
            variant="pastel"
            size="sm"
          >
            {{ item.requestTypeCount || 0 }}
          </BaseBadge>
        </template>

        <template #data-isEnabled="{ item }">
          <BaseBadge
            :color="item.isEnabled ? 'success' : 'muted'"
            variant="pastel"
            size="sm"
          >
            {{ item.isEnabled ? 'مفعل' : 'غير مفعل' }}
          </BaseBadge>
        </template>

        <template #data-actions="{ item }">
          <AppCrudActions
            :item="item"
            :edit-button-action="() => {
              requestCategoryStore.selectedRequestCategory = item
              requestCategoryStore.selectedRequestCategoryId = item.id
              requestCategoryStore.isEditDialogOpen = true
            }"
            :delete-service="requestCategoryStore.deleteRequestCategory"
          />
        </template>
      </AppTable>
    </AppCrud>
    
    <RequestCategoryCreate />
    <RequestCategoryEdit />
  </div>
</template>
