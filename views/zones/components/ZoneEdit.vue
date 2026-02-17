<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { useZoneStore } from '../store'
import type { ZoneUpdateDto } from '../types'
import ZoneMap from './ZoneMap.vue'
import type { ApiError } from '~/utils/types/ApiResponses'
import { zoneTypes } from '..'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { parseGeoJsonPolygon } from '../service/utils'

const zoneStore = useZoneStore()

const validator = new Validator<ZoneUpdateDto>(
  {
    id: '',
    name: '',
    description: '',
    polygonCoordinates: '',
    zoneType: '',
    color: '#3388ff',
    opacity: 0.5,
    priority: 5,
    metadata: '',
    isOperational: true,
  },
  {
    name: {
      required: requiredValidator('اسم المنطقة مطلوب'),
    },
  }
)

const body = validator.validation
const isLoading = computed(() => zoneStore.isLoading)
const currentPolygon = computed(() => zoneStore.currentPolygon)

// Map reference
const mapRef = ref<InstanceType<typeof ZoneMap>>()

const updateZone = async () => {
  // Validate polygon
  if (currentPolygon.value.length < 3) {
    alert('يجب رسم منطقة صحيحة بثلاث نقاط على الأقل')
    return
  }

  const isValid = await body.value.$validate()
  if (!isValid) return
  
  try {
    const zoneData = validator.extractBody()
    
    // Convert coordinates to GeoJSON format
    const geoJsonCoordinates = currentPolygon.value.map(coord => [coord.lng, coord.lat])
    geoJsonCoordinates.push(geoJsonCoordinates[0]) // Close the polygon
    
    const geoJsonPolygon = {
      type: 'Polygon',
      coordinates: [geoJsonCoordinates]
    }
    
    zoneData.polygonCoordinates = JSON.stringify(geoJsonPolygon)
    
    await zoneStore.updateZone(zoneData)
    validator.resetBody()
    zoneStore.clearCurrentPolygon()
    zoneStore.isEditDialogOpen = false
  } catch (error) {
    useToast(
      {
        message: (error as ApiError).response?.data.title,
        isError: true
      }
    )
    validator.setExternalErrors((error as ApiError).response?.data?.errors ?? {})
  }
}

const clearPolygon = () => {
  mapRef.value?.clearPolygon()
}

const enableDrawing = () => {
  mapRef.value?.enableDrawing()
}

watch(() => zoneStore.isEditDialogOpen, (val: boolean) => {
  if (val && zoneStore.selectedZone) {
    const zone = zoneStore.selectedZone
    console.log(zone)
    validator.fillBody({
      id: zone.id,
      name: zone.name,
      description: zone.description || '',
      polygonCoordinates: zone.polygonCoordinates,
      zoneType: zone.zoneType || '',
      color: zone.color || '#3388ff',
      opacity: zone.opacity || 0.5,
      priority: zone.priority || 5,
      metadata: zone.metadata || '',
      isOperational: zone.isOperational,
    })
    
    // Parse polygonCoordinates GeoJSON string and set in store
    const coordinates = parseGeoJsonPolygon(zone.polygonCoordinates)
    if (coordinates.length > 0) {
      zoneStore.setCurrentPolygon(coordinates)
    }
  }
})
</script>

