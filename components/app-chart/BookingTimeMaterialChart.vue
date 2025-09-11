<template>
  <div class="bg-white rounded-xl p-6 w-full h-full min-h-[470px]">
    <!-- Header with Title and Dropdown -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex flex-col">
        <h3 class="text-[#000B23] font-bold text-xl leading-tight">
          الحجز حسب الوقت والمادة
        </h3>
      </div>
      
      <div class="flex items-center gap-4">
        <!-- Legend -->
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-[#4A3AFF] rounded"></div>
            <span class="text-[#615E83] text-sm font-medium">امتحان كفاءة اللغة الانجليزية</span>
          </div>
          <div class="h-4 w-px bg-black"></div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-black rounded"></div>
            <span class="text-[#615E83] text-sm font-medium">امتحان كفاءة اللغة العربي</span>
          </div>
          <div class="h-4 w-px bg-black"></div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded" style="background: linear-gradient(180deg, #A01E11 0%, #750D02 100%)"></div>
            <span class="text-[#615E83] text-sm font-medium">امتحان كفاءة الحاسوب</span>
          </div>
        </div>

        <!-- Dropdown -->
        <div class="bg-[#F8F8FF] rounded-xl px-4 py-3 flex items-center gap-6 min-w-[131px]">
          <span class="text-[#615E83] font-bold text-sm">شهر</span>
          <div class="flex flex-col gap-1">
            <div class="w-[6px] h-[6px] bg-[#D9D9D9] rounded"></div>
            <div class="w-[6px] h-[6px] bg-[#D9D9D9] rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="w-full h-[350px]">
      <AddonApexcharts
        type="line"
        :height="350"
        :width="undefined"
        :series="chartData.series"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'

// Chart data
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const chartData = {
  series: [
    {
      name: 'امتحان كفاءة اللغة الانجليزية',
      type: 'line',
      data: [2, 4, 6, 8, 10, 12, 10, 8, 6, 4, 2, 1]
    },
    {
      name: 'امتحان كفاءة اللغة العربي',
      type: 'line',
      data: [1, 3, 5, 7, 9, 11, 9, 7, 5, 3, 1, 0.5]
    },
    {
      name: 'امتحان كفاءة الحاسوب',
      type: 'line',
      data: [0.5, 2, 4, 6, 8, 10, 8, 6, 4, 2, 0.5, 0.2]
    }
  ]
}

// Chart options
const chartOptions: ApexOptions = {
  chart: {
    type: 'line',
    fontFamily: 'Tajawal, sans-serif',
    toolbar: {
      show: false
    },
    background: 'transparent',
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
    },
    zoom: {
      enabled: false
    }
  },
  colors: [
    '#2461FB', // Blue line for English test
    '#474B4E', // Black/gray line for Arabic test  
    '#A01E11'  // Red line for Computer test
  ],
  stroke: {
    width: [6, 6, 6],
    curve: 'smooth',
    dashArray: [0, 0, 0]
  },
  grid: {
    show: true,
    borderColor: '#C9CBCD',
    strokeDashArray: 6,
    position: 'back',
    xaxis: {
      lines: {
        show: false
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    },
    padding: {
      top: 0,
      right: 30,
      bottom: 0,
      left: 20
    }
  },
  xaxis: {
    categories: months,
    labels: {
      style: {
        colors: '#474B4E',
        fontSize: '12px',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 400
      },
      offsetY: 0
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    min: 0,
    max: 12,
    tickAmount: 6,
    labels: {
      style: {
        colors: '#474B4E',
        fontSize: '12px',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 400
      },
      formatter: (value: number): string => {
        return value.toString()
      }
    }
  },
  legend: {
    show: false // Using custom legend
  },
  tooltip: {
    enabled: true,
    shared: true,
    intersect: false,
    style: {
      fontSize: '12px',
      fontFamily: 'Tajawal, sans-serif',
    }
  },
  markers: {
    size: 0,
    hover: {
      size: 8
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.5,
      gradientToColors: ['#87A7F7', '#474B4E', '#750D02'],
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100]
    }
  },
  responsive: [{
    breakpoint: 768,
    options: {
      chart: {
        height: 300
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
}
</script>

<style scoped>
/* Custom chart styling */
:deep(.apexcharts-canvas) {
  font-family: 'Tajawal', sans-serif;
}

:deep(.apexcharts-tooltip) {
  background: #292D30 !important;
  border: none !important;
  border-radius: 35px !important;
  color: white !important;
}

:deep(.apexcharts-tooltip-title) {
  background: transparent !important;
  border: none !important;
  color: white !important;
  font-size: 12px !important;
}
</style>