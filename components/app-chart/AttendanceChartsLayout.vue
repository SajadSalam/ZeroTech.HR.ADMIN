<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-6">
    <!-- Donut Chart -->
     
    <!-- Bar Chart -->
    <div class="col-span-2">
      <AppChartHallAttendanceBarChart />
    </div>
    <div class="col-span-1">
      <AppChartAttendanceDonutChart />
    </div>
    
  </div>
</template>

<script setup lang="ts">
// This component combines both attendance charts in the layout shown in Figma
</script>
