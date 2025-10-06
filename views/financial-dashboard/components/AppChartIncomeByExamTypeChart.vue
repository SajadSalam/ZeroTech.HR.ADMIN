<template>
  <div class="bg-white rounded-xl p-6 w-full h-full min-h-[350px]">
    <div class="flex flex-col mb-6">
        <p class="text-[#615E83] text-sm font-medium">
            {{ $t('financial-dashboard') }}
        </p>
      <h3 class="text-[#000B23] font-bold text-xl leading-tight">
        {{ $t('income-by-exam-type') }}
      </h3>
    </div>
    <hr class="my-4">

    <div class="w-full h-[350px] relative">
      <AddonApexcharts
        type="pie"
        :height="350"
        :width="undefined"
        :series="series"
        :options="chartOptions"
      />

      <div class="flex items-center justify-center gap-4 mt-2">
        <div v-for="(d,i) in data" :key="d.examType" class="flex items-center gap-2">
            <div :class="`w-4 h-4 rounded-full`" :style="{ backgroundColor: chartOptions.colors[i] }"></div>
            <span class="text-[#615E83] text-sm font-medium">
               {{ d.examType == 1 ? t('english') : d.examType == 2 ? t('arabic') : t('computer') }}
            </span>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { IncomeByExamType } from '~/views/financial-dashboard/types';
interface Props {
  data?: IncomeByExamType[] | null
}

const props = defineProps<Props>()
const { t } = useI18n()
const labels = computed(() => (props.data ?? []).map((d) => t('test') + ' ' + (d.examType == "English" ? t('english') : d.examType == "Arabic" ? t('arabic') : t('computer'))))
const series = computed(() => (props.data ?? []).map((d) => d.percentage))

const chartOptions = computed(() => ({
  chart: {
    type: 'pie',
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
    '#A01E11',
    '#17663A',
    '#0075AD',
  ],
  labels: labels.value,
  legend: {
    show: false // Using custom indicators instead
  },
  tooltip: {
    enabled: true // Using custom indicators instead
  },
  dataLabels: {
    enabled: true
  },
  plotOptions: {
    pie: {
      donut: {
        size: '0%'
      },
      expandOnClick: true,
      customScale: 1,
      offsetX: 0,
      offsetY: 0
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
    },
    active: {
      filter: {
        type: 'darken',
        value: 0.1
      }
    }
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      }
    }
  }]
}))
</script>

<style scoped>
</style>


