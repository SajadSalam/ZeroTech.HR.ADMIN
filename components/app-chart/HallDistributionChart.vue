<template>
  <div class="bg-white rounded-[20px] p-6 w-full" >
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <span class="text-[#9291A5] font-normal text-[18px]">
          احصائية
        </span>
        <h3 class="text-[#1E1B39] font-bold text-lg leading-tight">
          عدد المسجلين حسب القاعات
        </h3>
      </div>
    </div>

    <!-- Divider -->
    <hr class="border-[#E5E5EF] border-solid border-t mb-6">

    <!-- Chart Container with Custom Indicators -->
    <div class="relative flex items-center justify-center h-[320px]">
      <!-- Main Pie Chart -->
      <div class="w-full h-[277px] relative">
        <AddonApexcharts
          type="pie"
          :height="277"
          :width="'100%'"
          :series="chartData.series"
          :options="chartOptions"
          @dataPointMouseEnter="handleMouseEnter"
          @dataPointMouseLeave="handleMouseLeave"
        />
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'

// Reactive state for hover interactions
const hoveredIndex = ref<number | null>(null)

// Chart data with corrected values to match the Figma design
const chartData = {
  series: [124, 72, 95], // قاعة 2, قاعة 1, قاعة 3
}

// Mouse event handlers
const handleMouseEnter = (event: any, chartContext: any, config: any) => {
  hoveredIndex.value = config.dataPointIndex
}

const handleMouseLeave = () => {
  hoveredIndex.value = null
}

// Chart options matching Figma design exactly
const chartOptions: ApexOptions = {
  chart: {
    type: 'pie',
    fontFamily: 'Tajawal, sans-serif',
    toolbar: {
      show: false
    },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
    },
    events: {
      dataPointMouseEnter: handleMouseEnter,
      dataPointMouseLeave: handleMouseLeave
    }
  },
  colors: [
    // قاعة 2: Red gradient (using primary color from gradient)
    '#A01E11',
    // قاعة 1: Light red (exact from Figma)
    'rgba(117, 13, 2, 0.13)',
    // قاعة 3: Blue gradient (using primary color from gradient)
    '#0075AD'
  ],
  labels: ['قاعة 2', 'قاعة 1', 'قاعة 3'],
  legend: {
    show: true // Using custom indicators instead
  },
  tooltip: {
    enabled: true // Using custom indicators instead
  },
  dataLabels: {
    enabled: true
  },
  plotOptions: {
    pie: {
      donut: {
        size: '0%'
      },
      expandOnClick: true,
      customScale: 1,
      offsetX: 0,
      offsetY: 0
    }
  },
  stroke: {
    show: false
  },
  states: {
    hover: {
      filter: {
        type: 'lighten',
        value: 0.1
      }
    },
    active: {
      filter: {
        type: 'darken',
        value: 0.1
      }
    }
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      }
    }
  }]
}
</script>

<style scoped>
/* Custom styles for RTL support */
.chart-container {
  direction: rtl;
}
</style>