import { shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'

export function useCheatingFraudDetectionLogs() {
  const { t } = useI18n()
  const type = 'area'
  const height = 350

  const options = shallowRef({
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
      size: 7,
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
  })

  const series = computed(() => [
    {
      name: t('letter'),
      data: [
        ['2024-09-10', 10],
        ['2024-09-11', 12],
        ['2024-09-12', 20],
        ['2024-09-13', 25],
        ['2024-09-14', 40],
        ['2024-09-15', 45],
        ['2024-09-16', 50],
        ['2024-09-17', 55],
        ['2024-09-18', 60],
        ['2024-09-19', 58],
        ['2024-09-20', 62],
        ['2024-09-21', 70],
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

export function useDetectedCheatingCases() {
  const { t } = useI18n()
  const height = 350
  const type = 'donut'

  const options = computed(() => ({
    title: {
      text: '',
    },
    labels: [t('multiple-faces-detected'), t('tab-switching')],
    colors: ['#2ECC71', '#456EE9'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 280,
            toolbar: {
              show: false,
            },
          },
          legend: {
            position: 'top',
          },
        },
      },
    ],
    legend: {
      position: 'right',
      horizontalAlign: 'center',
    },
  }))

  const series = shallowRef([144, 1055])

  return {
    type,
    height,
    options,
    series,
  }
}
