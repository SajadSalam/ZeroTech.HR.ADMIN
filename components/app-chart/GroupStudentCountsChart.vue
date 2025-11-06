<template>
    <div class="bg-white rounded-[20px] p-6 w-full h-full min-h-[490px]">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
            <!-- Title -->
            <div class="flex flex-col items-start gap-1">
                <span class="text-[#9291A5] text-lg font-normal">احصائية</span>
                <h3 class="text-[#1E1B39] font-bold text-[22px] leading-tight">
                    عدد الطلاب في كل مجموعة
                </h3>
            </div>
        </div>

        <!-- Divider -->
        <hr class="border-[#E5E5EF] border-solid border-t mb-8">

        <!-- Chart Container -->
        <div class="relative w-full h-[350px]">
            <div v-if="!data?.length" class="flex items-center justify-center h-full">
                <div class="text-gray-500">لا توجد بيانات للعرض</div>
            </div>
            <AddonApexcharts v-else type="bar" :height="350" :series="chartData.series" :options="chartOptions" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'

interface GroupStudentCount {
  groupId: number
  groupName: string
  studentCount: number
}

interface Props {
  data: GroupStudentCount[]
}

const props = defineProps<Props>()

// Chart data
const chartData = computed(() => {
  return {
    series: [
      {
        name: "عدد الطلاب",
        data: props.data.map(group => group.studentCount)
      }
    ],
    categories: props.data.map(group => group.groupName)
  }
})

const chartOptions = computed((): ApexOptions => ({
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
    categories: chartData.value.categories,
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
    show: false
  },
  tooltip: {
    enabled: true,
    style: {
      fontSize: '12px',
      fontFamily: 'Tajawal, sans-serif',
    },
    y: {
      formatter: (val: number) => {
        return val + ' طالب'
      }
    }
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: '12px',
      fontFamily: 'Tajawal, sans-serif',
      fontWeight: 'bold',
      colors: ['#fff']
    },
    formatter: (val: number) => {
      if (val >= 1000) {
        return (val / 1000) + 'k'
      }
      return val.toString()
    }
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
}))
</script>

<style scoped>
</style>

