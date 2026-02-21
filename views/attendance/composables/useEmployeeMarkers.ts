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
   * Create a marker icon for a location point
   */
  const createEmployeeMarkerIcon = (employeeId: number): string => {
    const avatarNumber = ((employeeId - 1) % 24) + 1
    const avatarImg = avatarCache.value.get(avatarNumber)
    return createMarkerIcon(avatarImg, true)
  }

  /**
   * Create tooltip content for a location point
   */
  const createEmployeeTooltip = (point: LocationTimestampDto): string => {
    const recordedAt = point.recordedAt
      ? new Date(point.recordedAt).toLocaleString('ar-IQ', {
          dateStyle: 'short',
          timeStyle: 'short',
        })
      : undefined
    return createTooltipHtml(
      { employeeId: point.employeeId, recordedAt },
      {},
      options.showDetailsButton !== false
    )
  }

  /**
   * Clear all markers from the map
   */
  const clearMarkers = () => {
    markers.value.forEach(marker => {
      marker.setMap(null)
    })
    markers.value = []

    infoWindows.value.forEach(iw => {
      iw.close()
      iw._pinned = false
    })
    infoWindows.value = []
  }

  /**
   * Create a single marker for a location point
   */
  const createMarker = (point: LocationTimestampDto): any => {
    if (!map.value || !window.google) return null
    if (point.latitude == null || point.longitude == null) return null

    const position = {
      lat: point.latitude,
      lng: point.longitude
    }

    const markerSize = getMarkerSize()
    const markerAnchor = getMarkerAnchor()

    const marker = new window.google.maps.Marker({
      map: map.value,
      position,
      title: `موظف #${point.employeeId}`,
      icon: {
        url: createEmployeeMarkerIcon(point.employeeId),
        scaledSize: new window.google.maps.Size(markerSize.width, markerSize.height),
        anchor: new window.google.maps.Point(markerAnchor.x, markerAnchor.y)
      }
    })

    // Create info window for tooltip
    const infoWindow = new window.google.maps.InfoWindow({
      content: createEmployeeTooltip(point),
      disableAutoPan: true,
      pixelOffset: new window.google.maps.Size(0, -10)
    })

    infoWindows.value.push(infoWindow)

    let isPinned = false

    marker.addListener('mouseover', () => {
      if (!isPinned) {
        infoWindow.open(map.value!, marker)
      }
    })

    marker.addListener('mouseout', () => {
      if (!isPinned) {
        infoWindow.close()
      }
    })

    marker.addListener('click', () => {
      // Unpin all other info windows
      infoWindows.value.forEach(iw => {
        iw.close()
        iw._pinned = false
      })

      isPinned = true
      infoWindow._pinned = true
      infoWindow.open(map.value!, marker)

      map.value?.panTo(position)
      map.value?.setZoom(16)
    })

    window.google.maps.event.addListener(infoWindow, 'closeclick', () => {
      isPinned = false
      infoWindow._pinned = false
    })

    if (options.showDetailsButton !== false) {
      window.google.maps.event.addListener(infoWindow, 'domready', () => {
        const btn = document.querySelector(`.employee-detail-btn[data-employee-id="${point.employeeId}"]`)
        if (btn) {
          btn.addEventListener('click', () => {
            options.onMarkerClick?.(point)
          })
        }
      })
    }

    markers.value.push(marker)
    return marker
  }

  /**
   * Update markers for a list of location points
   * @param preserveView - If true, keeps the current zoom and center instead of fitting bounds
   */
  const updateMarkers = (points: LocationTimestampDto[], preserveView = false): any => {
    if (!map.value || !window.google) return null

    // Clear existing markers
    clearMarkers()

    const bounds = new window.google.maps.LatLngBounds()
    let hasValidLocations = false

    // Create markers for each point
    points.forEach(point => {
      if (point.latitude == null || point.longitude == null) return

      const marker = createMarker(point)
      if (marker) {
        bounds.extend({
          lat: point.latitude,
          lng: point.longitude
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
