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

      </div>
    </div>

    <!-- Chart Container -->
    <div class="w-full h-[350px]">
      <AddonApexcharts
        v-if="chartData.series.some(series => series.data.some(value => value > 0))"
        type="line"
        :height="350"
        :width="undefined"
        :series="chartData.series"
        :options="chartOptions"
      />
      <div v-else class="w-full h-[350px] flex items-center justify-center">
        <div class="text-center">
          <div class="text-gray-400 text-lg mb-2">لا توجد بيانات للعرض</div>
          <div class="text-gray-500 text-sm">لم يتم العثور على بيانات امتحانات لهذا العام</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApexOptions } from 'apexcharts';
import type { ProficiencyExamGroupChartData } from '~/views/home/types/proficiencyExamGroupChartData';

// Props
interface Props {
  data?: ProficiencyExamGroupChartData | null
}

const props = defineProps<Props>()

// Chart data
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

// Transform API data to chart format
const transformDataToChartSeries = (apiData: ProficiencyExamGroupChartData | null) => {
  if (!apiData) {
    // Return empty data arrays if no data provided
    return [
      {
        name: 'امتحان كفاءة اللغة الانجليزية',
        type: 'line',
        data: Array(12).fill(0)
      },
      {
        name: 'امتحان كفاءة اللغة العربي',
        type: 'line',
        data: Array(12).fill(0)
      },
      {
        name: 'امتحان كفاءة الحاسوب',
        type: 'line',
        data: Array(12).fill(0)
      }
    ]
  }

  // Create arrays for 12 months, initialized with 0
  const englishData = Array(12).fill(0)
  const arabicData = Array(12).fill(0)
  const computerData = Array(12).fill(0)

  // Fill data arrays with API data (month is 1-based, array is 0-based)
  apiData.englishExams?.forEach(exam => {
    if (exam.month >= 1 && exam.month <= 12) {
      englishData[exam.month - 1] = exam.totalStudentsUsedTickets
    }
  })

  apiData.arabicExams?.forEach(exam => {
    if (exam.month >= 1 && exam.month <= 12) {
      arabicData[exam.month - 1] = exam.totalStudentsUsedTickets
    }
  })

  apiData.computerExams?.forEach(exam => {
    if (exam.month >= 1 && exam.month <= 12) {
      computerData[exam.month - 1] = exam.totalStudentsUsedTickets
    }
  })

  return [
    {
      name: 'امتحان كفاءة اللغة الانجليزية',
      type: 'line',
      data: englishData
    },
    {
      name: 'امتحان كفاءة اللغة العربي',
      type: 'line',
      data: arabicData
    },
    {
      name: 'امتحان كفاءة الحاسوب',
      type: 'line',
      data: computerData
    }
  ]
}

const chartData = computed(() => ({
  series: transformDataToChartSeries(props.data || null)
}))

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
    labels: {
      style: {
        colors: '#474B4E',
        fontSize: '12px',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 400
      },
      formatter: (value: number): string => {
        return Math.round(value).toString()
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