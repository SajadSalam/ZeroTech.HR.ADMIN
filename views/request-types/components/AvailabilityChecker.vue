<script setup lang="ts">
import { useRequestTypeStore } from '../store'
import type { RequestTypeDto } from '../types'

const requestTypeStore = useRequestTypeStore()

const selectedUserId = ref<number | null>(null)
const selectedDepartmentId = ref<number | null>(null)
const selectedRoleId = ref<number | null>(null)
const availableTypes = ref<RequestTypeDto[]>([])
const isLoading = ref(false)
const activeTab = ref<'user' | 'department' | 'role'>('user')

const checkAvailabilityForUser = async () => {
  if (!selectedUserId.value) return
  
  try {
    isLoading.value = true
    availableTypes.value = await requestTypeStore.getAvailableForUser(selectedUserId.value)
  } catch (error) {
    console.error('Error checking user availability:', error)
  } finally {
    isLoading.value = false
  }
}

const checkAvailabilityForDepartment = async () => {
  if (!selectedDepartmentId.value) return
  
  try {
    isLoading.value = true
    availableTypes.value = await requestTypeStore.getAvailableForDepartment(selectedDepartmentId.value)
  } catch (error) {
    console.error('Error checking department availability:', error)
  } finally {
    isLoading.value = false
  }
}

const checkAvailabilityForRole = async () => {
  if (!selectedRoleId.value) return
  
  try {
    isLoading.value = true
    availableTypes.value = await requestTypeStore.getAvailableForRole(selectedRoleId.value)
  } catch (error) {
    console.error('Error checking role availability:', error)
  } finally {
    isLoading.value = false
  }
}

const clearResults = () => {
  availableTypes.value = []
  selectedUserId.value = null
  selectedDepartmentId.value = null
  selectedRoleId.value = null
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
        فحص توفر أنواع الطلبات
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        تحقق من أنواع الطلبات المتاحة للمستخدمين أو الأقسام أو الأدوار المحددة
      </p>

      <!-- Tabs -->
      <div class="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
        <button
          :class="[
            'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors',
            activeTab === 'user'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          ]"
          @click="activeTab = 'user'"
        >
          حسب المستخدم
        </button>
        <button
          :class="[
            'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors',
            activeTab === 'department'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          ]"
          @click="activeTab = 'department'"
        >
          حسب القسم
        </button>
        <button
          :class="[
            'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors',
            activeTab === 'role'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          ]"
          @click="activeTab = 'role'"
        >
          حسب الدور
        </button>
      </div>

      <!-- User Tab -->
      <div v-if="activeTab === 'user'" class="space-y-4">
        <div class="flex gap-4">
          <div class="flex-1">
            <AppAutoCompleteField
              v-model="selectedUserId"
              label="اختر المستخدم"
              placeholder="ابحث عن مستخدم..."
              get-url="/user"
              item-label="fullName"
              item-value="id"
              fetch-on-search
              search-key="fullName"
            />
          </div>
          <div class="flex items-end">
            <BaseButton
              color="primary"
              :loading="isLoading"
              :disabled="!selectedUserId"
              @click="checkAvailabilityForUser"
            >
              فحص التوفر
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Department Tab -->
      <div v-if="activeTab === 'department'" class="space-y-4">
        <div class="flex gap-4">
          <div class="flex-1">
            <AppAutoCompleteField
              v-model="selectedDepartmentId"
              label="اختر القسم"
              placeholder="ابحث عن قسم..."
              get-url="/Department"
              item-label="name"
              item-value="id"
              fetch-on-search
              search-key="name"
            />
          </div>
          <div class="flex items-end">
            <BaseButton
              color="primary"
              :loading="isLoading"
              :disabled="!selectedDepartmentId"
              @click="checkAvailabilityForDepartment"
            >
              فحص التوفر
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Role Tab -->
      <div v-if="activeTab === 'role'" class="space-y-4">
        <div class="flex gap-4">
          <div class="flex-1">
            <AppAutoCompleteField
              v-model="selectedRoleId"
              label="اختر الدور"
              placeholder="ابحث عن دور..."
              get-url="/role"
              item-label="name"
              item-value="id"
              fetch-on-search
              search-key="name"
            />
          </div>
          <div class="flex items-end">
            <BaseButton
              color="primary"
              :loading="isLoading"
              :disabled="!selectedRoleId"
              @click="checkAvailabilityForRole"
            >
              فحص التوفر
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Clear Button -->
      <div v-if="availableTypes.length > 0" class="flex justify-end mt-4">
        <BaseButton variant="outline" size="sm" @click="clearResults">
          مسح النتائج
        </BaseButton>
      </div>
    </div>

    <!-- Results -->
    <div v-if="availableTypes.length > 0" class="bg-white dark:bg-gray-800 rounded-lg p-6 border">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        أنواع الطلبات المتاحة ({{ availableTypes.length }})
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="requestType in availableTypes"
          :key="requestType.id"
          class="border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start gap-3">
            <div
              v-if="requestType.colorCode"
              class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              :style="{ backgroundColor: requestType.colorCode }"
            >
              <Icon
                v-if="requestType.iconClass"
                :name="requestType.iconClass"
                class="text-white text-lg"
              />
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-medium text-gray-900 dark:text-white truncate">
                {{ requestType.name }}
              </h4>
              <p v-if="requestType.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ requestType.description }}
              </p>
              <div class="flex items-center gap-2 mt-2">
                <BaseTag color="primary" variant="pastel" size="sm">
                  {{ requestType.code }}
                </BaseTag>
                <BaseTag
                  :color="requestType.isEnabled ? 'success' : 'danger'"
                  variant="pastel"
                  size="sm"
                >
                  {{ requestType.isEnabled ? 'مفعل' : 'غير مفعل' }}
                </BaseTag>
              </div>
              <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <div class="flex items-center gap-1">
                  <Icon
                    :name="requestType.requiresApproval ? 'ph:check-circle' : 'ph:x-circle'"
                    :class="requestType.requiresApproval ? 'text-success-500' : 'text-danger-500'"
                    class="size-3"
                  />
                  <span>موافقة</span>
                </div>
                <div class="flex items-center gap-1">
                  <Icon
                    :name="requestType.isPaidTime ? 'ph:check-circle' : 'ph:x-circle'"
                    :class="requestType.isPaidTime ? 'text-success-500' : 'text-danger-500'"
                    class="size-3"
                  />
                  <span>مدفوع</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Results -->
    <div v-else-if="!isLoading && (selectedUserId || selectedDepartmentId || selectedRoleId)" class="bg-white dark:bg-gray-800 rounded-lg p-6 border text-center">
      <Icon name="ph:magnifying-glass-duotone" class="size-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        لا توجد أنواع طلبات متاحة
      </h3>
      <p class="text-gray-600 dark:text-gray-400">
        لم يتم العثور على أنواع طلبات متاحة للعنصر المحدد
      </p>
    </div>
  </div>
</template>
