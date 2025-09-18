<template>
  <div class="bg-white rounded-3xl p-6 w-full h-full">
    <!-- Header -->
    <div class="flex flex-col items-start gap-1 mb-8">
      <span class="text-[#9291A5] text-lg font-normal">احصائية</span>
      <h3 class="text-[#1E1B39] font-bold text-[22px] leading-tight">
        نسبة المسجلين
      </h3>
    </div>

    <!-- Divider -->
    <hr class="border-[#E5E5EF] border-solid border-t ">

    <!-- Chart Container -->
    <div class="flex flex-col items-center gap-6">
      <!-- Donut Chart -->
      <div class="relative w-full h-[350px]">
        <AddonApexcharts
          type="donut"
          :height="350"
          :width="'100%'"
          :series="chartData.series"
          :options="chartOptions"
        />
        
        <!-- Center Content -->
        <div class="absolute inset-2 top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
          <span class="text-[#1E1B39] text-[20px] font-bold">1323209</span>
          <span class="text-[#9291A5] text-sm font-normal mb-2">العدد الكلي للممتحنين</span>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex items-center gap-8">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <div class="w-[14px] h-[14px] bg-[#831307] rounded-3xl"></div>

            <span class="text-[#615E83] text-[22px] font-medium">الحضور</span>
          </div>
          <span class="text-[#9291A5] text-lg font-normal">410</span>

        </div>
        
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <div class="w-[14px] h-[14px] bg-[#CDD2E5] rounded-2xl"></div>
            <span class="text-[#615E83] text-[22px] font-medium">الغياب</span>
          </div>
          <span class="text-[#9291A5] text-lg font-normal">142</span>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'

// Chart data
const chartData = {
  series: [410, 142, 657], // الحضور، الغياب، remaining to total 1209
}

// Chart options
const chartOptions: ApexOptions = {
  chart: {
    type: 'donut',
    fontFamily: 'Tajawal, sans-serif',
    toolbar: {
      show: false
    },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
    }
  },
  colors: [
    '#831307', // الحضور - Dark red
    '#CDD2E5', // الغياب - Light gray
    '#EBEDF6'  // Remaining - Very light gray
  ],
  labels: ['الحضور', 'الغياب', 'مجدولين'],
  legend: {
    show: false // Using custom legend
  },
  tooltip: {
    enabled: true,
    style: {
      fontSize: '14px',
      fontFamily: 'Tajawal, sans-serif',
    },
    y: {
      formatter: (value: number) => {
        const percentage = ((value / 1209) * 100).toFixed(0)
        return `${value} (${percentage}%)`
      }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => {
      return Math.round(val) + '%'
    },
    style: {
      fontSize: '17px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 700,
      colors: ['#FFFFFF', '#050F2A', '#050F2A']
    },
    dropShadow: {
      enabled: false
    }
  },
  plotOptions: {
    pie: {
      donut: {
        size: '45%',
        labels: {
          show: false // We're using custom center content
        }
      },
      expandOnClick: false,
      customScale: 1
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
    }
  },
  responsive: [{
    breakpoint: 768,
    options: {
      chart: {
        width: 250,
        height: 250
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

:deep(.apexcharts-datalabels-group) {
  filter: none !important;
}
</style>