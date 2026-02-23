<script setup lang="ts">
import { useAttendanceStore } from '~/views/attendance/store'
import { zoneService } from '~/views/zones/service'
import type { MapZoneDisplay } from '~/views/attendance/types'
import EmployeesLocation from '~/views/attendance/components/EmployeesLocation.vue'

definePageMeta({
  title: 'tracking',
  description: 'track-employees-and-their-activities',
})

const attendanceStore = useAttendanceStore()
const zonesToDisplay = ref<MapZoneDisplay[]>([])
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
    <EmployeesLocation :zones-to-display="zonesToDisplay" />
  </div>
</template>