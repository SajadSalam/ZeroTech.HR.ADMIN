<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { useZoneStore } from '../store'
import type { ZoneCreateDto } from '../types'
import ZoneMap from './ZoneMap.vue'
import type { ApiError } from '~/utils/types/ApiResponses'

const zoneStore = useZoneStore()

const validator = new Validator<ZoneCreateDto>(
  {
    name: '',
    description: '',
    polygonCoordinates: '',
    color: '#3388ff',
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

const createZone = async () => {
  // Validate polygon
  if (currentPolygon.value.length < 3) {
    alert('يجب رسم منطقة صحيحة بثلاث نقاط على الأقل')
    return
  }

  const isValid = await body.value.$validate()
  if (!isValid) return
  
  try {
    const zoneData = validator.extractBody()
    zoneData.isOperational = true   
    zoneData.zoneType = 'Commercial'
    zoneData.color = '#3388ff'
    zoneData.opacity = 0.5
    zoneData.priority = 5
    
    // Convert coordinates to GeoJSON format
    const geoJsonCoordinates = currentPolygon.value.map(coord => [coord.lng, coord.lat])
    geoJsonCoordinates.push(geoJsonCoordinates[0]) // Close the polygon
    
    const geoJsonPolygon = {
      type: 'Polygon',
      coordinates: [geoJsonCoordinates]
    }
    
    zoneData.polygonCoordinates = JSON.stringify(geoJsonPolygon)
    
    await zoneStore.createZone(zoneData)
    validator.resetBody()
    zoneStore.clearCurrentPolygon()
    zoneStore.isCreateDialogOpen = false
  } catch (error) {
    useToast(
      {
        message: (error as ApiError).response?.data.title,
        isError: true
      }
    )
    validator.setExternalErrors((error as ApiError).response?.data?.errors ?? {})
    console.error('Error creating zone:', error)
  }
}

const clearPolygon = () => {
  mapRef.value?.clearPolygon()
}

const enableDrawing = () => {
  mapRef.value?.enableDrawing()
}

watch(() => zoneStore.isCreateDialogOpen, (val: boolean) => {
  if (val) {
    validator.resetBody()
    zoneStore.clearCurrentPolygon()
  }
})
</script>

<template>
  <AppDialog
    v-model="zoneStore.isCreateDialogOpen"
    title="إنشاء منطقة جديدة"
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

          <AppInputField
            v-model="body.priority.$model"
            label="الأولوية"
            type="number"
            min="1"
            max="10"
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
            تحديد المنطقة على الخريطة
          </h3>
          <div class="flex items-center gap-2">
            <BaseButton
              size="sm"
              color="primary"
              @click="enableDrawing"
            >
              <Icon name="ph:polygon-duotone" class="size-4 mr-2" />
              رسم منطقة
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
    </div>

    <template #actions>
      <BaseButton 
        color="muted" 
        @click="zoneStore.isCreateDialogOpen = false"
      >
        إلغاء
      </BaseButton>
      <BaseButton 
        color="primary" 
        class="gap-1" 
        :loading="isLoading"
        :disabled="currentPolygon.length < 3"
        @click="createZone"
      >
        <Icon name="ph:plus-duotone" class="size-5" />
        إنشاء المنطقة
      </BaseButton>
    </template>
  </AppDialog>
</template>
