<script setup lang="ts">
import type { LocationTimestampDto, MapZoneDisplay } from '../types'
import { useGoogleMaps } from '../composables/useGoogleMaps'
import { useAvatarCache } from '../composables/useAvatarCache'
import { useEmployeeMarkers } from '../composables/useEmployeeMarkers'
import { useAttendanceStore } from '../store'

interface Props {
  height?: string
  refreshInterval?: number
  /** Optional zones to display on the map (id, name, polygon, etc.) */
  zonesToDisplay?: MapZoneDisplay[]
}

const attendanceStore = useAttendanceStore()
const props = withDefaults(defineProps<Props>(), {
  height: '600px',
  refreshInterval: 60000,
  zonesToDisplay: () => [],
})

const { 
  map, 
  mapContainer, 
  loadAPI, 
  initializeMap, 
  setZoom, 
  getZoom
} = useGoogleMaps()

const { cache: avatarCache, preloadAvatars } = useAvatarCache()

const { updateMarkers, clearMarkers } = useEmployeeMarkers(map, avatarCache)

const zoneOverlays = ref<any[]>([])

const drawZonesOnMap = () => {
  if (!map.value || !window.google || !props.zonesToDisplay?.length) return

  zoneOverlays.value.forEach(overlay => overlay.setMap(null))
  zoneOverlays.value = []

  props.zonesToDisplay.forEach(zone => {
    let geoCoords: number[][] | null = null
    if (zone.polygonCoordinates) {
      try {
        const parsed = JSON.parse(zone.polygonCoordinates) as { type: string; coordinates: number[][][] }
        if (parsed?.type === 'Polygon' && parsed.coordinates?.[0]) {
          geoCoords = parsed.coordinates[0]
        }
      } catch {
        // ignore invalid JSON
      }
    }
    if (geoCoords && geoCoords.length > 0) {
      const path = geoCoords.map(coord =>
        new window.google.maps.LatLng(coord[1], coord[0])
      )

      const polygon = new window.google.maps.Polygon({
        paths: path,
        fillColor: zone.color || (zone.isOperational ? '#10B981' : '#6B7280'),
        fillOpacity: zone.opacity ?? 0.2,
        strokeColor: zone.color || (zone.isOperational ? '#059669' : '#4B5563'),
        strokeWeight: 2,
        clickable: true,
      })

      polygon.setMap(map.value)
      zoneOverlays.value.push(polygon)

      polygon.addListener('click', () => {
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div class="p-2"><h4 class="font-semibold">${zone.name}</h4></div>`,
        })
        const bounds = new window.google.maps.LatLngBounds()
        path.forEach((p: any) => bounds.extend(p))
        infoWindow.setPosition(bounds.getCenter())
        infoWindow.open(map.value)
      })
    }
  })
}

const clearZoneOverlays = () => {
  zoneOverlays.value.forEach(overlay => overlay.setMap(null))
  zoneOverlays.value = []
}

const employees = ref<LocationTimestampDto[]>([])
const isLoadingData = ref(false)
const isInitialLoad = ref(true)

const loadEmployeeLocations = async () => {
  if (!map.value) return

  try {
    isLoadingData.value = true

    await attendanceStore.getLocationTimestamp()
    employees.value = attendanceStore.locationTimestamps
    updateMarkers(employees.value, !isInitialLoad.value)
    isInitialLoad.value = false
  } catch (error) {
    console.error('Error loading employee locations:', error)
  } finally {
    isLoadingData.value = false
  }
}

const refreshData = () => {
  loadEmployeeLocations()
}

let refreshIntervalId: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  try {
    await loadAPI()
    await nextTick()
    await preloadAvatars()
    initializeMap()
    loadEmployeeLocations()
    drawZonesOnMap()

    if (props.refreshInterval > 0) {
      refreshIntervalId = setInterval(refreshData, props.refreshInterval)
    }
  } catch (error) {
    console.error('Error initializing map:', error)
  }
})

watch(() => props.zonesToDisplay, () => {
  drawZonesOnMap()
}, { deep: true })

onUnmounted(() => {
  clearMarkers()
  clearZoneOverlays()
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId)
  }
})

defineExpose({
  refreshData,
  loadEmployeeLocations,
})

const onlineCount = computed(() => employees.value.filter(e => e.isLocationRecent).length)
const offlineCount = computed(() => employees.value.filter(e => !e.isLocationRecent).length)
</script>

<template>
  <div class="relative">
    <!-- Stats Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl">
          <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            متصل: {{ onlineCount }}
          </span>
        </div>
        <div class="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl">
          <span class="w-3 h-3 rounded-full bg-red-500"></span>
          <span class="text-sm font-medium text-red-700 dark:text-red-400">
            غير متصل: {{ offlineCount }}
          </span>
        </div>
      </div>
      <BaseButton size="sm" color="default" @click="refreshData" :loading="isLoadingData">
        <Icon name="ph:arrows-clockwise" class="size-4 ml-2" />
        تحديث
      </BaseButton>
    </div>

    <!-- Map Container -->
    <div
      ref="mapContainer"
      class="w-full rounded-2xl border border-muted-200 dark:border-muted-700 overflow-hidden"
      :style="{ height: props.height }"
    />

    <!-- Map Controls Overlay -->
    <div class="absolute bottom-6 left-6 flex flex-col gap-2">
      <button
        class="w-10 h-10 bg-white dark:bg-muted-800 rounded-xl shadow-lg flex items-center justify-center hover:bg-muted-50 dark:hover:bg-muted-700 transition-colors border border-muted-200 dark:border-muted-600"
        @click="setZoom(getZoom() + 1)"
      >
        <Icon name="ph:plus" class="size-5 text-muted-600 dark:text-muted-300" />
      </button>
      <button
        class="w-10 h-10 bg-white dark:bg-muted-800 rounded-xl shadow-lg flex items-center justify-center hover:bg-muted-50 dark:hover:bg-muted-700 transition-colors border border-muted-200 dark:border-muted-600"
        @click="setZoom(getZoom() - 1)"
      >
        <Icon name="ph:minus" class="size-5 text-muted-600 dark:text-muted-300" />
      </button>
      <button
        class="w-10 h-10 bg-white dark:bg-muted-800 rounded-xl shadow-lg flex items-center justify-center hover:bg-muted-50 dark:hover:bg-muted-700 transition-colors border border-muted-200 dark:border-muted-600"
        @click="loadEmployeeLocations"
      >
        <Icon name="ph:crosshair" class="size-5 text-muted-600 dark:text-muted-300" />
      </button>
    </div>

    <!-- Loading Overlay -->
    <div
      v-if="!map"
      class="absolute inset-0 bg-muted-100 dark:bg-muted-800 rounded-2xl flex items-center justify-center"
    >
      <div class="text-center">
        <div class="animate-spin rounded-full h-10 w-10 border-4 border-primary-600 border-t-transparent mx-auto mb-3"></div>
        <div class="text-sm text-muted-600 dark:text-muted-400">جاري تحميل الخريطة...</div>
      </div>
    </div>

    <!-- Loading Data Overlay -->
    <div
      v-if="isLoadingData && map"
      class="absolute top-20 right-4 bg-white dark:bg-muted-800 rounded-xl px-4 py-2 shadow-lg border border-muted-200 dark:border-muted-600"
    >
      <div class="flex items-center gap-2">
        <div class="animate-spin rounded-full h-4 w-4 border-2 border-primary-600 border-t-transparent"></div>
        <span class="text-sm text-muted-600 dark:text-muted-400">جاري تحميل المواقع...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="map && !isLoadingData && employees.length === 0"
      class="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <div class="bg-white dark:bg-muted-800 rounded-2xl p-6 shadow-lg border border-muted-200 dark:border-muted-600 text-center pointer-events-auto">
        <Icon name="ph:map-pin-line" class="size-12 text-muted-400 mx-auto mb-3" />
        <p class="text-muted-600 dark:text-muted-400">لا توجد بيانات موقع للموظفين</p>
      </div>
    </div>
  </div>
</template>

<style>
/* Info window custom styles - remove white background */
.gm-style-iw {
  padding: 0 !important;
  border-radius: 12px !important;
  overflow: visible !important;
  background: transparent !important;
}

.gm-style-iw-d {
  overflow: visible !important;
  padding: 0 !important;
  background: transparent !important;
}

.gm-style-iw-c {
  padding: 0 !important;
  border-radius: 12px !important;
  box-shadow: none !important;
  background: transparent !important;
}

/* Hide close button */
.gm-style-iw button.gm-ui-hover-effect {
  display: none !important;
}

/* Hide the white arrow/tail */
.gm-style-iw-tc {
  display: none !important;
}

/* Hide the white arrow below tooltip */
.gm-style-iw-tc::after {
  display: none !important;
}

/* Remove white background from wrapper */
.gm-style .gm-style-iw-t::after {
  display: none !important;
}

/* Hide Google Maps attribution for cleaner look */
.gm-style-cc {
  display: none !important;
}

/* Custom zoom controls positioning */
.gm-bundled-control {
  display: none !important;
}
</style>
