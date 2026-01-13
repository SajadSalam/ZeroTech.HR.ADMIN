<script setup lang="ts">
import { useZoneStore } from '../store'
import type { Coordinate, ZoneDto } from '../types'

const zoneStore = useZoneStore()

// Map container ref
const mapContainer = ref<HTMLDivElement>()
const map = ref<any>(null)
const drawingManager = ref<any>(null)
const currentPolygonOverlay = ref<any>(null)
const zoneOverlays = ref<any[]>([])

// Props
interface Props {
  height?: string
  showDrawingTools?: boolean
  showZones?: boolean
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: '400px',
  showDrawingTools: true,
  showZones: true,
  readonly: false,
})

// Computed
const mapCenter = computed(() => zoneStore.mapCenter)
const mapZoom = computed(() => zoneStore.mapZoom)
const drawingMode = computed(() => zoneStore.drawingMode)
const currentPolygon = computed(() => zoneStore.currentPolygon)
const mapZones = computed(() => zoneStore.mapZones)

// Initialize Google Maps
const initializeMap = () => {
  if (!mapContainer.value || !window.google) return

  // Create map
  map.value = new window.google.maps.Map(mapContainer.value, {
    center: mapCenter.value,
    zoom: mapZoom.value,
    mapTypeId: window.google.maps.MapTypeId.ROADMAP,
    streetViewControl: false,
    mapTypeControl: true,
    fullscreenControl: true,
    zoomControl: true,
  })

  // Initialize drawing manager if drawing tools are enabled
  if (props.showDrawingTools && !props.readonly) {
    initializeDrawingManager()
  }

  // Load existing zones if enabled
  if (props.showZones) {
    loadZonesOnMap()
  }

  // Load current polygon if exists
  if (currentPolygon.value.length > 0) {
    displayCurrentPolygon()
  }
}

// Initialize drawing manager
const initializeDrawingManager = () => {
  if (!map.value || !window.google) return

  drawingManager.value = new window.google.maps.drawing.DrawingManager({
    drawingMode: null,
    drawingControl: true,
    drawingControlOptions: {
      position: window.google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
    },
    polygonOptions: {
      fillColor: '#3B82F6',
      fillOpacity: 0.3,
      strokeColor: '#1D4ED8',
      strokeWeight: 2,
      clickable: false,
      editable: true,
      zIndex: 1,
    },
  })

  drawingManager.value.setMap(map.value)

  // Handle polygon complete
  drawingManager.value.addListener('polygoncomplete', (polygon: any) => {
    handlePolygonComplete(polygon)
  })
}

// Handle polygon drawing completion
const handlePolygonComplete = (polygon: any) => {
  // Clear previous polygon
  if (currentPolygonOverlay.value) {
    currentPolygonOverlay.value.setMap(null)
  }

  // Store the new polygon
  currentPolygonOverlay.value = polygon

  // Extract coordinates
  const coordinates: Coordinate[] = []
  const path = polygon.getPath()
  
  for (let i = 0; i < path.getLength(); i++) {
    const point = path.getAt(i)
    coordinates.push({
      lat: point.lat(),
      lng: point.lng(),
    })
  }

  // Update store
  zoneStore.setCurrentPolygon(coordinates)

  // Add edit listeners
  polygon.getPath().addListener('set_at', () => updatePolygonCoordinates(polygon))
  polygon.getPath().addListener('insert_at', () => updatePolygonCoordinates(polygon))

  // Disable drawing mode
  drawingManager.value.setDrawingMode(null)
  zoneStore.setDrawingMode('edit')
}

// Update polygon coordinates when edited
const updatePolygonCoordinates = (polygon: any) => {
  const coordinates: Coordinate[] = []
  const path = polygon.getPath()
  
  for (let i = 0; i < path.getLength(); i++) {
    const point = path.getAt(i)
    coordinates.push({
      lat: point.lat(),
      lng: point.lng(),
    })
  }

  zoneStore.setCurrentPolygon(coordinates)
}

