<template>
  <div class="bg-white rounded-[20px] p-6 w-full h-full min-h-[490px]" style="box-shadow: 0px 2px 6px 0px rgba(13, 10, 44, 0.08)">
    <!-- Header with Dropdown and Title -->
    <div class="flex justify-between items-center mb-8">
        <!-- Title -->
      <div class="flex flex-col items-start gap-1">
        <span class="text-[#9291A5] text-lg font-normal">طلبة</span>
        <h3 class="text-[#1E1B39] font-bold text-[22px] leading-tight">
          الحضور حسب القاعة
        </h3>
      </div>
      <!-- Dropdown -->
      <div class="bg-[#F8F8FF] rounded-[20px] px-4 py-3 flex items-center gap-6 min-w-[131px]">
        <span class="text-[#615E83] font-medium text-sm">شهر</span>
        <div class="flex flex-col gap-1">
          <div class="w-[6px] h-[6px] bg-[#D9D9D9] rounded"></div>
          <div class="w-[6px] h-[6px] bg-[#D9D9D9] rounded"></div>
        </div>
      </div>
      
      
    </div>

    <!-- Divider -->
    <hr class="border-[#E5E5EF] border-solid border-t mb-8">

    <!-- Chart Container -->
    <div class="relative w-full h-[350px]">
      <AddonApexcharts
        type="bar"
        :height="350"
        :width="'100%'"
        :series="chartData.series"
        :options="chartOptions"
      />
      
    
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'

// Reactive state for tooltip
const tooltipVisible = ref(false)
const tooltipPosition = ref({ left: '0px', top: '0px' })
const tooltipContent = ref('')

// Chart data - halls with their attendance values
const hallLabels = ['قاعة 1', 'قاعة 2', 'قاعة 3', 'قاعة 4', 'قاعة 5', 'قاعة 6', 'قاعة 7', 'قاعة 8', 'قاعة 9', 'قاعة 10', 'قاعة 11', 'قاعة 12', 'قاعة 13', 'قاعة 14']
const attendanceData = [2500, 1200, 2800, 1800, 1500, 1800, 1500, 1800, 1500, 3000, 1000, 1000, 1000, 2200]

const chartData = {
  series: [{
    name: 'الحضور',
    data: attendanceData
  }]
}

// Chart options
const chartOptions: ApexOptions = {
  chart: {
    type: 'bar',
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
    events: {
      dataPointMouseEnter: handleDataPointHover,
      dataPointMouseLeave: handleDataPointLeave
    }
  },
  colors: ['#A01E11'],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.5,
      gradientToColors: ['#750D02'],
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100]
    }
  },
  plotOptions: {
    bar: {
      borderRadius: 7,
      borderRadiusApplication: 'end',
      columnWidth: '38px',
      dataLabels: {
        position: 'top',
      }
    }
  },
  grid: {
    show: true,
    borderColor: '#E5E5EF',
    strokeDashArray: 7,
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
    categories: hallLabels,
    labels: {
      style: {
        colors: '#615E83',
        fontSize: '12px',
        fontFamily: 'Tajawal, sans-serif',
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
    max: 3000,
    tickAmount: 3,
    labels: {
      style: {
        colors: '#615E83',
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 400
      },
      formatter: (value: number) => {
        if (value >= 1000) {
          return (value / 1000) + 'k'
        }
        return value.toString()
      }
    }
  },
  legend: {
    show: true
  },
  tooltip: {
    enabled: true // Using custom tooltip
  },
  dataLabels: {
    enabled: true
  },
  states: {
    normal: {
      filter: {
        type: 'none'
      }
    },
    hover: {
      filter: {
        type: 'lighten',
        value: 0.1
      }
    },
    active: {
      allowMultipleDataPointsSelection: false,
      filter: {
        type: 'darken',
        value: 0.1
      }
    }
  },
  responsive: [{
    breakpoint: 768,
    options: {
      chart: {
        height: 250
      },
      plotOptions: {
        bar: {
          columnWidth: '60%'
        }
      }
    }
  }]
}

// Handle tooltip events
function handleDataPointHover(event: any, chartContext: any, config: any) {
  if (config.dataPointIndex >= 0) {
    tooltipVisible.value = true
    tooltipContent.value = `${attendanceData[config.dataPointIndex].toLocaleString()}`
    
    // Position tooltip near the hovered point
    const rect = event.target.getBoundingClientRect()
    tooltipPosition.value = {
      left: `${rect.left + rect.width / 2 - 30}px`,
      top: `${rect.top - 60}px`
    }
  }
}

function handleDataPointLeave() {
  tooltipVisible.value = false
}
</script>

<style scoped>
/* Custom chart styling */
:deep(.apexcharts-canvas) {
  font-family: 'Tajawal', sans-serif;
}

:deep(.apexcharts-bar-area) {
  fill: url(#gradient) !important;
}

/* Inactive bars styling */
:deep(.apexcharts-series[seriesName="الحضور"] .apexcharts-bar-area:not(.apexcharts-bar-area-selected)) {
  fill: #750d02  !important;
}

/* Active/highlighted bar */
:deep(.apexcharts-series[seriesName="الحضور"] .apexcharts-bar-area:nth-child(10)) {
  fill: url(#gradient) !important;
}
</style>