<template>
  <AppDialog
    v-model="zoneStore.isEditDialogOpen"
    title="تعديل المنطقة"
    size="5xl"
    overflow-y="visible"
  >
    <div class="space-y-6">
      <!-- Basic Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-muted-800 dark:text-muted-100">
          المعلومات الأساسية
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInputField
            v-model="body.name.$model"
            label="اسم المنطقة"
            placeholder="أدخل اسم المنطقة"
            :error="body.name.$error"
            :error-message="body.name.$errors[0]?.$message"
            required
          />

          <div class="space-y-2">
            <AppAutoCompleteField
              v-model="body.zoneType.$model"
              label="نوع المنطقة"
              placeholder="اختر نوع المنطقة"
              :items="zoneTypes"
              item-label="label"
              item-value="value"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AppInputField
            v-model="body.color.$model"
            label="لون المنطقة"
            type="color"
          />

          <AppInputField
            v-model="body.opacity.$model"
            label="الشفافية"
            type="number"
            min="0"
            max="1"
            step="0.1"
          />

          <AppInputField
            v-model="body.priority.$model"
            label="الأولوية"
            type="number"
            min="1"
            max="10"
          />
        </div>

        <div class="flex items-center gap-3">
          <BaseCheckbox
            v-model="body.isOperational.$model"
            label="منطقة تشغيلية"
            color="success"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppTextAreaField
            v-model="body.description.$model"
            label="الوصف"
            placeholder="أدخل وصف المنطقة"
            rows="3"
          />
        </div>
      </div>

      <!-- Map Section -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-muted-800 dark:text-muted-100">
            تعديل المنطقة على الخريطة
          </h3>
          <div class="flex items-center gap-2">
            <BaseButton
              size="sm"
              color="primary"
              @click="enableDrawing"
            >
              <Icon name="ph:polygon-duotone" class="size-4 mr-2" />
              رسم جديد
            </BaseButton>
            <BaseButton
              v-if="currentPolygon.length > 0"
              size="sm"
              color="danger"
              @click="clearPolygon"
            >
              <Icon name="ph:trash-duotone" class="size-4 mr-2" />
              مسح
            </BaseButton>
          </div>
        </div>

        <!-- Map Component -->
        <ZoneMap
          ref="mapRef"
          height="500px"
          :show-drawing-tools="true"
          :show-zones="true"
          :readonly="false"
        />

        <!-- Polygon Status -->
        <div class="p-4 bg-muted-50 dark:bg-muted-800 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-muted-700 dark:text-muted-300">
                حالة المنطقة المرسومة
              </h4>
              <p class="text-sm text-muted-600 dark:text-muted-400 mt-1">
                {{ currentPolygon.length > 0 
                  ? `تم رسم منطقة بـ ${currentPolygon.length} نقطة` 
                  : 'لم يتم رسم منطقة بعد' 
                }}
              </p>
            </div>
            <div>
              <BaseTag
                :color="currentPolygon.length >= 3 ? 'success' : 'warning'"
                variant="pastel"
                size="sm"
              >
                {{ currentPolygon.length >= 3 ? 'صحيح' : 'غير مكتمل' }}
              </BaseTag>
            </div>
          </div>
        </div>
      </div>

      <!-- Zone Info -->
      <div v-if="zoneStore.selectedZone" class="p-4 bg-muted-50 dark:bg-muted-800 rounded-lg">
        <h4 class="text-sm font-medium text-muted-700 dark:text-muted-300 mb-3">
          معلومات المنطقة الحالية
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span class="text-muted-600 dark:text-muted-400">المساحة:</span>
            <span class="font-medium ml-2">
              {{ zoneStore.selectedZone.formattedArea || 'غير محسوبة' }}
            </span>
          </div>
          <div>
            <span class="text-muted-600 dark:text-muted-400">النوع:</span>
            <span class="font-medium ml-2">
              {{ zoneStore.selectedZone.zoneType || 'غير محدد' }}
            </span>
          </div>
          <div>
            <span class="text-muted-600 dark:text-muted-400">الأولوية:</span>
            <span class="font-medium ml-2">
              {{ zoneStore.selectedZone.priority || 'غير محدد' }}
            </span>
          </div>
          <div>
            <span class="text-muted-600 dark:text-muted-400">عدد النقاط:</span>
            <span class="font-medium ml-2">{{ currentPolygon.length }}</span>
          </div>
        </div>
      </div>
    </div>

    <template #actions>
      <BaseButton 
        color="muted" 
        @click="zoneStore.isEditDialogOpen = false"
      >
        إلغاء
      </BaseButton>
      <BaseButton 
        color="primary" 
        class="gap-1" 
        :loading="isLoading"
        :disabled="currentPolygon.length < 3"
        @click="updateZone"
      >
        <Icon name="ph:floppy-disk-duotone" class="size-5" />
        حفظ التغييرات
      </BaseButton>
    </template>
  </AppDialog>
</template>
