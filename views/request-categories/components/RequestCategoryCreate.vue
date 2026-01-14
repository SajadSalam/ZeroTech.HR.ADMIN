<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { useRequestCategoryStore } from '../store'
import type { RequestCategoryCreateDto } from '../types'
import type { ApiError } from '~/utils/types/ApiResponses'

const requestCategoryStore = useRequestCategoryStore()

const validator = new Validator<RequestCategoryCreateDto>(
  {
    name: '',
    description: '',
    code: '',
    colorCode: '#4CAF50',
    iconClass: 'fas fa-folder',
    displayOrder: 0,
    isEnabled: true,
  },
  {
    name: {
      required: requiredValidator('اسم الفئة مطلوب'),
    },
    code: {
      required: requiredValidator('رمز الفئة مطلوب'),
    },
  }
)

const body = validator.validation
const isLoading = computed(() => requestCategoryStore.isLoading)

const createRequestCategory = async () => {
  const isValid = await body.value.$validate()
  if (!isValid) return
  
  try {
    await requestCategoryStore.createRequestCategory(validator.extractBody())
    validator.resetBody()
    requestCategoryStore.isCreateDialogOpen = false
  } catch (error) {
    useToast(
      {
        message: (error as ApiError).response?.data.title,
        isError: true
      }
    )
    validator.setExternalErrors((error as ApiError).response?.data?.errors ?? {})
    console.error('Error creating request category:', error)
  }
}

watch(() => requestCategoryStore.isCreateDialogOpen, (val: boolean) => {
  if (val) validator.resetBody()
})
</script>

<template>
  <AppDialog
    v-model="requestCategoryStore.isCreateDialogOpen"
    title="إنشاء فئة طلب جديدة"
    size="xl"
    overflow-y="visible"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Basic Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-muted-800 dark:text-muted-100">
          المعلومات الأساسية
        </h3>
        
        <AppInputField
          v-model="body.name.$model"
          label="اسم الفئة"
          placeholder="أدخل اسم الفئة"
          :error="body.name.$error"
          :error-message="body.name.$errors[0]?.$message"
          required
        />

        <AppInputField
          v-model="body.code.$model"
          label="رمز الفئة"
          placeholder="CATEGORY_CODE"
          :error="body.code.$error"
          :error-message="body.code.$errors[0]?.$message"
          required
        />

        <AppTextAreaField
          v-model="body.description.$model"
          label="الوصف"
          placeholder="أدخل وصف الفئة"
          rows="3"
        />
      </div>

      <!-- Visual Settings -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-muted-800 dark:text-muted-100">
          الإعدادات المرئية
        </h3>

        <AppInputField
          v-model="body.colorCode.$model"
          label="رمز اللون"
          placeholder="#4CAF50"
          type="color"
        />

        <AppInputField
          v-model="body.iconClass.$model"
          label="فئة الأيقونة"
          placeholder="fas fa-folder"
        />

        <AppInputField
          v-model="body.displayOrder.$model"
          label="ترتيب العرض"
          placeholder="0"
          type="number"
          min="0"
        />

        <!-- Enable/Disable Toggle -->
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium text-muted-700 dark:text-muted-300">
            حالة الفئة
          </label>
          <BaseCheckbox
            v-model="body.isEnabled.$model"
            label="مفعل"
            color="success"
          />
        </div>
      </div>
    </div>

    <!-- Preview Section -->
    <div class="mt-6 p-4 bg-muted-50 dark:bg-muted-800 rounded-lg">
      <h4 class="text-sm font-medium text-muted-700 dark:text-muted-300 mb-3">
        معاينة الفئة
      </h4>
      <div class="flex items-center gap-3">
        <div 
          class="w-8 h-8 rounded-lg flex items-center justify-center text-white"
          :style="{ backgroundColor: body.colorCode.$model || '#4CAF50' }"
        >
          <Icon 
            :name="body.iconClass.$model || 'fas fa-folder'" 
            class="size-4"
          />
        </div>
        <div>
          <div class="font-medium text-muted-800 dark:text-muted-100">
            {{ body.name.$model || 'اسم الفئة' }}
          </div>
          <div class="text-sm text-muted-500">
            {{ body.code.$model || 'CATEGORY_CODE' }}
          </div>
        </div>
        <BaseTag
          :color="body.isEnabled.$model ? 'success' : 'muted'"
          variant="pastel"
          size="sm"
        >
          {{ body.isEnabled.$model ? 'مفعل' : 'غير مفعل' }}
        </BaseTag>
      </div>
    </div>

    <template #actions>
      <BaseButton 
        color="muted" 
        @click="requestCategoryStore.isCreateDialogOpen = false"
      >
        إلغاء
      </BaseButton>
      <BaseButton 
        color="primary" 
        class="gap-1" 
        :loading="isLoading" 
        @click="createRequestCategory"
      >
        <Icon name="ph:plus-duotone" class="size-5" />
        إنشاء الفئة
      </BaseButton>
    </template>
  </AppDialog>
</template>
