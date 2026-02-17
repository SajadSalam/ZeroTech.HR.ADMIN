import type { LocationTimestampDto } from '../types'
import type { UseEmployeeMarkersOptions } from '../types/employeeMap'
import { createMarkerIcon, getMarkerSize, getMarkerAnchor } from '../utils/createMarkerIcon'
import { createTooltipHtml } from '../utils/createTooltipHtml'


export function useEmployeeMarkers(
  map: Ref<any>,
  avatarCache: Ref<Map<number, HTMLImageElement>>,
  options: UseEmployeeMarkersOptions = {}
) {
  const markers = ref<any[]>([])
  const infoWindows = ref<any[]>([])

  /**
   * Create a marker icon for an employee
   */
  const createEmployeeMarkerIcon = (employeeId: number, isOnline: boolean): string => {
    const avatarNumber = ((employeeId - 1) % 24) + 1
    const avatarImg = avatarCache.value.get(avatarNumber)
    return createMarkerIcon(avatarImg, isOnline)
  }

  /**
   * Create tooltip content for an employee
   */
  const createEmployeeTooltip = (employee: LocationTimestampDto): string => {
    return createTooltipHtml({
      fullName: employee.fullName,
      branchName: employee.branchName,
      isOnline: employee.isLocationRecent,
      timeSinceLastUpdate: employee.timeSinceLastUpdate
    })
  }

  /**
   * Clear all markers from the map
   */
  const clearMarkers = () => {
    markers.value.forEach(marker => {
      marker.setMap(null)
    })
    markers.value = []

    infoWindows.value.forEach(iw => iw.close())
    infoWindows.value = []
  }

  /**
   * Create a single marker for an employee
   */
  const createMarker = (employee: LocationTimestampDto): google.maps.Marker | null => {
    if (!map.value || !window.google) return null
    if (!employee.currentLatitude || !employee.currentLongitude) return null

    const position = {
      lat: employee.currentLatitude,
      lng: employee.currentLongitude
    }

    const markerSize = getMarkerSize()
    const markerAnchor = getMarkerAnchor()

    const isOnline = employee.isLocationRecent
    const marker = new window.google.maps.Marker({
      map: map.value,
      position,
      title: employee.fullName,
      icon: {
        url: createEmployeeMarkerIcon(employee.id, isOnline),
        scaledSize: new window.google.maps.Size(markerSize.width, markerSize.height),
        anchor: new window.google.maps.Point(markerAnchor.x, markerAnchor.y)
      }
    })

    // Create info window for tooltip
    const infoWindow = new window.google.maps.InfoWindow({
      content: createEmployeeTooltip(employee),
      disableAutoPan: true,
      pixelOffset: new window.google.maps.Size(0, -10)
    })

    infoWindows.value.push(infoWindow)

    // Add hover events
    marker.addListener('mouseover', () => {
      infoWindow.open(map.value!, marker)
    })

    marker.addListener('mouseout', () => {
      infoWindow.close()
    })

    // Click to keep tooltip open and center map
    marker.addListener('click', () => {
      // Close all other info windows
      infoWindows.value.forEach(iw => iw.close())
      infoWindow.open(map.value!, marker)

      // Center map on the clicked marker
      map.value?.panTo(position)
      map.value?.setZoom(16)

      // Call optional callback
      options.onMarkerClick?.(employee)
    })

    markers.value.push(marker)
    return marker
  }

  /**
   * Update markers for a list of employees
   * @param preserveView - If true, keeps the current zoom and center instead of fitting bounds
   */
  const updateMarkers = (employees: LocationTimestampDto[], preserveView = false): google.maps.LatLngBounds | null => {
    if (!map.value || !window.google) return null

    // Clear existing markers
    clearMarkers()

    const bounds = new window.google.maps.LatLngBounds()
    let hasValidLocations = false

    // Create markers for each employee
    employees.forEach(employee => {
      if (!employee.currentLatitude || !employee.currentLongitude) return

      const marker = createMarker(employee)
      if (marker) {
        bounds.extend({
          lat: employee.currentLatitude,
          lng: employee.currentLongitude
        })
        hasValidLocations = true
      }
    })

    // Fit map to bounds if we have locations and not preserving view
    if (hasValidLocations && !preserveView) {
      if (markers.value.length > 1) {
        map.value.fitBounds(bounds)
      } else if (markers.value.length === 1) {
        map.value.setCenter(bounds.getCenter())
        map.value.setZoom(15)
      }
    }

    return hasValidLocations ? bounds : null
  }

  /**
   * Close all info windows
   */
  const closeAllInfoWindows = () => {
    infoWindows.value.forEach(iw => iw.close())
  }

  return {
    // State
    markers,
    infoWindows,

    // Methods
    createMarker,
    clearMarkers,
    updateMarkers,
    closeAllInfoWindows,
    createEmployeeMarkerIcon,
    createEmployeeTooltip
  }
}
