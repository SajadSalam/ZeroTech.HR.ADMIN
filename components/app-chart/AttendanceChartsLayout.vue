<template>
  <div class="space-y-6">
    <!-- Month Selector Header -->
  

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      <!-- Donut Chart -->
       
      <!-- Bar Chart -->
      <div class="col-span-2">
        <AppChartHallAttendanceBarChart />
      </div>
      <div class="col-span-1">
        <AppChartAttendanceDonutChart 
          v-if="registeredStudentsStatistics"
          :data="registeredStudentsStatistics" 
        />
        <div v-else class="flex items-center justify-center h-64 bg-white rounded-3xl">
          <span class="text-gray-500">لا توجد بيانات للعرض</span>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RegisteredStudentsStatistics } from '~/views/home/types/counts';

interface Props {
  registeredStudentsStatistics?: RegisteredStudentsStatistics | null
}

const props = defineProps<Props>()
</script>
