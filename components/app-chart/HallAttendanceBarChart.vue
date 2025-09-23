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
    height: 350,
    type: 'bar',
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      dataLabels: {
        position: 'top'
      }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: val => val.toString(),
    offsetY: -20,
    style: {
      fontSize: '12px',
      colors: ["#304758"]
    }
  },
  xaxis: {
    categories: chartData.value.categories,
    position: 'bottom',
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: {
      formatter: val => val.toString()
    }
  },
  title: {
    text: 'عدد المقاعد المحجوزة حسب المحافظات',
    align: 'center',
    style: { color: '#444' }
  }
}))

onMounted(loadGovernorateData)
watch(selectedMonth, loadGovernorateData)


// Handle tooltip events

</script>

<style scoped>

</style>