// Display current polygon from store
const displayCurrentPolygon = () => {
  if (!map.value || !window.google || currentPolygon.value.length === 0) return

  // Clear existing polygon
  if (currentPolygonOverlay.value) {
    currentPolygonOverlay.value.setMap(null)
  }

  // Create polygon path
  const path = currentPolygon.value.map(coord => 
    new window.google.maps.LatLng(coord.lat, coord.lng)
  )

  // Create polygon
  currentPolygonOverlay.value = new window.google.maps.Polygon({
    paths: path,
    fillColor: '#3B82F6',
    fillOpacity: 0.3,
    strokeColor: '#1D4ED8',
    strokeWeight: 2,
    editable: !props.readonly,
    clickable: false,
  })

  currentPolygonOverlay.value.setMap(map.value)

  // Add edit listeners if not readonly
  if (!props.readonly) {
    currentPolygonOverlay.value.getPath().addListener('set_at', () => 
      updatePolygonCoordinates(currentPolygonOverlay.value)
    )
    currentPolygonOverlay.value.getPath().addListener('insert_at', () => 
      updatePolygonCoordinates(currentPolygonOverlay.value)
    )
  }

  // Fit map to polygon bounds
  const bounds = new window.google.maps.LatLngBounds()
  path.forEach(point => bounds.extend(point))
  map.value.fitBounds(bounds)
}

// Load zones on map
const loadZonesOnMap = async () => {
  if (!map.value || !window.google) return

  // Clear existing zone overlays
  zoneOverlays.value.forEach(overlay => overlay.setMap(null))
  zoneOverlays.value = []

  // Get current map bounds
  const bounds = map.value.getBounds()
  if (!bounds) return

  const mapBounds = {
    north: bounds.getNorthEast().lat(),
    south: bounds.getSouthWest().lat(),
    east: bounds.getNorthEast().lng(),
    west: bounds.getSouthWest().lng(),
  }

  try {
    await zoneStore.getZonesByBounds(mapBounds)
    
    // Display zones
    mapZones.value.forEach(zone => {
      if (zone.polygon?.coordinates && zone.polygon.coordinates.length > 0) {
        // Convert GeoJSON coordinates to Google Maps LatLng
        const geoCoords = zone.polygon.coordinates[0] // First ring of polygon
        const path = geoCoords.map(coord => 
          new window.google.maps.LatLng(coord[1], coord[0]) // GeoJSON is [lng, lat]
        )

        const polygon = new window.google.maps.Polygon({
          paths: path,
          fillColor: zone.color || (zone.isOperational ? '#10B981' : '#6B7280'),
          fillOpacity: zone.opacity || 0.2,
          strokeColor: zone.color || (zone.isOperational ? '#059669' : '#4B5563'),
          strokeWeight: 2,
          clickable: true,
        })

        polygon.setMap(map.value)
        zoneOverlays.value.push(polygon)

        // Add click listener for zone info
        polygon.addListener('click', () => {
          showZoneInfo(zone)
        })
      }
    })
  } catch (error) {
    console.error('Error loading zones on map:', error)
  }
}

// Show zone info window
const showZoneInfo = (zone: ZoneDto) => {
  if (!map.value || !window.google) return

  const infoWindow = new window.google.maps.InfoWindow({
    content: `
      <div class="p-2">
        <h4 class="font-semibold text-gray-900">${zone.name}</h4>
        <p class="text-sm text-gray-600">${zone.description || 'لا يوجد وصف'}</p>
        <div class="mt-2 text-xs text-gray-500">
          <div>المساحة: ${zone.formattedArea || 'غير محسوبة'}</div>
          <div>النوع: ${zone.zoneType || 'غير محدد'}</div>
          <div>الحالة: ${zone.isOperational ? 'تشغيلي' : 'غير تشغيلي'}</div>
        </div>
      </div>
    `,
  })

  // Use zone center if available, otherwise calculate from polygon
  let position
  if (zone.centerLatitude && zone.centerLongitude) {
    position = new window.google.maps.LatLng(zone.centerLatitude, zone.centerLongitude)
  } else if (zone.polygon?.coordinates && zone.polygon.coordinates.length > 0) {
    const bounds = new window.google.maps.LatLngBounds()
    const geoCoords = zone.polygon.coordinates[0]
    geoCoords.forEach(coord => {
      bounds.extend(new window.google.maps.LatLng(coord[1], coord[0]))
    })
    position = bounds.getCenter()
  }

  if (position) {
    infoWindow.setPosition(position)
    infoWindow.open(map.value)
  }
}

