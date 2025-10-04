<template>
  <BaseCard class="relative p-6">
    <div class="mb-6">
      <BaseHeading
        as="h3"
        size="md"
        weight="semibold"
        lead="tight"
        class="text-muted-800 dark:text-white"
      >
        <span>{{ $t('daily-registrations') }}</span>
      </BaseHeading>
      <p class="text-sm text-muted-500 dark:text-muted-400 mt-1">
        {{ $t('daily-applicant-registrations-trend') }}
      </p>
    </div>
    
    <div v-if="statisticsStore.dailyError" class="flex items-center justify-center h-64">
      <div class="text-center">
        <Icon name="ph:warning-circle-duotone" class="mx-auto text-4xl text-danger-500 mb-2" />
        <p class="text-sm text-muted-500">{{ statisticsStore.dailyError }}</p>
        <BaseButton
          size="sm"
          color="primary"
          variant="outline"
          class="mt-2"
          @click="statisticsStore.fetchDailyStatistics()"
        >
          {{ $t('retry') }}
        </BaseButton>
      </div>
    </div>
    
    <div v-else-if="!statisticsStore.dailyData" class="flex items-center justify-center h-64">
      <BasePlaceload class="w-full h-48" />
    </div>
    
    <div v-else class="w-full">
      <AddonApexcharts
        type="area"
        :height="200"
        :series="chartSeries"
        :options="chartOptions"
      />
      
      <!-- Summary Stats -->
      <div class="mt-6 grid grid-cols-3 gap-4">
        <div class="text-center p-3 bg-muted-50 dark:bg-muted-800 rounded-lg">
          <div class="text-lg font-semibold text-muted-800 dark:text-white">
            {{ statisticsStore.dailyData.totalApplicants }}
          </div>
          <div class="text-xs text-muted-500 dark:text-muted-400">
            {{ $t('total-applicants') }}
          </div>
        </div>
        <div class="text-center p-3 bg-muted-50 dark:bg-muted-800 rounded-lg">
          <div class="text-lg font-semibold text-muted-800 dark:text-white">
            {{ statisticsStore.dailyData.totalDays }}
          </div>
          <div class="text-xs text-muted-500 dark:text-muted-400">
            {{ $t('total-days') }}
          </div>
        </div>
        <div class="text-center p-3 bg-muted-50 dark:bg-muted-800 rounded-lg">
          <div class="text-lg font-semibold text-muted-800 dark:text-white">
            {{ averagePerDay }}
          </div>
          <div class="text-xs text-muted-500 dark:text-muted-400">
            {{ $t('average-per-day') }}
          </div>
        </div>
      </div>
      
      <!-- Date Range Info -->
      <div class="mt-4 text-center text-xs text-muted-500 dark:text-muted-400">
        {{ $t('date-range') }}: 
        {{ formatDate(statisticsStore.dailyData.dateRange.start) }} - 
        {{ formatDate(statisticsStore.dailyData.dateRange.end) }}
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useStatisticsStore } from '../../store/statistics'

const { t } = useI18n()
const statisticsStore = useStatisticsStore()

// Computed values
const averagePerDay = computed(() => {
  if (!statisticsStore.dailyData) return 0
  const { totalApplicants, totalDays } = statisticsStore.dailyData
  return totalDays > 0 ? Math.round(totalApplicants / totalDays) : 0
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })
}

// Chart configuration
const chartSeries = computed(() => {
  if (!statisticsStore.dailyData) return []
  return [{
    name: t('registrations'),
    data: statisticsStore.dailyData.chartData.map(item => ({
      x: item.date,
      y: item.count
    }))
  }]
})

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    fontFamily: 'inherit',
    toolbar: {
      show: false,
    },
    background: 'transparent',
    zoom: {
      enabled: false,
    },
  },
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.5,
      gradientToColors: undefined,
      inverseColors: true,
      opacityFrom: 0.8,
      opacityTo: 0.1,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    type: 'datetime',
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        fontSize: '12px',
        fontWeight: 500,
      },
      formatter: function(value: any) {
        return new Date(value).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })
      },
    },
  },
  yaxis: {
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        fontSize: '12px',
        fontWeight: 500,
      },
    },
    min: 0,
  },
  colors: ['#A9321E'],
  grid: {
    borderColor: '#E2E8F0',
    strokeDashArray: 3,
    xaxis: {
      lines: {
        show: false,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  tooltip: {
    style: {
      fontSize: '12px',
    },
    x: {
      formatter: function(value: any) {
        return new Date(value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric'
        })
      },
    },
    y: {
      formatter: function(val: number) {
        return `${val} ${t('registrations').toLowerCase()}`
      },
    },
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        height: 250
      }
    }
  }]
}))

// Fetch data on mount
onMounted(() => {
  if (!statisticsStore.dailyData && !statisticsStore.isDailyLoading) {
    statisticsStore.fetchDailyStatistics()
  }
})
</script>