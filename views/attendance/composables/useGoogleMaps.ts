/**
 * Composable for Google Maps initialization and API loading
 */

import type { MapOptions } from "../types/employeeMap"

// Extend Window interface for Google Maps
declare global {
  interface Window {
    google: any
  }
}

const DEFAULT_OPTIONS: MapOptions = {
  center: { lat: 33.3152, lng: 44.3661 }, // Baghdad, Iraq
  zoom: 14,
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: true,
  zoomControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'on' }]
    }
  ]
}

export function useGoogleMaps(apiKey?: string) {
  // Use provided API key or get from runtime config
  const runtimeConfig = useRuntimeConfig()
  const resolvedApiKey = apiKey || runtimeConfig.public.googleMapsApiKey || 'AIzaSyCaCtuz1gOGSgHAtj6QNaboAb7D1poz36E'

  const map = ref<any>(null)
  const mapContainer = ref<HTMLDivElement>()
  const isLoaded = ref(false)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  /**
   * Load Google Maps API script
   */
  const loadAPI = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (window.google?.maps) {
        isLoaded.value = true
        resolve(window.google.maps)
        return
      }

      isLoading.value = true
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${resolvedApiKey}`
      script.async = true
      script.defer = true

      script.onload = () => {
        if (window.google?.maps) {
          isLoaded.value = true
          isLoading.value = false
          resolve(window.google.maps)
        } else {
          const err = new Error('Google Maps API failed to load')
          error.value = err
          isLoading.value = false
          reject(err)
        }
      }

      script.onerror = () => {
        const err = new Error('Failed to load Google Maps API')
        error.value = err
        isLoading.value = false
        reject(err)
      }

      document.head.appendChild(script)
    })
  }

  /**
   * Initialize the map
   */
  const initializeMap = (options: Partial<MapOptions> = {}): any => {
    if (!mapContainer.value || !window.google) {
      console.error('Map container or Google Maps API not available')
      return null
    }

    const mergedOptions = { ...DEFAULT_OPTIONS, ...options }

    map.value = new window.google.maps.Map(mapContainer.value, {
      center: mergedOptions.center,
      zoom: mergedOptions.zoom,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      streetViewControl: mergedOptions.streetViewControl,
      mapTypeControl: mergedOptions.mapTypeControl,
      fullscreenControl: mergedOptions.fullscreenControl,
      zoomControl: mergedOptions.zoomControl,
      styles: mergedOptions.styles
    })

    return map.value
  }

  /**
   * Set map zoom level
   */
  const setZoom = (zoom: number) => {
    map.value?.setZoom(zoom)
  }

  /**
   * Get current zoom level
   */
  const getZoom = (): number => {
    return map.value?.getZoom() || DEFAULT_OPTIONS.zoom
  }

  /**
   * Pan to a specific location
   */
  const panTo = (position: { lat: number; lng: number }) => {
    map.value?.panTo(position)
  }

  /**
   * Fit map to bounds
   */
  const fitBounds = (bounds: any) => {
    map.value?.fitBounds(bounds)
  }

  /**
   * Set map center
   */
  const setCenter = (position: { lat: number; lng: number }) => {
    map.value?.setCenter(position)
  }

  return {
    // State
    map,
    mapContainer,
    isLoaded,
    isLoading,
    error,
    
    // Methods
    loadAPI,
    initializeMap,
    setZoom,
    getZoom,
    panTo,
    fitBounds,
    setCenter,
    
    // Constants
    DEFAULT_CENTER: DEFAULT_OPTIONS.center,
    DEFAULT_ZOOM: DEFAULT_OPTIONS.zoom
  }
}
