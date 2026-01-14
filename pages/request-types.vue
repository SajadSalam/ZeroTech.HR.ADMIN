<script setup lang="ts">
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import AppTable from '~/components/app-table/AppTable.vue'
import { useRequestTypeStore } from '~/views/request-types/store'
import { tableHeader } from '~/views/request-types'
import RequestTypeCreate from '~/views/request-types/components/RequestTypeCreate.vue'
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'
import RequestTypeEdit from '~/views/request-types/components/RequestTypeEdit.vue'
import RequestTypeDetail from '~/views/request-types/components/RequestTypeDetail.vue'
import AvailabilityChecker from '~/views/request-types/components/AvailabilityChecker.vue'
import CategoryView from '~/views/request-types/components/CategoryView.vue'
import type { RequestTypeDto, RequestTypeFilters } from '~/views/request-types/types'
import { useAuthStore } from '~/views/auth/store/auth'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'

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

const activeView = ref<'list' | 'categories' | 'availability' | 'detail'>('list')
const selectedRequestTypeId = ref<number | null>(null)
const showEnabledOnly = ref(false)

const getRequestTypes = async () => {
  appTableStore.setLoading(true)
  if (showEnabledOnly.value) {
    await requestTypeStore.getEnabledRequestTypes()
  } else {
    await requestTypeStore.getRequestTypes()
  }
  appTableStore.setLoading(false)
}

const toggleEnabledOnly = async () => {
  showEnabledOnly.value = !showEnabledOnly.value
  await getRequestTypes()
}

const viewDetails = (requestType: RequestTypeDto) => {
  selectedRequestTypeId.value = requestType.id
  activeView.value = 'detail'
}

const backToList = () => {
  activeView.value = 'list'
  selectedRequestTypeId.value = null
}

getRequestTypes()
watch(
  filters,
  () => {
    if (activeView.value === 'list') {
      getRequestTypes()
    }
  },
  { deep: true }
)

</script>

<template>
  <div>
    <!-- Navigation Header -->
    <div class="mb-6 bg-white dark:bg-gray-800 rounded-lg p-4 border">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">أنواع الطلبات</h1>
          <div class="flex items-center gap-2">
            <BaseButton
              :variant="activeView === 'list' ? 'solid' : 'outline'"
              size="sm"
              @click="activeView = 'list'"
            >
              <Icon name="ph:list-duotone" class="size-4 mr-2" />
              قائمة
            </BaseButton>
            <BaseButton
              :variant="activeView === 'categories' ? 'solid' : 'outline'"
              size="sm"
              @click="activeView = 'categories'"
            >
              <Icon name="ph:folder-duotone" class="size-4 mr-2" />
              الفئات
            </BaseButton>
            <BaseButton
              :variant="activeView === 'availability' ? 'solid' : 'outline'"
              size="sm"
              @click="activeView = 'availability'"
            >
              <Icon name="ph:magnifying-glass-duotone" class="size-4 mr-2" />
              فحص التوفر
            </BaseButton>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <BaseButton
            v-if="activeView === 'detail'"
            variant="outline"
            size="sm"
            @click="backToList"
          >
            <Icon name="ph:arrow-left-duotone" class="size-4 mr-2" />
            العودة
          </BaseButton>
          <BaseButton
            v-if="activeView === 'list'"
            :variant="showEnabledOnly ? 'solid' : 'outline'"
            size="sm"
            @click="toggleEnabledOnly"
          >
            <Icon name="ph:toggle-right-duotone" class="size-4 mr-2" />
            {{ showEnabledOnly ? 'جميع الأنواع' : 'المفعل فقط' }}
          </BaseButton>
         
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-if="activeView === 'list'">
      <AppCrud
        add-button-text="إضافة نوع طلب جديد"
        :add-btn-action="() => (requestTypeStore.isCreateDialogOpen = true)"
        :pagination="true"
        :total-pages="requestTypeStore.totalPages"
        @update:current-page="filters.pageNumber = $event"
      >
        <template #filters>
          <BaseInput v-model="filters.name" placeholder="البحث" />
          <AppAutoCompleteField
            v-model="filters.categoryId"
            placeholder="الفئة"
            get-url="/RequestCategory/enabled"
            item-label="name"
            item-value="id"
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
                <button
                  class="font-medium text-muted-800 dark:text-muted-100 hover:text-primary-600 text-left"
                  @click="viewDetails(item)"
                >
                  {{ item.name }}
                </button>
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
            <div v-if="item.category" class="flex items-center gap-2">
              <div 
                class="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs"
                :style="{ backgroundColor: item.category.colorCode || '#4CAF50' }"
              >
                <Icon 
                  :name="item.category.iconClass || 'fas fa-folder'" 
                  class="size-3"
                />
              </div>
              <span class="text-muted-800 dark:text-muted-100">
                {{ item.category?.name }}
              </span>
            </div>
            <span v-else class="text-muted-500">-</span>
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
            <div class="flex items-center gap-2">
              
                <Icon @click="viewDetails(item)" name="ph:eye-duotone" class="size-5 text-primary-500 cursor-pointer" />
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
            </div>
          </template>
        </AppTable>
      </AppCrud>
    </div>

    <!-- Categories View -->
    <CategoryView v-else-if="activeView === 'categories'" />

    <!-- Availability Checker View -->
    <AvailabilityChecker v-else-if="activeView === 'availability'" />

    <!-- Detail View -->
    <RequestTypeDetail
      v-else-if="activeView === 'detail' && selectedRequestTypeId"
      :request-type-id="selectedRequestTypeId"
    />

    <!-- Dialogs -->
    <RequestTypeCreate />
    <RequestTypeEdit />
  </div>
</template>
