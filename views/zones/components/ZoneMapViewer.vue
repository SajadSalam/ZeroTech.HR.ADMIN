<script setup lang="ts">
import { useZoneStore } from '../store'
import ZoneMap from './ZoneMap.vue'

const zoneStore = useZoneStore()

const selectedZone = computed(() => zoneStore.selectedZone)

const closeDialog = () => {
  zoneStore.isMapDialogOpen = false
}
</script>

<template>
  <AppDialog
    v-model="zoneStore.isMapDialogOpen"
    :title="selectedZone ? `عرض المنطقة: ${selectedZone.name}` : 'عرض الخريطة'"
    size="5xl"
    overflow-y="visible"
  >
    <div class="space-y-4">
      <!-- Zone Information -->
      <div v-if="selectedZone" class="bg-muted-50 dark:bg-muted-800 rounded-lg p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <div class="text-sm font-medium text-muted-700 dark:text-muted-300">اسم المنطقة</div>
            <div class="text-muted-900 dark:text-muted-100">{{ selectedZone.name }}</div>
          </div>
          <div>
            <div class="text-sm font-medium text-muted-700 dark:text-muted-300">الحالة</div>
            <BaseTag
              :color="selectedZone.isActive ? 'success' : 'muted'"
              variant="pastel"
              size="sm"
            >
              {{ selectedZone.isActive ? 'نشط' : 'غير نشط' }}
            </BaseTag>
          </div>
          <div>
            <div class="text-sm font-medium text-muted-700 dark:text-muted-300">المساحة</div>
            <div class="text-muted-900 dark:text-muted-100">
              {{ selectedZone.area ? `${Math.round(selectedZone.area)} م²` : 'غير محسوبة' }}
            </div>
          </div>
          <div>
            <div class="text-sm font-medium text-muted-700 dark:text-muted-300">عدد النقاط</div>
            <div class="text-muted-900 dark:text-muted-100">{{ selectedZone.polygon.coordinates.length }}</div>
          </div>
        </div>
        
        <div v-if="selectedZone.description" class="mt-4">
          <div class="text-sm font-medium text-muted-700 dark:text-muted-300 mb-1">الوصف</div>
          <div class="text-muted-900 dark:text-muted-100">{{ selectedZone.description }}</div>
        </div>
      </div>

      <!-- Map Component -->
      <ZoneMap
        height="600px"
        :show-drawing-tools="false"
        :show-zones="true"
        :readonly="true"
      />
    </div>

    <template #actions>
      <BaseButton color="muted" @click="closeDialog">
        إغلاق
      </BaseButton>
      <BaseButton
        v-if="selectedZone"
        color="primary"
        @click="() => {
          zoneStore.openEditDialog(selectedZone)
          zoneStore.isMapDialogOpen = false
        }"
      >
        <Icon name="ph:pencil-duotone" class="size-4 mr-2" />
        تعديل
      </BaseButton>
    </template>
  </AppDialog>
</template>
