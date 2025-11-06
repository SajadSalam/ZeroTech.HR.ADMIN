<template>
    <div class="bg-white rounded-[20px] p-6 w-full h-full min-h-[490px]">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
            <!-- Title -->
            <div class="flex flex-col items-start gap-1">
                <span class="text-[#9291A5] text-lg font-normal">احصائية</span>
                <h3 class="text-[#1E1B39] font-bold text-[22px] leading-tight">
                    عدد الطلاب حسب الكليات
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

interface CollegeStudentCount {
  collegeId: number
  collegeName: string
  studentCount: number
}

interface Props {
  data: CollegeStudentCount[]
}

const props = defineProps<Props>()

// Chart data
const chartData = computed(() => {
  return {
    series: [
      {
        name: "عدد الطلاب",
        data: props.data.map(college => college.studentCount)
      }
    ],
    categories: props.data.map(college => college.collegeName)
  }
})

const chartOptions = computed((): ApexOptions => ({
  chart: {
    type: 'bar',
    height: 350,
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
  colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'horizontal',
      shadeIntensity: 0.4,
      gradientToColors: undefined,
      inverseColors: true,
      opacityFrom: 0.85,
      opacityTo: 0.85,
      stops: [50, 0, 100]
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 7,
      borderRadiusApplication: 'end',
      barHeight: '100%',
      dataLabels: {
        position: 'top',
      }
    }
  },
  grid: {
    show: true,
    borderColor: '#f1f1f1',
    strokeDashArray: 0,
    position: 'back',
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: false
      }
    },
    padding: {
      top: 10,
      right: 20,
      bottom: 10,
      left: 10
    }
  },
  xaxis: {
    categories: chartData.value.categories,
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    labels: {
      show: false
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
    x: {
      show: true
    },
    y: {
      formatter: (val: number) => {
        return val + ' طالب'
      }
    }
  },
  dataLabels: {
    enabled: false
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
        height: 300
      },
      plotOptions: {
        bar: {
          barHeight: '60%'
        }
      }
    }
  }]
}))
</script>

<style scoped>
</style>

