import type { LocationTimestampDto } from "."

export interface TooltipData {
  employeeId: number
  recordedAt?: string
}

export interface TooltipStyles {
  background?: string
  borderRadius?: string
  padding?: string
  minWidth?: string
  boxShadow?: string
  fontFamily?: string
  onlineColor?: string
  offlineColor?: string
}

export interface MarkerIconOptions {
  size?: number
  avatarRadius?: number
  pinColor?: string
  pinRadius?: number
  borderWidth?: number
}

export interface MapOptions {
  center: { lat: number; lng: number }
  zoom: number
  mapTypeId?: string
  streetViewControl?: boolean
  mapTypeControl?: boolean
  fullscreenControl?: boolean
  zoomControl?: boolean
  styles?: any[]
}

export interface UseEmployeeMarkersOptions {
  onMarkerClick?: (point: LocationTimestampDto) => void
  /** When false, hides the "View Details" button in the marker tooltip */
  showDetailsButton?: boolean
}