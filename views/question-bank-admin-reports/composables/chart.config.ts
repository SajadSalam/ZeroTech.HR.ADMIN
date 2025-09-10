import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useQuestionPerformanceReport() {
  const type = 'bar'
  const height = 350
  const { t } = useI18n()

  const options = {
    chart: {
      stacked: true,
      toolbar: {
        show: false,
      },
      events: {
        mouseMove: (event: any) => {
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
      categories: [
        'Exam 1',
        'Exam 2',
        'Exam 3',
        'Exam 4',
        'Exam 5',
        'Exam 6',
        'Exam 7',
        'Exam 8',
        'Exam 9',
        'Exam 10',
        'Exam 11',
        'Exam 12',
      ],
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
      name: t('correct-responses'),
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 78, 85, 91],
    },
    {
      name: t('incorrect-responses'),
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
export function useQuestionApprovalRejectionReport() {
  const { t } = useI18n()
  const height = 350
  const type = 'donut'

  const options = computed(() => ({
    title: {
      text: '',
    },
    labels: [t('rejected-questions'), t('approved-questions')],
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

  const series = computed(() => [144, 1055])

  return {
    type,
    height,
    options,
    series,
  }
}
