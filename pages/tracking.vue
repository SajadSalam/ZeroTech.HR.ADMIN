<script setup lang="ts">
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import EmployeeTrackingMap from '~/views/attendance/components/EmployeeTrackingMap.vue'
import { useAttendanceStore } from '~/views/attendance/store'
import { zoneService } from '~/views/zones/service'
import type { MapZoneDisplay } from '~/views/attendance/types'

definePageMeta({
  title: 'tracking',
  description: 'track-employees-and-their-activities',
})

const attendanceStore = useAttendanceStore()
const appTableStore = useAppTableStore()
const isLoading = computed(() => attendanceStore.isLoading)
const locationTimestamps = computed(() => attendanceStore.locationTimestamps || [])
const zonesToDisplay = ref<MapZoneDisplay[]>([])

const getLocationTimestamps = async () => {
  appTableStore.setLoading(true)
  await attendanceStore.getLocationTimestamp()
  appTableStore.setLoading(false)
}

const loadZonesForMap = async () => {
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

onMounted(async () => {
  await loadZonesForMap()
  getLocationTimestamps()
})

onUnmounted(() => {
  attendanceStore.filters = {
    pageSize: 10,
    pageNumber: 1,
    startDate: '',
    endDate: '',
    employeeId: null,
  }
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
      <EmployeeTrackingMap :zones-to-display="zonesToDisplay" />
  </div>
</template>