// Clear current polygon
const clearPolygon = () => {
  if (currentPolygonOverlay.value) {
    currentPolygonOverlay.value.setMap(null)
    currentPolygonOverlay.value = null
  }
  zoneStore.clearCurrentPolygon()
  zoneStore.setDrawingMode('none')
}

// Enable drawing mode
const enableDrawing = () => {
  if (drawingManager.value) {
    drawingManager.value.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON)
    zoneStore.setDrawingMode('polygon')
  }
}

// Load Google Maps API
const loadGoogleMapsAPI = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google.maps)
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCaCtuz1gOGSgHAtj6QNaboAb7D1poz36E&libraries=drawing`
    script.async = true
    script.defer = true
    
    script.onload = () => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps)
      } else {
        reject(new Error('Google Maps API failed to load'))
      }
    }
    
    script.onerror = () => reject(new Error('Failed to load Google Maps API'))
    document.head.appendChild(script)
  })
}

// Lifecycle
onMounted(async () => {
  try {
    await loadGoogleMapsAPI()
    await nextTick()
    initializeMap()
  } catch (error) {
    console.error('Error initializing map:', error)
  }
})

onUnmounted(() => {
  // Cleanup
  if (currentPolygonOverlay.value) {
    currentPolygonOverlay.value.setMap(null)
  }
  zoneOverlays.value.forEach(overlay => overlay.setMap(null))
})

// Watch for polygon changes
watch(currentPolygon, (newPolygon) => {
  if (newPolygon.length > 0 && map.value) {
    displayCurrentPolygon()
  }
}, { deep: true })

// Expose methods for parent components
defineExpose({
  clearPolygon,
  enableDrawing,
  loadZonesOnMap,
})
</script>

<template>
  <div class="relative">
    <!-- Map Container -->
    <div
      ref="mapContainer"
      class="w-full rounded-lg border border-muted-200 dark:border-muted-700"
      :style="{ height: props.height }"
    />

    <!-- Map Controls -->
    <div v-if="showDrawingTools && !readonly" class="absolute top-4 left-4 flex flex-col gap-2">
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

    <!-- Drawing Status -->
    <div v-if="drawingMode !== 'none'" class="absolute bottom-4 left-4 right-4">
      <div class="bg-white dark:bg-muted-800 rounded-lg p-3 shadow-lg border">
        <div class="flex items-center gap-2">
          <Icon 
            :name="drawingMode === 'polygon' ? 'ph:cursor-click-duotone' : 'ph:pencil-duotone'" 
            class="size-4 text-primary-500" 
          />
          <span class="text-sm font-medium text-muted-700 dark:text-muted-300">
            {{ drawingMode === 'polygon' ? 'انقر لرسم المنطقة' : 'يمكنك تعديل المنطقة بسحب النقاط' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Polygon Info -->
    <div v-if="currentPolygon.length > 0" class="absolute top-4 right-4">
      <div class="bg-white dark:bg-muted-800 rounded-lg p-3 shadow-lg border">
        <div class="text-sm">
          <div class="font-medium text-muted-700 dark:text-muted-300 mb-1">
            معلومات المنطقة
          </div>
          <div class="text-muted-600 dark:text-muted-400">
            عدد النقاط: {{ currentPolygon.length }}
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="!map" class="absolute inset-0 bg-muted-100 dark:bg-muted-800 rounded-lg flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
        <div class="text-sm text-muted-600 dark:text-muted-400">جاري تحميل الخريطة...</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure map container has proper dimensions */
.map-container {
  min-height: 300px;
}

/* Google Maps controls styling */
:deep(.gm-style-cc) {
  display: none !important;
}

:deep(.gm-bundled-control) {
  margin: 8px !important;
}
</style>
