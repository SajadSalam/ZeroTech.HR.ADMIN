<script setup lang="ts">
import { useRequestTypeStore } from '../store'
import type { RequestTypeDto } from '../types'

const requestTypeStore = useRequestTypeStore()

const categories = ref<any[]>([])
const selectedCategoryId = ref<number | null>(null)
const categoryRequestTypes = ref<RequestTypeDto[]>([])
const isLoading = ref(false)
const isLoadingCategories = ref(false)

const loadCategories = async () => {
  try {
    isLoadingCategories.value = true
    // This would typically come from a categories API
    // For now, we'll extract unique categories from request types
    await requestTypeStore.getRequestTypes()
    const uniqueCategories = new Map()
    
    requestTypeStore.requestTypes.forEach(rt => {
      if (rt.category && !uniqueCategories.has(rt.category.id)) {
        uniqueCategories.set(rt.category.id, rt.category)
      }
    })
    
    categories.value = Array.from(uniqueCategories.values())
  } catch (error) {
    console.error('Error loading categories:', error)
  } finally {
    isLoadingCategories.value = false
  }
}

const loadRequestTypesByCategory = async (categoryId: number) => {
  try {
    isLoading.value = true
    selectedCategoryId.value = categoryId
    categoryRequestTypes.value = await requestTypeStore.getRequestTypesByCategory(categoryId)
  } catch (error) {
    console.error('Error loading request types by category:', error)
  } finally {
    isLoading.value = false
  }
}

const getEnabledCount = (categoryId: number) => {
  return requestTypeStore.requestTypes.filter(rt => 
    rt.categoryId === categoryId && rt.isEnabled
  ).length
}

const getTotalCount = (categoryId: number) => {
  return requestTypeStore.requestTypes.filter(rt => 
    rt.categoryId === categoryId
  ).length
}

onMounted(() => {
  loadCategories()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Categories Grid -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
        أنواع الطلبات حسب الفئة
      </h2>
      
      <div v-if="isLoadingCategories" class="flex items-center justify-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="category in categories"
          :key="category.id"
          class="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
          :class="selectedCategoryId === category.id ? 'ring-2 ring-primary-500 border-primary-500' : 'hover:border-primary-300'"
          @click="loadRequestTypesByCategory(category.id)"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ category.name }}
            </h3>
            <BaseBadge color="primary" variant="pastel" size="sm">
              {{ category.code }}
            </BaseBadge>
          </div>
          
          <div class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">المجموع:</span>
              <span class="font-medium">{{ getTotalCount(category.id) }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">المفعل:</span>
              <span class="font-medium text-success-600">{{ getEnabledCount(category.id) }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">غير المفعل:</span>
              <span class="font-medium text-danger-600">{{ getTotalCount(category.id) - getEnabledCount(category.id) }}</span>
            </div>
          </div>
          
          <!-- Progress Bar -->
          <div class="mt-4">
            <div class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>نسبة التفعيل</span>
              <span>{{ Math.round((getEnabledCount(category.id) / getTotalCount(category.id)) * 100) }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                class="bg-success-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${(getEnabledCount(category.id) / getTotalCount(category.id)) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Request Types -->
    <div v-if="selectedCategoryId && categoryRequestTypes.length > 0" class="bg-white dark:bg-gray-800 rounded-lg p-6 border">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          أنواع الطلبات في الفئة المحددة
        </h3>
        <BaseButton variant="outline" size="sm" @click="selectedCategoryId = null; categoryRequestTypes = []">
          إغلاق
        </BaseButton>
      </div>
      
      <div v-if="isLoading" class="flex items-center justify-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="requestType in categoryRequestTypes"
          :key="requestType.id"
          class="border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start gap-3">
            <div
              v-if="requestType.colorCode"
              class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              :style="{ backgroundColor: requestType.colorCode }"
            >
              <Icon
                v-if="requestType.iconClass"
                :name="requestType.iconClass"
                class="text-white text-lg"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-900 dark:text-white truncate">
                  {{ requestType.name }}
                </h4>
                <BaseBadge
                  :color="requestType.isEnabled ? 'success' : 'danger'"
                  variant="pastel"
                  size="xs"
                >
                  {{ requestType.isEnabled ? 'مفعل' : 'غير مفعل' }}
                </BaseBadge>
              </div>
              
              <p v-if="requestType.description" class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {{ requestType.description }}
              </p>
              
              <div class="flex items-center gap-2 mb-3">
                <BaseBadge color="primary" variant="pastel" size="xs">
                  {{ requestType.code }}
                </BaseBadge>
                <span v-if="requestType.displayOrder" class="text-xs text-gray-500">
                  ترتيب: {{ requestType.displayOrder }}
                </span>
              </div>
              
              <!-- Quick Info -->
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="flex items-center gap-1">
                  <Icon
                    :name="requestType.requiresApproval ? 'ph:check-circle' : 'ph:x-circle'"
                    :class="requestType.requiresApproval ? 'text-success-500' : 'text-danger-500'"
                    class="size-3"
                  />
                  <span class="text-gray-600 dark:text-gray-400">موافقة</span>
                </div>
                <div class="flex items-center gap-1">
                  <Icon
                    :name="requestType.allowsAttachments ? 'ph:check-circle' : 'ph:x-circle'"
                    :class="requestType.allowsAttachments ? 'text-success-500' : 'text-danger-500'"
                    class="size-3"
                  />
                  <span class="text-gray-600 dark:text-gray-400">مرفقات</span>
                </div>
                <div class="flex items-center gap-1">
                  <Icon
                    :name="requestType.affectsAttendance ? 'ph:check-circle' : 'ph:x-circle'"
                    :class="requestType.affectsAttendance ? 'text-success-500' : 'text-danger-500'"
                    class="size-3"
                  />
                  <span class="text-gray-600 dark:text-gray-400">حضور</span>
                </div>
                <div class="flex items-center gap-1">
                  <Icon
                    :name="requestType.isPaidTime ? 'ph:check-circle' : 'ph:x-circle'"
                    :class="requestType.isPaidTime ? 'text-success-500' : 'text-danger-500'"
                    class="size-3"
                  />
                  <span class="text-gray-600 dark:text-gray-400">مدفوع</span>
                </div>
              </div>
              
              <!-- Duration Info -->
              <div v-if="requestType.maxDurationDays || requestType.minDurationHours" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div class="text-xs text-gray-600 dark:text-gray-400">
                  <span v-if="requestType.maxDurationDays">أقصى مدة: {{ requestType.maxDurationDays }} يوم</span>
                  <span v-if="requestType.maxDurationDays && requestType.minDurationHours"> | </span>
                  <span v-if="requestType.minDurationHours">أقل مدة: {{ requestType.minDurationHours }} ساعة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Results -->
    <div v-else-if="selectedCategoryId && !isLoading && categoryRequestTypes.length === 0" class="bg-white dark:bg-gray-800 rounded-lg p-6 border text-center">
      <Icon name="ph:folder-open-duotone" class="size-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        لا توجد أنواع طلبات في هذه الفئة
      </h3>
      <p class="text-gray-600 dark:text-gray-400">
        لم يتم العثور على أنواع طلبات في الفئة المحددة
      </p>
    </div>
  </div>
</template>
