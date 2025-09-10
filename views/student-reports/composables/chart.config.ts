import { shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'

export function useExamPerformanceReport() {
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

  const series = shallowRef([
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

export function useMostDifficultSubjectsChart() {
  const type = 'bar'
  const height = 350
  const { t } = useI18n()

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      events: {
        mouseMove: (event: any) => {
          // This will disable any hover effect
          event.preventDefault()
        },
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

  const series = shallowRef([
    {
      name: t('average-score'),
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 78, 85, 91],
    },
    {
      name: t('failure-rate'),
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
