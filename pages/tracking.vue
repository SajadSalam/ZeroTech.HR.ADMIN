<script setup lang="ts">
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import type { BaseFilters } from '~/utils/types/ApiResponses'
import AppTable from '~/components/app-table/AppTable.vue'
import { useSubjectStore } from '~/views/subjects/store'
import { tableHeader } from '~/views/subjects'
import SubjectCreate from '~/views/subjects/components/SubjectCreate.vue'
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'
import SubjectEdit from '~/views/subjects/components/SubjectEdit.vue'
import type { Subject, SubjectDto, SubjectFilters } from '~/views/subjects/types'
import { useAuthStore } from '~/views/auth/store/auth'
import EmployeeTrackingMap from '~/views/attendance/components/EmployeeTrackingMap.vue'
import { useAttendanceStore } from '~/views/attendance/store'
definePageMeta({
  title: 'tracking',
  description: 'track-employees-and-their-activities',
})

const attendanceStore = useAttendanceStore()
const appTableStore = useAppTableStore()
const isLoading = computed(() => attendanceStore.isLoading)
const locationTimestamps = computed(() => attendanceStore.locationTimestamps || [])
const getLocationTimestamps = async () => {
  appTableStore.setLoading(true)
  await attendanceStore.getLocationTimestamp()
  appTableStore.setLoading(false)
}
getLocationTimestamps()
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
      <EmployeeTrackingMap />
  </div>
</template>
