import { shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'

export function useExamCenterSeatUsageChart() {
  const type = 'bar'
  const height = 350
  const { t } = useI18n()

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
        endingShape: 'rounded',
        borderRadius: 5,
      },
    },
    colors: ['#456EE9', '#7A8A91'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 3,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
    },
    hover: {
      enabled: false,
    },
    title: {
      text: '',
      align: 'left',
    },
    tooltip: {
      y: {
        formatter: (value: number) => value.toLocaleString(),
      },
    },
  }

  const series = computed(() => [
    {
      name: t('logged-in'),
      data: [44, 55, 57, 56, 61, 58, 63, 60],
    },
    {
      name: t('disconnected'),
      data: [76, 85, 101, 98, 87, 105, 91, 114],
    },
  ])

  return {
    type,
    height,
    options,
    series,
  }
}

export function useRealTimeSeatAllocationChart() {
  const type = 'bar'
  const height = 350
  const { t } = useI18n()

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
        endingShape: 'rounded',
        borderRadius: 5,
      },
    },
    colors: ['#456EE9', '#F5AE3B'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 3,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
    },
    hover: {
      enabled: false,
    },
    title: {
      text: '',
      align: 'left',
    },
    tooltip: {
      y: {
        formatter: (value: number) => value.toLocaleString(),
      },
    },
  }

  const series = computed(() => [
    {
      name: t('used'),
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 78, 85, 91],
    },
    {
      name: t('unused-seats'),
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 86, 101, 91],
    },
  ])

  return {
    type,
    height,
    options,
    series,
  }
}
