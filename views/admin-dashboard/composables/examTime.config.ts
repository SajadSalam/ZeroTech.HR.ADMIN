import { shallowRef, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useExamTimeChart() {
  const { t } = useI18n()
  const type = 'area'
  const height = 350

  const options = computed(() => ({
    chart: {
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      dropShadow: {
        enabled: true,
        enabledSeries: [0],
        top: -2,
        left: 2,
        blur: 5,
        opacity: 0.06,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
      strokeColor: '#456EE9',
      strokeWidth: 3,
      strokeOpacity: 1,
      fillOpacity: 1,
      hover: {
        size: 6,
      },
    },
    xaxis: {
      type: 'datetime',
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        offsetX: 0,
        offsetY: -5,
      },
      tooltip: {
        enabled: true,
      },
    },
    grid: {
      show: true,
      padding: {
        left: -5,
        right: 5,
      },
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy',
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        gradientToColors: ['#456EE9'],
        shadeIntensity: 0.3,
        opacityFrom: 0.3,
        opacityTo: 0.3,
      },
    },
  }))

  const series = computed(() => [
    {
      name: t('letter'),
      data: [
        ['2024-09-10', 10],
        ['2024-09-11', 50],
        ['2024-09-12', 30],
        ['2024-09-13', 40],
      ],
      color: '#456EE9',
    },
  ])

  return {
    type,
    height,
    options,
    series,
  }
}
