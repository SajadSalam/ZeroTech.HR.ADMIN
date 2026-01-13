<script setup lang="ts">
import { useRequestTypeStore } from '../store';
import type { RequestTypeDto } from '../types';

interface Props {
  requestTypeId: number
}

const props = defineProps<Props>()
const requestTypeStore = useRequestTypeStore()

const requestType = ref<RequestTypeDto | null>(null)
const isLoading = ref(false)
const showRestrictions = ref(false)

const loadRequestType = async () => {
  try {
    isLoading.value = true
    if (showRestrictions.value) {
      requestType.value = await requestTypeStore.getRequestTypeWithRestrictions(props.requestTypeId)
    } else {
      requestType.value = await requestTypeStore.getRequestTypeById(props.requestTypeId)
    }
  } catch (error) {
    console.error('Error loading request type:', error)
  } finally {
    isLoading.value = false
  }
}

const toggleRestrictions = async () => {
  showRestrictions.value = !showRestrictions.value
  await loadRequestType()
}

const parseJsonField = (jsonString: string | null) => {
  if (!jsonString) return null
  try {
    return JSON.parse(jsonString)
  } catch {
    return null
  }
}

onMounted(() => {
  loadRequestType()
})

watch(() => props.requestTypeId, () => {
  loadRequestType()
})
</script>

