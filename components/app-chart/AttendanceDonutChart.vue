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
          <span class="text-[#1E1B39] text-[20px] font-bold">{{ totalRegistered.toLocaleString() }}</span>
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
          <span class="text-[#9291A5] text-lg font-normal">{{ chartData.presenced }}</span>

        </div>
        
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <div class="w-[14px] h-[14px] bg-[#CDD2E5] rounded-2xl"></div>
            <span class="text-[#615E83] text-[22px] font-medium">الغياب</span>
          </div>
          <span class="text-[#9291A5] text-lg font-normal">{{ chartData.absenced }}</span>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApexOptions } from 'apexcharts';
import type { RegisteredStudentsStatistics } from '~/views/home/types/counts';

interface Props {
  data: RegisteredStudentsStatistics
}

const props = defineProps<Props>()

// Chart data - computed from API data
const chartData = computed(() => {
  const presenced = props.data.totalStudentsPresencedInExams || 0
  const absenced = props.data.totalStudentsAbsencedInExams || 0
  const booked = props.data.totalStudentsBookedExams || 0
  const scheduled = booked - (presenced + absenced) // المجدولين = المحجوزين - (الحضور + الغياب)
  
  return {
    series: [presenced, absenced, scheduled],
    presenced,
    absenced,
    booked
  }
})

// Total registered students
const totalRegistered = computed(() => props.data.totalRegisteredStudents || 0)

// Chart options
const chartOptions = computed<ApexOptions>(() => ({
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
        const total = chartData.value.booked || 1
        const percentage = ((value / total) * 100).toFixed(1)
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
      fontSize: '14px',
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
        size: '60%',
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
}))
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