<template>
    <ClientOnly>
  <BaseCard class="relative p-6">
    <div class="mb-6">
      <BaseHeading
        as="h3"
        size="md"
        weight="semibold"
        lead="tight"
        class="text-muted-800 dark:text-white"
      >
        <span>
        {{ $t('hepiq-vs-non-hepiq-applicants') }}
            
            <!-- {{ $t('hepiq-distribution') }} -->
        </span>
      </BaseHeading>
      <!-- <p class="text-sm text-muted-500 dark:text-muted-400 mt-1">
        {{ $t('hepiq-vs-non-hepiq-applicants') }}
      </p> -->
    </div>
    
    <div v-if="statisticsStore.hepiqError" class="flex items-center justify-center h-64">
      <div class="text-center">
        <Icon name="ph:warning-circle-duotone" class="mx-auto text-4xl text-danger-500 mb-2" />
        <p class="text-sm text-muted-500">{{ statisticsStore.hepiqError }}</p>
        <BaseButton
          size="sm"
          color="primary"
          variant="outline"
          class="mt-2"
          @click="statisticsStore.fetchHepiqStatistics()"
        >
          {{ $t('retry') }}
        </BaseButton>
      </div>
    </div>
    
    <div v-else-if="!statisticsStore.hepiqData" class="flex items-center justify-center h-64">
      <BasePlaceload class="w-full h-48" />
    </div>
    
    <div v-else class="w-full">
      <AddonApexcharts
        type="bar"
       :height="200"
        :series="chartSeries"
        :options="chartOptions"
      />
      
      <!-- Summary Stats -->
      <div class="mt-6 grid grid-cols-2 gap-4">
        <div v-for="item in statisticsStore.hepiqData.chartData.reverse()" :key="item.label" 
             class="text-center p-3 bg-muted-50 dark:bg-muted-800 rounded-lg">
          <div class="text-lg font-semibold text-muted-800 dark:text-white">
            {{ item.value }}
          </div>
          <div class="text-xs text-muted-500 dark:text-muted-400">
            {{ t(item.label.replace('-', '_')) }}
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useStatisticsStore } from '../../store/statistics'

const { t } = useI18n()
const statisticsStore = useStatisticsStore()

// Chart configuration
const chartSeries = computed(() => {
  if (!statisticsStore.hepiqData) return []
  return [{
    name: t('applicants'),
    data: statisticsStore.hepiqData.chartData.map(item => item.value)
  }]
})

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    fontFamily: 'inherit',
    toolbar: {
      show: false,
    },
    background: 'transparent',
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '50%',
      borderRadius: 4,
      distributed: true,
      dataLabels: {
        position: 'top',
      },
    },
  },
  dataLabels: {
    enabled: true,
    offsetY: -20,
    style: {
      fontSize: '12px',
      fontWeight: 600,
      colors: ['#64748B']
    }
  },
  xaxis: {
    categories: statisticsStore.hepiqData?.chartData.map(item => 
      t(item.label.replace('-', '_'))
    ) || [],
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
  },
  colors: ['#A9321E', '#44D580'],
  legend: {
    show: false,
  },
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
    y: {
      formatter: function(val: number) {
        return val.toString()
      },
    },
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      }
    }
  }]
}))

// Fetch data on mount
onMounted(() => {
  if (!statisticsStore.hepiqData && !statisticsStore.isHepiqLoading) {
    statisticsStore.fetchHepiqStatistics()
  }
})
</script>