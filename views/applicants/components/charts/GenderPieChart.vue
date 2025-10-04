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
        <span>{{ $t('gender-distribution') }}</span>
      </BaseHeading>
      <p class="text-sm text-muted-500 dark:text-muted-400 mt-1">
        {{ $t('applicants-by-gender') }}
      </p>
    </div>
    
    <div v-if="statisticsStore.genderError" class="flex items-center justify-center h-64">
      <div class="text-center">
        <Icon name="ph:warning-circle-duotone" class="mx-auto text-4xl text-danger-500 mb-2" />
        <p class="text-sm text-muted-500">{{ statisticsStore.genderError }}</p>
        <BaseButton
          size="sm"
          color="primary"
          variant="outline"
          class="mt-2"
          @click="statisticsStore.fetchGenderStatistics()"
        >
          {{ $t('retry') }}
        </BaseButton>
      </div>
    </div>
    
    <div v-else-if="!statisticsStore.genderData" class="flex items-center justify-center h-64">
      <BasePlaceload class="w-full h-48" />
    </div>
    
    <div v-else class="w-full">
      <AddonApexcharts
        type="pie"
        :height="200"
        :series="chartSeries"
        :options="chartOptions"
      />
      
      <!-- Summary Stats -->
      <div class="mt-6 grid grid-cols-2 gap-4">
        <div v-for="item in statisticsStore.genderData.chartData" :key="item.label" 
             class="text-center p-3 bg-muted-50 dark:bg-muted-800 rounded-lg">
          <div class="text-lg font-semibold text-muted-800 dark:text-white">
            {{ item.value }}
          </div>
          <div class="text-xs text-muted-500 dark:text-muted-400">
            {{ item.label }} ({{ item.percentage }}%)
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useStatisticsStore } from '../../store/statistics'

const { t } = useI18n()
const statisticsStore = useStatisticsStore()

// Chart configuration
const chartSeries = computed(() => {
  if (!statisticsStore.genderData) return []
  return statisticsStore.genderData.chartData.map(item => item.value)
})

const chartOptions = computed(() => ({
  chart: {
    type: 'pie',
    fontFamily: 'inherit',
    toolbar: {
      show: false,
    },
  },
  labels: statisticsStore.genderData?.chartData.map(item => t(item.label.toLowerCase())) || [],
  colors: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'],
  plotOptions: {
    pie: {
      donut: {
        size: '60%',
      },
      expandOnClick: false,
    },
  },
  dataLabels: {
    enabled: true,
    formatter: function(val: number, opts: any) {
      const data = statisticsStore.genderData?.chartData[opts.seriesIndex]
      return data ? `${data.percentage}%` : `${val.toFixed(1)}%`
    },
    style: {
      fontSize: '12px',
      fontWeight: 600,
    },
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
    fontSize: '14px',
    markers: {
      width: 12,
      height: 12,
    },
    itemMargin: {
      horizontal: 15,
      vertical: 5,
    },
  },
  tooltip: {
    style: {
      fontSize: '12px',
    },
    y: {
      formatter: function(val: number, opts: any) {
        const data = statisticsStore.genderData?.chartData[opts.seriesIndex]
        return data ? `${val} (${data.percentage}%)` : val.toString()
      },
    },
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
}))

// Fetch data on mount
onMounted(() => {
  if (!statisticsStore.genderData && !statisticsStore.isGenderLoading) {
    statisticsStore.fetchGenderStatistics()
  }
})
</script>