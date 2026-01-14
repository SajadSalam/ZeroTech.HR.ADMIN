import type { Coordinate } from '../types'

/**
 * Parse GeoJSON polygon coordinates string and convert to Coordinate array
 * @param polygonCoordinates - GeoJSON string or object with polygon coordinates
 * @returns Array of Coordinate objects {lat, lng} or empty array if parsing fails
 */
export function parseGeoJsonPolygon(polygonCoordinates: string | object | null | undefined): Coordinate[] {
  if (!polygonCoordinates) return []

  try {
    const geoJson = typeof polygonCoordinates === 'string'
      ? JSON.parse(polygonCoordinates)
      : polygonCoordinates

    if (geoJson.type === 'Polygon' && geoJson.coordinates?.[0]) {
      // Convert GeoJSON [lng, lat] to {lat, lng} format
      const coordinates: Coordinate[] = geoJson.coordinates[0].map((coord: number[]) => ({
        lat: coord[1],
        lng: coord[0]
      }))

      // Remove the last point if it's the same as the first (closing point)
      if (coordinates.length > 1) {
        const first = coordinates[0]
        const last = coordinates[coordinates.length - 1]
        if (first.lat === last.lat && first.lng === last.lng) {
          coordinates.pop()
        }
      }

      return coordinates
    }
  } catch (e) {
    console.error('Error parsing polygonCoordinates:', e)
  }

  return []
}
