<template>
    <div class="bg-white rounded-[20px] p-6 w-full h-full min-h-[490px]">
        <!-- Header with Dropdown and Title -->
        <div class="flex justify-between items-center mb-8">
            <!-- Title -->
            <div class="flex flex-col items-start gap-1">
                <span class="text-[#9291A5] text-lg font-normal">احصائية</span>
                <h3 class="text-[#1E1B39] font-bold text-[22px] leading-tight">
                    عدد المتقدمين للأمتحان حسب المحافظات
                </h3>
            </div>
            <!-- Dropdown -->
            <div class="flex justify-between items-center">


                <!-- Month Selector -->
                <div class="flex items-center gap-4">
                    <label class="text-[#615E83] font-medium text-sm">اختر الشهر:</label>
                    <select v-model="selectedMonth"
                        class="bg-[#F8F8FF] rounded-xl px-4 py-3 text-[#615E83] font-medium text-sm border-none outline-none cursor-pointer min-w-[140px]">
                        <option v-for="month in months" :key="month.value" :value="month.value">
                            {{ month.label }}
                        </option>
                    </select>
                </div>
            </div>

        </div>

        <!-- Divider -->
        <hr class="border-[#E5E5EF] border-solid border-t mb-8">

        <!-- Chart Container -->
        <div class="relative w-full h-[350px]">
            <div v-if="isLoading" class="flex items-center justify-center h-full">
                <div class="text-gray-500">جاري تحميل البيانات...</div>
            </div>
            <!-- <div v-else-if="error" class="flex items-center justify-center h-full">
                <div class="text-center">
                    <div class="text-red-500 mb-2">{{ error }}</div>
                    <button @click="loadGovernorateData" class="px-4 py-2 bg-primary text-white rounded text-sm">
                        إعادة المحاولة
                    </button>
                </div>
            </div>
            <div v-else-if="!governorateData?.governorates?.length" class="flex items-center justify-center h-full">
                <div class="text-gray-500">لا توجد بيانات للعرض</div>
            </div> -->
            <AddonApexcharts v-else type="bar" :height="350" :series="chartData.series" :options="chartOptions" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import { HomeService } from '~/views/home/service'
import type { GovernorateBookingChartData } from '~/views/home/types/governorateBookingChart'

// Current year and month
const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth() + 1

// Month options with Arabic names
const months = [
    { value: 1, label: 'يناير' },
    { value: 2, label: 'فبراير' },
    { value: 3, label: 'مارس' },
    { value: 4, label: 'أبريل' },
    { value: 5, label: 'مايو' },
    { value: 6, label: 'يونيو' },
    { value: 7, label: 'يوليو' },
    { value: 8, label: 'أغسطس' },
    { value: 9, label: 'سبتمبر' },
    { value: 10, label: 'أكتوبر' },
    { value: 11, label: 'نوفمبر' },
    { value: 12, label: 'ديسمبر' }
]

// Selected month - defaults to current month
const selectedMonth = ref(currentMonth)

// Service and state
const homeService = new HomeService()
const isLoading = ref(true)
const error = ref<string | null>(null)
const governorateData = ref<GovernorateBookingChartData | null>(null)

// Load governorate booking data
const loadGovernorateData = async () => {
    try {
        isLoading.value = true
        error.value = null
        governorateData.value = await homeService.getGovernorateBookingChartData(currentYear, selectedMonth.value)
    } catch (err) {
        console.error('Error loading governorate booking data:', err)
        error.value = 'حدث خطأ في تحميل بيانات المحافظات'
    } finally {
        isLoading.value = false
    }
}
// Chart data
const chartData = computed(() => {
  return {
    series: [
      {
        name: "المقاعد المحجوزة",
        data: governorateData.value?.governorates.map(gov => gov.totalBookedSeats) || []
      }
    ],
    categories: governorateData.value?.governorates.map(gov => gov.governorateName) || []
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

onMounted(loadGovernorateData)
watch(selectedMonth, loadGovernorateData)


// Handle tooltip events

</script>

<style scoped>

</style>