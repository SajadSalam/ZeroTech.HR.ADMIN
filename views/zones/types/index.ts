import type { BaseDto, BaseFilters } from '~/utils/types'

// Coordinate type for polygon points
export type Coordinate = {
  lat: number
  lng: number
}

// GeoJSON Polygon structure
export type GeoJSONPolygon = {
  type: 'Polygon'
  coordinates: number[][][] // [[[lng, lat], [lng, lat], ...]]
}

// Base zone type
export type Zone = {
  name: string
  description?: string
  polygonCoordinates: string // GeoJSON string
  zoneType?: string
  color?: string
  opacity?: number
  priority?: number
  metadata?: string // JSON string
  isOperational: boolean
}

// Zone DTO with BaseDto extension
export type ZoneDto = BaseDto & Zone & {
  areaSquareMeters?: number
  formattedArea?: string
  centerLatitude?: number
  centerLongitude?: number
  polygon?: GeoJSONPolygon // Parsed polygon object
}

// Create zone DTO
export type ZoneCreateDto = Zone

// Update zone DTO
export type ZoneUpdateDto = Zone & {
  id: number | string
}

// Zone filters extending BaseFilters
export type ZoneFilters = BaseFilters & {
  name?: string
  description?: string
  zoneType?: string
  isOperational?: boolean
  searchTerm?: string
  minPriority?: number
  maxPriority?: number
  minAreaSquareMeters?: number
  maxAreaSquareMeters?: number
  northLatitude?: number
  southLatitude?: number
  eastLongitude?: number
  westLongitude?: number
  includePolygonCoordinates?: boolean
  includeParsedPolygon?: boolean
}

// Zone statistics DTO
export type ZoneStatsDto = {
  totalZones: number
  operationalZones: number
  inactiveZones: number
  totalAreaSquareMeters: number
  formattedTotalArea: string
  zonesByType: Record<string, number>
  zonesByPriority: Record<string, number>
  largestZone: {
    id: number
    name: string
    areaSquareMeters: number
    formattedArea: string
  }
  smallestZone: {
    id: number
    name: string
    areaSquareMeters: number
    formattedArea: string
  }
}

// Point in zone request
export type PointInZoneRequest = {
  latitude: number
  longitude: number
  operationalOnly?: boolean
}

// Bulk operation request
export type BulkZoneOperationRequest = {
  zoneIds: number[]
  operation: 'activate' | 'deactivate' | 'delete' | 'updatePriority' | 'updateColor' | 'updateType'
  parameters?: Record<string, any>
}

// Map configuration
export type MapConfig = {
  center: Coordinate
  zoom: number
  mapTypeId?: string
}

// Drawing mode for map
export type DrawingMode = 'none' | 'polygon' | 'edit'

// Map bounds for zone queries
export type MapBounds = {
  north: number
  south: number
  east: number
  west: number
}
