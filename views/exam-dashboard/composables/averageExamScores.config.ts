import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
export function useAverageExamScoresChart() {
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
        columnWidth: '20%',
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
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
      data: [44, 55, 57, 56, 61, 58, 63],
    },
    /* {
            name: t('disconnected'),
            data: [76, 85, 101, 98, 87, 105, 91, 114],
        } */
  ])

  return {
    type,
    height,
    options,
    series,
  }
}
