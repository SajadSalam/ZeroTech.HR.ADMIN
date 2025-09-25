<template>
  <div class="bg-white rounded-xl p-6 w-full h-full min-h-[470px]">
    <!-- Header with Title and Dropdown -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex flex-col">
        <h3 class="text-[#000B23] font-bold text-xl leading-tight">
          الحجز حسب الوقت والمادة
        </h3>
      </div>
    </div>

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
import type { ApexOptions } from 'apexcharts';
import type { MonthlyIncome } from '~/views/financial-dashboard/types';

// Props
interface Props {
  data?: MonthlyIncome[] | null
}

const props = defineProps<Props>()

// Chart data
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

// Transform API data to chart format
const transformDataToChartSeries = (apiData: MonthlyIncome[] | null) => {
  if (!apiData) {
    // Return empty data arrays if no data provided
    return [
      {
        name: 'الايرادات الكلية',
        type: 'line',
        data: Array(12).fill(0)
      },
    ]
  }

  // Create arrays for 12 months, initialized with 0
  const allData = Array(12).fill(0)

  // Helper to resolve month index from string like 'JAN' or number-like values
  const getMonthIndex = (m: unknown): number => {
    if (typeof m === 'number') {
      return m >= 1 && m <= 12 ? m - 1 : -1
    }
    if (typeof m === 'string') {
      const num = Number(m)
      if (!Number.isNaN(num)) {
        return num >= 1 && num <= 12 ? num - 1 : -1
      }
      const abbr = m.trim().slice(0, 3).toUpperCase()
      return months.indexOf(abbr)
    }
    return -1
  }

  // Fill data arrays with API data
  apiData.forEach(item => {
    const idx = getMonthIndex((item as any).month)
    if (idx >= 0 && idx < 12) {
      allData[idx] = item.income
    }
  })


  return [
    {
      name: 'الايرادات الكلية',
      type: 'line',
      data: allData
    },
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
  padding: 10px !important;
}

:deep(.apexcharts-tooltip-title) {
  background: transparent !important;
  border: none !important;
  color: white !important;
  font-size: 12px !important;
}
</style>