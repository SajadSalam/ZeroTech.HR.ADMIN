<script setup lang="ts">
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'
import AppTable from '~/components/app-table/AppTable.vue'
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import { tableHeader } from '~/views/zones'
import ZoneCreate from '~/views/zones/components/ZoneCreate.vue'
import ZoneEdit from '~/views/zones/components/ZoneEdit.vue'
import ZoneMapViewer from '~/views/zones/components/ZoneMapViewer.vue'
import { useZoneStore } from '~/views/zones/store'
import type { ZoneDto, ZoneFilters } from '~/views/zones/types'

definePageMeta({
  title: 'إدارة المناطق',
  description: 'إدارة المناطق الجغرافية في النظام',
})

const zoneStore = useZoneStore()
const appTableStore = useAppTableStore()

const isLoading = computed(() => zoneStore.isLoading)
const zones = computed(() => zoneStore.zones || [])
const filters = computed<ZoneFilters>({
  get() {
    return zoneStore.filters
  },
  set(value) {
    zoneStore.filters = value
  },
})

const zoneTypes = [
  { value: 'Commercial', label: 'تجاري' },
  { value: 'Residential', label: 'سكني' },
  { value: 'Industrial', label: 'صناعي' },
  { value: 'Mixed-Use', label: 'مختلط' },
  { value: 'Recreational', label: 'ترفيهي' },
]

const getZones = async () => {
  appTableStore.setLoading(true)
  await zoneStore.getZones()
  appTableStore.setLoading(false)
}

const viewZoneOnMap = (zone: ZoneDto) => {
  zoneStore.openMapDialog(zone)
}

const getZoneTypeLabel = (type?: string) => {
  if (!type) return '-'
  const zoneType = zoneTypes.find(t => t.value === type)
  return zoneType?.label || type
}

const getPriorityColor = (priority?: number) => {
  if (!priority) return 'muted'
  if (priority >= 8) return 'danger'
  if (priority >= 6) return 'warning'
  if (priority >= 4) return 'info'
  return 'success'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US')
}

getZones()
watch(filters, () => { getZones() }, { deep: true })
</script>

<template>
  <div>
    <AppCrud
      add-button-text="إضافة منطقة جديدة"
      :add-btn-action="() => zoneStore.openCreateDialog()"
      :pagination="true"
      :total-pages="zoneStore.totalPages"
      title="المناطق الجغرافية"
      @update:current-page="filters.pageNumber = $event"
    >
      <template #filters>
        <BaseInput 
          v-model="filters.searchTerm" 
          placeholder="البحث في الاسم والوصف" 
        />
        <BaseSelect
          v-model="filters.zoneType"
          placeholder="نوع المنطقة"
        >
          <option value="">جميع الأنواع</option>
          <option
            v-for="type in zoneTypes"
            :key="type.value"
            :value="type.value"
          >
            {{ type.label }}
          </option>
        </BaseSelect>
        <BaseSelect
          v-model="filters.isOperational"
          placeholder="الحالة التشغيلية"
        >
          <option :value="undefined">جميع الحالات</option>
          <option :value="true">تشغيلي</option>
          <option :value="false">غير تشغيلي</option>
        </BaseSelect>
      </template>
      
      <AppTable
        title="قائمة المناطق"
        :headers="tableHeader()"
        :items="zones"
        :is-loading="isLoading"
      >
        <template #data-name="{ item }">
          <div class="flex items-center gap-3">
            <div 
              class="w-8 h-8 rounded-lg flex items-center justify-center"
              :style="{ backgroundColor: item.color + '20', color: item.color }"
            >
              <Icon name="ph:map-pin-duotone" class="size-4" />
            </div>
            <div>
              <button
                class="font-medium text-muted-800 dark:text-muted-100 hover:text-primary-600 text-left"
                @click="viewZoneOnMap(item)"
              >
                {{ item.name }}
              </button>
            </div>
          </div>
        </template>

        <template #data-zoneType="{ item }">
          <BaseTag
            color="primary"
            variant="pastel"
            size="sm"
          >
            {{ getZoneTypeLabel(item.zoneType) }}
          </BaseTag>
        </template>

        <template #data-description="{ item }">
          <div class="max-w-xs">
            <p class="text-sm text-muted-600 dark:text-muted-400 line-clamp-2">
              {{ item.description || '-' }}
            </p>
          </div>
        </template>

        <template #data-formattedArea="{ item }">
          <div class="text-sm font-medium text-muted-800 dark:text-muted-100">
            {{ item.formattedArea || '-' }}
          </div>
        </template>

        <template #data-priority="{ item }">
          <BaseTag
            :color="getPriorityColor(item.priority)"
            variant="pastel"
            size="sm"
          >
            {{ item.priority || '-' }}
          </BaseTag>
        </template>

        <template #data-isOperational="{ item }">
          <BaseTag
            :color="item.isOperational ? 'success' : 'warning'"
            variant="pastel"
            size="sm"
          >
            {{ item.isOperational ? 'تشغيلي' : 'غير تشغيلي' }}
          </BaseTag>
        </template>

        <template #data-isActive="{ item }">
          <BaseTag
            :color="item.isActive ? 'success' : 'muted'"
            variant="pastel"
            size="sm"
          >
            {{ item.isActive ? 'نشط' : 'غير نشط' }}
          </BaseTag>
        </template>

        <template #data-actions="{ item }">
          <div class="flex items-center gap-2">
            <BaseButton
              size="sm"
              variant="outline"
              @click="viewZoneOnMap(item)"
            >
              <Icon name="ph:map-duotone" class="size-4" />
            </BaseButton>
            <AppCrudActions
              :item="item"
              :edit-button-action="() => zoneStore.openEditDialog(item)"
              :delete-service="zoneStore.deleteZone"
            />
          </div>
        </template>
      </AppTable>
    </AppCrud>
    
    <ZoneCreate />
    <ZoneEdit />
    <ZoneMapViewer />
  </div>
</template>
