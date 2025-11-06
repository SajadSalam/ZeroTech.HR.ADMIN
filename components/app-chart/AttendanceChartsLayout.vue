<template>
  <div class="space-y-6">
    <!-- Month Selector Header -->
  

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      <!-- Bar Chart - Student counts per group -->
      <div class="col-span-2">
        <AppChartGroupStudentCountsChart 
          v-if="groupStudentCounts"
          :data="groupStudentCounts"
        />
        <div v-else class="flex items-center justify-center h-64 bg-white rounded-3xl">
          <span class="text-gray-500">لا توجد بيانات للعرض</span>
        </div>
      </div>
      
      <!-- Donut Chart - Pass/Fail -->
      <div class="col-span-1">
        <AppChartPassFailStudentsChart 
          v-if="passFailChartData"
          :data="passFailChartData.data"
          :groups="passFailChartData.groups"
          :subjects="passFailChartData.subjects"
        />
        <div v-else class="flex items-center justify-center h-64 bg-white rounded-3xl">
          <span class="text-gray-500">لا توجد بيانات للعرض</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { GroupStudentCount, PassFailChartData, RegisteredStudentsStatistics } from '~/views/home/types/counts';

interface Props {
  registeredStudentsStatistics?: RegisteredStudentsStatistics | null
  passFailChartData?: PassFailChartData | null
  groupStudentCounts?: GroupStudentCount[] | null
}

const props = defineProps<Props>()
</script>
