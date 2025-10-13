<template>
  <div class="bg-white rounded-3xl p-6 w-full h-full">
    <!-- Header -->
    <div class="flex flex-col items-start gap-1 mb-8">
      <span class="text-[#9291A5] text-lg font-normal">احصائية</span>
      <h3 class="text-[#1E1B39] font-bold text-[22px] leading-tight">
        الايرادات حسب المحافظات
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
          :series="series"
          :options="chartOptions"
        />
        
        <!-- Center Content -->
        <div class="absolute inset-2 top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
          <span class="text-[#1E1B39] text-[20px] font-bold">{{ totalIncome.toLocaleString() }}</span>
          <span class="text-[#9291A5] text-sm font-normal mb-2">الايرادات الكلية</span>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex items-center flex-wrap justify-center gap-3">   
        <div v-for="(d,i) in data" :key="d.governorateName" class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <div class="w-[8px] h-[8px] bg-[#CDD2E5] rounded-2xl" :style="{ backgroundColor: colors[i] }"></div>
            <span class="text-[#615E83] text-sm font-medium">{{ d.governorateName }}</span>
          </div>
          <span class="text-[#9291A5] text-lg font-normal">{{ d.percentage }}%</span>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import type { BookingPercentageByGovernorate } from '~/views/financial-dashboard/types'

interface Props {
  totalIncome: number
  data?: BookingPercentageByGovernorate[] | null
}

// remove 0 percentage
const data = computed(() => (props.data ?? []).filter((d) => d.percentage > 0))
const props = defineProps<Props>()
const getRandomColor = () => {
  const base = { r: 160, g: 30, b: 17 } // #A01E11
  const variation = 20 // adjust how far from base you want
  
  const clamp = (v) => Math.max(0, Math.min(255, v))

  const r = clamp(base.r + Math.floor(Math.random() * (variation * 2) - variation))
  const g = clamp(base.g + Math.floor(Math.random() * (variation * 2) - variation))
  const b = clamp(base.b + Math.floor(Math.random() * (variation * 2) - variation))

  // return as HEX
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, "0")).join("")}`
}

const labels = computed(() => (props.data ?? []).map((d) => d.governorateName))
const series = computed(() => (props.data ?? []).map((d) => d.percentage))
const colors = computed(() => (props.data ?? []).map(() => getRandomColor()))

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'donut',
    fontFamily: 'Tajawal, sans-serif',
    toolbar: { show: false },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
    }
  },
  colors: colors.value,
  labels: labels.value,
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
      colors: colors.value
    },
    dropShadow: {
      enabled: false
    }
  },
  plotOptions: {
    pie: {
      donut: {
        size: '60%',
        labels: { show: false }
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