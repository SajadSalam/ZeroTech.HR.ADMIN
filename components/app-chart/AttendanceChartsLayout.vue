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
        <AppChartAttendanceDonutChart />
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">

</script>
