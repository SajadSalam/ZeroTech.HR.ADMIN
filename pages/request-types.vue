<script setup lang="ts">
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import AppTable from '~/components/app-table/AppTable.vue'
import { useRequestTypeStore } from '~/views/request-types/store'
import { tableHeader } from '~/views/request-types'
import RequestTypeCreate from '~/views/request-types/components/RequestTypeCreate.vue'
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'
import RequestTypeEdit from '~/views/request-types/components/RequestTypeEdit.vue'
import type { RequestTypeDto, RequestTypeFilters } from '~/views/request-types/types'
import { useAuthStore } from '~/views/auth/store/auth'

definePageMeta({
  title: 'أنواع الطلبات',
  description: 'إنشاء وإدارة أنواع الطلبات',
})

const requestTypeStore = useRequestTypeStore()
const appTableStore = useAppTableStore()
const isLoading = computed(() => requestTypeStore.isLoading)
const requestTypes = computed(() => requestTypeStore.requestTypes || [])
const filters = computed<RequestTypeFilters>({
  get() {
    return requestTypeStore.filters
  },
  set(value) {
    requestTypeStore.filters = value
  },
})

const getRequestTypes = async () => {
  appTableStore.setLoading(true)
  await requestTypeStore.getRequestTypes()
  appTableStore.setLoading(false)
}

getRequestTypes()
watch(
  filters,
  () => {
    getRequestTypes()
  },
  { deep: true }
)

</script>

<template>
  <div>
    <AppCrud
      add-button-text="إضافة نوع طلب جديد"
      :add-btn-action="() => (requestTypeStore.isCreateDialogOpen = true)"
      :pagination="true"
      :total-pages="requestTypeStore.totalPages"
      title="أنواع الطلبات"
      @update:current-page="filters.pageNumber = $event"
    >
      <template #filters>
        <BaseInput v-model="filters.name" placeholder="البحث" />
        <AppAutoCompleteField
          v-model="filters.categoryId"
          placeholder="الفئة"
          get-url="/categories"
          item-label="name"
          item-value="id"
        />
        <BaseSelect v-model="filters.isEnabled" placeholder="الحالة">
          <option value="">جميع الحالات</option>
          <option :value="true">مفعل</option>
          <option :value="false">غير مفعل</option>
        </BaseSelect>
      </template>
      <AppTable
        title="أنواع الطلبات"
        :headers="tableHeader()"
        :items="requestTypes"
        :is-loading="isLoading"
      >
        <template #data-name="{ item }">
          <div class="flex items-center gap-3">
            <div
              v-if="item.colorCode"
              class="w-4 h-4 rounded-full border"
              :style="{ backgroundColor: item.colorCode }"
            ></div>
            <div class="flex flex-col">
              <span class="font-medium text-muted-800 dark:text-muted-100">
                {{ item.name }}
              </span>
              <span v-if="item.description" class="text-xs text-muted-500">
                {{ item.description }}
              </span>
            </div>
          </div>
        </template>

        <template #data-code="{ item }">
          <BaseBadge color="primary" variant="pastel" size="sm">
            {{ item.code }}
          </BaseBadge>
        </template>

        <template #data-category="{ item }">
          <span class="text-muted-800 dark:text-muted-100">
            {{ item.category?.name }}
          </span>
        </template>

        <template #data-isEnabled="{ item }">
          <BaseBadge
            :color="item.isEnabled ? 'success' : 'danger'"
            variant="pastel"
            size="sm"
          >
            {{ item.isEnabled ? 'مفعل' : 'غير مفعل' }}
          </BaseBadge>
        </template>

        <template #data-requiresApproval="{ item }">
          <div class="flex items-center justify-center">
            <Icon
              :name="item.requiresApproval ? 'ph:check-circle-duotone' : 'ph:x-circle-duotone'"
              :class="item.requiresApproval ? 'text-success-500' : 'text-danger-500'"
              class="size-5"
            />
          </div>
        </template>

        <template #data-affectsAttendance="{ item }">
          <div class="flex items-center justify-center">
            <Icon
              :name="item.affectsAttendance ? 'ph:check-circle-duotone' : 'ph:x-circle-duotone'"
              :class="item.affectsAttendance ? 'text-success-500' : 'text-danger-500'"
              class="size-5"
            />
          </div>
        </template>

        <template #data-isPaidTime="{ item }">
          <div class="flex items-center justify-center">
            <Icon
              :name="item.isPaidTime ? 'ph:check-circle-duotone' : 'ph:x-circle-duotone'"
              :class="item.isPaidTime ? 'text-success-500' : 'text-danger-500'"
              class="size-5"
            />
          </div>
        </template>

        <template #data-actions="{ item }">
          <AppCrudActions
            :item="item"
            :edit-button-action="
              () => {
                requestTypeStore.selectedRequestType = item
                requestTypeStore.selectedRequestTypeId = item.id
                requestTypeStore.isEditDialogOpen = true
              }
            "
            :delete-service="requestTypeStore.deleteRequestType"
          />
        </template>
      </AppTable>
    </AppCrud>
    <RequestTypeCreate />
    <RequestTypeEdit />
  </div>
</template>
