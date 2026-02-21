<script setup lang="ts">
import EmployeeTrackingMap from '~/views/attendance/components/EmployeeTrackingMap.vue'
import { useAttendanceStore } from '~/views/attendance/store'
import { zoneService } from '~/views/zones/service'
import type { LocationTimestampDto, MapZoneDisplay } from '~/views/attendance/types'

definePageMeta({
  title: 'tracking',
  description: 'track-employees-and-their-activities',
})

/** Set to true to use mock data and see the map without API */
const USE_MOCK_DATA = true

const MOCK_ZONES: MapZoneDisplay[] = [
  {
    id: 'mock-zone-1',
    name: 'منطقة المكتب الرئيسي',
    polygonCoordinates: JSON.stringify({
      type: 'Polygon',
      coordinates: [[
        [44.35, 33.30],
        [44.39, 33.30],
        [44.39, 33.34],
        [44.35, 33.34],
        [44.35, 33.30],
      ]],
    }),
    color: '#10B981',
    opacity: 0.25,
    isOperational: true,
  },
]

const MOCK_EMPLOYEES: LocationTimestampDto[] = [
  { id: 1, employeeId: 101, latitude: 33.3152, longitude: 44.3661, recordedAt: new Date().toISOString(), clientTimestamp: new Date().toISOString() },
  { id: 2, employeeId: 102, latitude: 33.318, longitude: 44.37, recordedAt: new Date().toISOString(), clientTimestamp: new Date().toISOString() },
  { id: 3, employeeId: 103, latitude: 33.312, longitude: 44.36, recordedAt: new Date().toISOString(), clientTimestamp: new Date().toISOString() },
]

const attendanceStore = useAttendanceStore()
const zonesToDisplay = ref<MapZoneDisplay[]>([])
const employeesToDisplay = ref<LocationTimestampDto[] | undefined>(USE_MOCK_DATA ? MOCK_EMPLOYEES : undefined)

const loadZonesForMap = async () => {
  if (USE_MOCK_DATA) {
    zonesToDisplay.value = MOCK_ZONES
    return
  }
  try {
    const response = await zoneService.getPaged({
      pageSize: 50,
      pageNumber: 1,
      includePolygonCoordinates: true,
      includeParsedPolygon: true,
    })
    zonesToDisplay.value = (response.items || []).map(zone => ({
      id: zone.id,
      name: zone.name,
      polygonCoordinates: zone.polygonCoordinates,
      color: zone.color,
      opacity: zone.opacity,
      isOperational: zone.isOperational,
    }))
  } catch (error) {
    console.error('Error loading zones for map:', error)
  }
}

const router = useRouter()

const handleEmployeeClicked = (employeeId: number) => {
    router.push(`/tracking/${employeeId}`)
}

onMounted(async () => {
    await loadZonesForMap()
})

onUnmounted(() => {
  attendanceStore.filters = {
    pageSize: 10,
    pageNumber: 1,
    startDate: '',
    endDate: '',
    employeeId: null,
  }
  attendanceStore.locationTimestamps = []
})

</script>

<template>
  <div class="flex flex-col gap-4 bg-white p-4 rounded-lg">
    <div>
      <h1 class="text-xl font-bold">
        تتبع الموظفين
      </h1>
        <p>
          يمكنك تتبع الموظفين ومعرفة مكانهم في الوقت الفعلي.
        </p>
    </div>
      <EmployeeTrackingMap
        :zones-to-display="zonesToDisplay"
        :employees-to-display="employeesToDisplay"
        @employee-clicked="handleEmployeeClicked"
        :show-details-button="false"
      />
  </div>
</template>
