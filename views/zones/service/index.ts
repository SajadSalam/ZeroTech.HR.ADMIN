import axios from '~/services/app-client/axios'
import type { PaginatedResponse } from '~/utils/types'
import type {
  ZoneDto,
  ZoneCreateDto,
  ZoneUpdateDto,
  ZoneFilters,
  ZoneStatsDto,
  PointInZoneRequest,
  BulkZoneOperationRequest,
  MapBounds,
} from '../types'

interface IZoneService {
  getAll: () => Promise<ZoneDto[]>
  getPaged: (filters: ZoneFilters) => Promise<PaginatedResponse<ZoneDto>>
  getById: (id: string | number) => Promise<ZoneDto>
  getByBounds: (bounds: MapBounds) => Promise<ZoneDto[]>
  create: (data: ZoneCreateDto) => Promise<ZoneDto>
  update: (id: string | number, data: ZoneUpdateDto) => Promise<ZoneDto>
  delete: (id: string | number) => Promise<void>
  findZonesContainingPoint: (request: PointInZoneRequest) => Promise<ZoneDto[]>
  getStatistics: () => Promise<ZoneStatsDto>
  bulkOperation: (request: BulkZoneOperationRequest) => Promise<{ affectedCount: number }>
}

export class ZoneService implements IZoneService {
  private baseUrl = '/Zone'

  async getAll(): Promise<ZoneDto[]> {
    try {
      const response = await axios.get(this.baseUrl)
      return response.data
    } catch (error) {
      console.error('Error fetching all zones:', error)
      throw error
    }
  }

  async getPaged(filters: ZoneFilters): Promise<PaginatedResponse<ZoneDto>> {
    try {
      const params = new URLSearchParams()
      
      if (filters.pageNumber) params.append('pageNumber', filters.pageNumber.toString())
      if (filters.pageSize) params.append('pageSize', filters.pageSize.toString())
      if (filters.name) params.append('name', filters.name)
      if (filters.description) params.append('description', filters.description)
      if (filters.zoneType) params.append('zoneType', filters.zoneType)
      if (filters.isOperational !== undefined) params.append('isOperational', filters.isOperational.toString())
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm)
      if (filters.minPriority) params.append('minPriority', filters.minPriority.toString())
      if (filters.maxPriority) params.append('maxPriority', filters.maxPriority.toString())
      if (filters.minAreaSquareMeters) params.append('minAreaSquareMeters', filters.minAreaSquareMeters.toString())
      if (filters.maxAreaSquareMeters) params.append('maxAreaSquareMeters', filters.maxAreaSquareMeters.toString())
      if (filters.northLatitude) params.append('northLatitude', filters.northLatitude.toString())
      if (filters.southLatitude) params.append('southLatitude', filters.southLatitude.toString())
      if (filters.eastLongitude) params.append('eastLongitude', filters.eastLongitude.toString())
      if (filters.westLongitude) params.append('westLongitude', filters.westLongitude.toString())
      if (filters.includePolygonCoordinates !== undefined) params.append('includePolygonCoordinates', filters.includePolygonCoordinates.toString())
      if (filters.includeParsedPolygon !== undefined) params.append('includeParsedPolygon', filters.includeParsedPolygon.toString())

      const response = await axios.get(`${this.baseUrl}/paged?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching paged zones:', error)
      throw error
    }
  }

  async getById(id: string | number): Promise<ZoneDto> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching zone with id ${id}:`, error)
      throw error
    }
  }

  async getByBounds(bounds: MapBounds): Promise<ZoneDto[]> {
    try {
      const params = new URLSearchParams()
      params.append('northLatitude', bounds.north.toString())
      params.append('southLatitude', bounds.south.toString())
      params.append('eastLongitude', bounds.east.toString())
      params.append('westLongitude', bounds.west.toString())
      params.append('includeParsedPolygon', 'true')

      const response = await axios.get(`${this.baseUrl}/paged?${params.toString()}`)
      return response.data.data || response.data
    } catch (error) {
      console.error('Error fetching zones by bounds:', error)
      throw error
    }
  }

  async create(data: ZoneCreateDto): Promise<ZoneDto> {
    try {
      const response = await axios.post(this.baseUrl, data)
      return response.data
    } catch (error) {
      console.error('Error creating zone:', error)
      throw error
    }
  }

  async update(id: string | number, data: ZoneUpdateDto): Promise<ZoneDto> {
    try {
      const response = await axios.put(`${this.baseUrl}/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Error updating zone with id ${id}:`, error)
      throw error
    }
  }

  async delete(id: string | number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      console.error(`Error deleting zone with id ${id}:`, error)
      throw error
    }
  }

  async findZonesContainingPoint(request: PointInZoneRequest): Promise<ZoneDto[]> {
    try {
      const response = await axios.post(`${this.baseUrl}/point-in-zones`, request)
      return response.data
    } catch (error) {
      console.error('Error finding zones containing point:', error)
      throw error
    }
  }

  async getStatistics(): Promise<ZoneStatsDto> {
    try {
      const response = await axios.get(`${this.baseUrl}/stats`)
      return response.data
    } catch (error) {
      console.error('Error fetching zone statistics:', error)
      throw error
    }
  }

  async bulkOperation(request: BulkZoneOperationRequest): Promise<{ affectedCount: number }> {
    try {
      const response = await axios.post(`${this.baseUrl}/bulk-operation`, request)
      return response.data
    } catch (error) {
      console.error('Error performing bulk operation:', error)
      throw error
    }
  }
}

export const zoneService = new ZoneService()
