import { defineStore } from 'pinia'
import { ref } from 'vue'
import { zoneService } from '../service'
import type {
  ZoneDto,
  ZoneCreateDto,
  ZoneUpdateDto,
  ZoneFilters,
  ZoneStatsDto,
  PointInZoneRequest,
  BulkZoneOperationRequest,
  MapBounds,
  Coordinate,
  DrawingMode,
} from '../types'

export const useZoneStore = defineStore('zone', () => {
  // State
  const zones = ref<ZoneDto[]>([])
  const isLoading = ref(false)
  const filters = ref<ZoneFilters>({
    pageSize: 10,
    pageNumber: 1,
    name: '',
    description: '',
    zoneType: '',
    isOperational: undefined,
    searchTerm: '',
    includePolygonCoordinates: true,
    includeParsedPolygon: true,
  })
  const isCreateDialogOpen = ref(false)
  const isEditDialogOpen = ref(false)
  const isMapDialogOpen = ref(false)
  const selectedZoneId = ref<string | number | null>(null)
  const selectedZone = ref<ZoneDto | null>(null)
  const totalPages = ref(0)
  
  // Map state
  const mapCenter = ref<Coordinate>({ lat: 24.7136, lng: 46.6753 }) // Riyadh coordinates
  const mapZoom = ref(10)
  const drawingMode = ref<DrawingMode>('none')
  const currentPolygon = ref<Coordinate[]>([])
  const mapZones = ref<ZoneDto[]>([])
  
  // Statistics
  const zoneStats = ref<ZoneStatsDto | null>(null)

  // Methods
  const getZones = async () => {
    try {
      isLoading.value = true
      const response = await zoneService.getPaged(filters.value)
      zones.value = response.data
      totalPages.value = response.pagesCount
    } catch (error) {
      console.error('Error fetching zones:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getZoneById = async (id: string | number) => {
    try {
      isLoading.value = true
      const response = await zoneService.getById(id)
      selectedZone.value = response
      return response
    } catch (error) {
      console.error(`Error fetching zone with id ${id}:`, error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getZonesByBounds = async (bounds: MapBounds) => {
    try {
      const response = await zoneService.getByBounds(bounds)
      mapZones.value = response
      return response
    } catch (error) {
      console.error('Error fetching zones by bounds:', error)
      throw error
    }
  }

  const createZone = async (data: ZoneCreateDto) => {
    try {
      isLoading.value = true
      await zoneService.create(data)
      await getZones()
    } catch (error) {
      console.error('Error creating zone:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateZone = async (data: ZoneUpdateDto) => {
    try {
      if (!selectedZoneId.value) {
        throw new Error('No zone selected for update')
      }
      isLoading.value = true
      await zoneService.update(selectedZoneId.value, data)
      await getZones()
    } catch (error) {
      console.error('Error updating zone:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deleteZone = async (id: string | number) => {
    try {
      isLoading.value = true
      await zoneService.delete(id)
      await getZones()
    } catch (error) {
      console.error(`Error deleting zone with id ${id}:`, error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getStatistics = async () => {
    try {
      const response = await zoneService.getStatistics()
      zoneStats.value = response
      return response
    } catch (error) {
      console.error('Error fetching zone statistics:', error)
      throw error
    }
  }

  const findZonesContainingPoint = async (request: PointInZoneRequest) => {
    try {
      const response = await zoneService.findZonesContainingPoint(request)
      return response
    } catch (error) {
      console.error('Error finding zones containing point:', error)
      throw error
    }
  }

  const bulkOperation = async (request: BulkZoneOperationRequest) => {
    try {
      const response = await zoneService.bulkOperation(request)
      await getZones() // Refresh zones after bulk operation
      return response
    } catch (error) {
      console.error('Error performing bulk operation:', error)
      throw error
    }
  }

  const setSelectedZone = (zone: ZoneDto | null) => {
    selectedZone.value = zone
    selectedZoneId.value = zone?.id || null
  }

  const openCreateDialog = () => {
    selectedZone.value = null
    selectedZoneId.value = null
    currentPolygon.value = []
    isCreateDialogOpen.value = true
  }

  const openEditDialog = (zone: ZoneDto) => {
    setSelectedZone(zone)
    // Convert GeoJSON coordinates to our coordinate format
    if (zone.polygon?.coordinates && zone.polygon.coordinates.length > 0) {
      const geoCoords = zone.polygon.coordinates[0] // First ring of polygon
      currentPolygon.value = geoCoords.map(coord => ({
        lat: coord[1], // GeoJSON is [lng, lat]
        lng: coord[0]
      }))
    } else {
      currentPolygon.value = []
    }
    isEditDialogOpen.value = true
  }

  const openMapDialog = (zone?: ZoneDto) => {
    if (zone) {
      setSelectedZone(zone)
      // Convert GeoJSON coordinates to our coordinate format
      if (zone.polygon?.coordinates && zone.polygon.coordinates.length > 0) {
        const geoCoords = zone.polygon.coordinates[0] // First ring of polygon
        currentPolygon.value = geoCoords.map(coord => ({
          lat: coord[1], // GeoJSON is [lng, lat]
          lng: coord[0]
        }))
        // Center map on zone
        if (zone.centerLatitude && zone.centerLongitude) {
          mapCenter.value = {
            lat: zone.centerLatitude,
            lng: zone.centerLongitude
          }
        }
      } else {
        currentPolygon.value = []
      }
    } else {
      currentPolygon.value = []
    }
    isMapDialogOpen.value = true
  }

  const setDrawingMode = (mode: DrawingMode) => {
    drawingMode.value = mode
  }

  const setCurrentPolygon = (coordinates: Coordinate[]) => {
    currentPolygon.value = coordinates
  }

  const clearCurrentPolygon = () => {
    currentPolygon.value = []
  }

  // Helper function to calculate bounds from coordinates
  const calculateBounds = (coordinates: Coordinate[]): MapBounds => {
    if (coordinates.length === 0) {
      return { north: 0, south: 0, east: 0, west: 0 }
    }

    let north = coordinates[0].lat
    let south = coordinates[0].lat
    let east = coordinates[0].lng
    let west = coordinates[0].lng

    coordinates.forEach(coord => {
      north = Math.max(north, coord.lat)
      south = Math.min(south, coord.lat)
      east = Math.max(east, coord.lng)
      west = Math.min(west, coord.lng)
    })

    return { north, south, east, west }
  }

  // Return all reactive properties and methods
  return {
    zones,
    isLoading,
    filters,
    getZones,
    getZoneById,
    getZonesByBounds,
    createZone,
    updateZone,
    deleteZone,
    getStatistics,
    findZonesContainingPoint,
    bulkOperation,
    isCreateDialogOpen,
    isEditDialogOpen,
    isMapDialogOpen,
    selectedZoneId,
    selectedZone,
    setSelectedZone,
    openCreateDialog,
    openEditDialog,
    openMapDialog,
    totalPages,
    
    // Map state and methods
    mapCenter,
    mapZoom,
    drawingMode,
    currentPolygon,
    mapZones,
    setDrawingMode,
    setCurrentPolygon,
    clearCurrentPolygon,
    calculateBounds,
    zoneStats,
  }
})
