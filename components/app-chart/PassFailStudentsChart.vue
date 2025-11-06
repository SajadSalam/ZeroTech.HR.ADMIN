<template>
  <div class="bg-white rounded-3xl p-6 w-full h-full">
    <!-- Header -->
    <div class="flex flex-col items-start gap-1 mb-4">
      <span class="text-[#9291A5] text-lg font-normal">احصائية</span>
      <h3 class="text-[#1E1B39] font-bold text-[22px] leading-tight">
        عدد الطلاب الناجحين والراسبين
      </h3>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">المجموعة</label>
        <select 
          v-model="selectedGroupId" 
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option :value="null">الكل</option>
          <option v-for="group in groups" :key="group.id" :value="group.id">
            {{ group.name }}
          </option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">المادة</label>
        <select 
          v-model="selectedSubjectId" 
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option :value="null">الكل</option>
          <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
            {{ subject.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Divider -->
    <hr class="border-[#E5E5EF] border-solid border-t mb-4">

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
          <span class="text-[#1E1B39] text-[20px] font-bold">{{ totalStudents.toLocaleString() }}</span>
          <span class="text-[#9291A5] text-sm font-normal mb-2 text-center">العدد الكلي <br>للطلاب</span>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex items-center gap-8">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <div class="w-[14px] h-[14px] bg-[#059669] rounded-3xl"></div>
            <span class="text-[#615E83] text-[22px] font-medium">الناجحين</span>
          </div>
          <span class="text-[#9291A5] text-lg font-normal">{{ filteredData.passed }}</span>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <div class="w-[14px] h-[14px] bg-[#DC2626] rounded-2xl"></div>
            <span class="text-[#615E83] text-[22px] font-medium">الراسبين</span>
          </div>
          <span class="text-[#9291A5] text-lg font-normal">{{ filteredData.failed }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApexOptions } from 'apexcharts';

interface PassFailData {
  groupId: number | null
  groupName: string
  subjectId: number | null
  subjectName: string
  passed: number
  failed: number
}

interface Group {
  id: number
  name: string
}

interface Subject {
  id: number
  name: string
}

interface Props {
  data: PassFailData[]
  groups: Group[]
  subjects: Subject[]
}

const props = defineProps<Props>()

const selectedGroupId = ref<number | null>(null)
const selectedSubjectId = ref<number | null>(null)

// Filtered data based on selected group and subject
const filteredData = computed(() => {
  let filtered = props.data
  
  if (selectedGroupId.value !== null) {
    filtered = filtered.filter(d => d.groupId === selectedGroupId.value)
  }
  
  if (selectedSubjectId.value !== null) {
    filtered = filtered.filter(d => d.subjectId === selectedSubjectId.value)
  }
  
  // Sum up all passed and failed
  const passed = filtered.reduce((sum, d) => sum + d.passed, 0)
  const failed = filtered.reduce((sum, d) => sum + d.failed, 0)
  
  return {
    passed,
    failed
  }
})

// Chart data
const chartData = computed(() => {
  return {
    series: [filteredData.value.passed, filteredData.value.failed]
  }
})

// Total students
const totalStudents = computed(() => filteredData.value.passed + filteredData.value.failed)

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
    '#059669', // الناجحين - Green
    '#DC2626'  // الراسبين - Red
  ],
  labels: ['الناجحين', 'الراسبين'],
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
        const total = totalStudents.value || 1
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
      colors: ['#FFFFFF', '#FFFFFF']
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