<template>
  <div v-if="isLoading" class="flex items-center justify-center p-8">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
  </div>

  <div v-else-if="requestType" class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div
          v-if="requestType.colorCode"
          class="w-12 h-12 rounded-lg border-2 border-gray-200 flex items-center justify-center"
          :style="{ backgroundColor: requestType.colorCode }"
        >
          <Icon
            v-if="requestType.iconClass"
            :name="requestType.iconClass"
            class="text-white text-xl"
          />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ requestType.name }}
          </h2>
          <p v-if="requestType.description" class="text-gray-600 dark:text-gray-400">
            {{ requestType.description }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <BaseTag
          :color="requestType.isEnabled ? 'success' : 'danger'"
          variant="pastel"
          size="lg"
        >
          {{ requestType.isEnabled ? 'مفعل' : 'غير مفعل' }}
        </BaseTag>
        <BaseButton
          size="sm"
          variant="outline"
          @click="toggleRestrictions"
        >
          {{ showRestrictions ? 'إخفاء القيود' : 'عرض القيود' }}
        </BaseButton>
      </div>
    </div>

    <!-- Basic Information -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-3">معلومات أساسية</h3>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">الرمز:</span>
            <BaseTag color="primary" variant="pastel" size="sm">{{ requestType.code }}</BaseTag>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">الفئة:</span>
            <span class="font-medium">{{ requestType.category?.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">ترتيب العرض:</span>
            <span class="font-medium">{{ requestType.displayOrder || 'غير محدد' }}</span>
          </div>
        </div>
      </div>

      <!-- Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-3">الإعدادات</h3>
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-gray-600 dark:text-gray-400">يتطلب موافقة:</span>
            <Icon
              :name="requestType.requiresApproval ? 'ph:check-circle-duotone' : 'ph:x-circle-duotone'"
              :class="requestType.requiresApproval ? 'text-success-500' : 'text-danger-500'"
              class="size-5"
            />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600 dark:text-gray-400">يسمح بالمرفقات:</span>
            <Icon
              :name="requestType.allowsAttachments ? 'ph:check-circle-duotone' : 'ph:x-circle-duotone'"
              :class="requestType.allowsAttachments ? 'text-success-500' : 'text-danger-500'"
              class="size-5"
            />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600 dark:text-gray-400">يتطلب مرفقات:</span>
            <Icon
              :name="requestType.requiresAttachments ? 'ph:check-circle-duotone' : 'ph:x-circle-duotone'"
              :class="requestType.requiresAttachments ? 'text-success-500' : 'text-danger-500'"
              class="size-5"
            />
          </div>
        </div>
      </div>

      <!-- Impact -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-3">التأثير</h3>
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-gray-600 dark:text-gray-400">يؤثر على الحضور:</span>
            <Icon
              :name="requestType.affectsAttendance ? 'ph:check-circle-duotone' : 'ph:x-circle-duotone'"
              :class="requestType.affectsAttendance ? 'text-success-500' : 'text-danger-500'"
              class="size-5"
            />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600 dark:text-gray-400">يؤثر على الراتب:</span>
            <Icon
              :name="requestType.affectsPayroll ? 'ph:check-circle-duotone' : 'ph:x-circle-duotone'"
              :class="requestType.affectsPayroll ? 'text-success-500' : 'text-danger-500'"
              class="size-5"
            />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600 dark:text-gray-400">وقت مدفوع:</span>
            <Icon
              :name="requestType.isPaidTime ? 'ph:check-circle-duotone' : 'ph:x-circle-duotone'"
              :class="requestType.isPaidTime ? 'text-success-500' : 'text-danger-500'"
              class="size-5"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Duration Settings -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border">
      <h3 class="font-semibold text-gray-900 dark:text-white mb-4">إعدادات المدة</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="text-2xl font-bold text-primary-600">
            {{ requestType.maxAdvanceDays || 'غير محدد' }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">أقصى أيام مسبقة</div>
        </div>
        <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="text-2xl font-bold text-primary-600">
            {{ requestType.minAdvanceDays || 'غير محدد' }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">أقل أيام مسبقة</div>
        </div>
        <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="text-2xl font-bold text-primary-600">
            {{ requestType.maxDurationDays || 'غير محدد' }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">أقصى مدة (أيام)</div>
        </div>
        <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="text-2xl font-bold text-primary-600">
            {{ requestType.minDurationHours || 'غير محدد' }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">أقل مدة (ساعات)</div>
        </div>
      </div>
    </div>

    <!-- Restrictions (shown when toggled) -->
    <div v-if="showRestrictions && (requestType.allowedDepartments?.length || requestType.allowedRoles?.length)" class="space-y-4">
      <!-- Allowed Departments -->
      <div v-if="requestType.allowedDepartments?.length" class="bg-white dark:bg-gray-800 rounded-lg p-6 border">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">الأقسام المسموحة</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="dept in requestType.allowedDepartments"
            :key="dept.id"
            class="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
          >
            <Icon name="ph:buildings-duotone" class="text-blue-600 size-5" />
            <span class="font-medium">{{ dept.department.name }}</span>
          </div>
        </div>
      </div>

      <!-- Allowed Roles -->
      <div v-if="requestType.allowedRoles?.length" class="bg-white dark:bg-gray-800 rounded-lg p-6 border">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">الأدوار المسموحة</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="role in requestType.allowedRoles"
            :key="role.id"
            class="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
          >
            <Icon name="ph:user-duotone" class="text-green-600 size-5" />
            <span class="font-medium">{{ role.role.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- JSON Configuration -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Validation Rules -->
      <div v-if="requestType.validationRules" class="bg-white dark:bg-gray-800 rounded-lg p-6 border">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">قواعد التحقق</h3>
        <pre class="text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded overflow-auto">{{ JSON.stringify(parseJsonField(requestType.validationRules), null, 2) }}</pre>
      </div>

      <!-- Custom Fields -->
      <div v-if="requestType.customFields" class="bg-white dark:bg-gray-800 rounded-lg p-6 border">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">الحقول المخصصة</h3>
        <div class="space-y-2">
          <div
            v-for="(field, index) in parseJsonField(requestType.customFields)"
            :key="index"
            class="p-2 bg-gray-50 dark:bg-gray-700 rounded"
          >
            <div class="font-medium">{{ field.name }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              النوع: {{ field.type }} | مطلوب: {{ field.required ? 'نعم' : 'لا' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div v-if="requestType.notificationSettings" class="bg-white dark:bg-gray-800 rounded-lg p-6 border">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">إعدادات الإشعارات</h3>
        <pre class="text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded overflow-auto">{{ JSON.stringify(parseJsonField(requestType.notificationSettings), null, 2) }}</pre>
      </div>
    </div>

    <!-- Metadata -->
    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border">
      <h3 class="font-semibold text-gray-900 dark:text-white mb-3">معلومات النظام</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <span class="text-gray-600 dark:text-gray-400">تاريخ الإنشاء:</span>
          <div class="font-medium">{{ new Date(requestType.createdAt).toLocaleDateString('en-US') }}</div>
        </div>
        <div>
          <span class="text-gray-600 dark:text-gray-400">آخر تحديث:</span>
          <div class="font-medium">{{ new Date(requestType.updatedAt).toLocaleDateString('en-US') }}</div>
        </div>
        <div>
          <span class="text-gray-600 dark:text-gray-400">الحالة:</span>
          <div class="font-medium">{{ requestType.isActive ? 'نشط' : 'غير نشط' }}</div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center p-8">
    <p class="text-gray-500">لم يتم العثور على نوع الطلب</p>
  </div>
</template>
