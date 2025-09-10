import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useExamPerformanceReport() {
  const { t } = useI18n()
  const type = 'rangeBar'
  const height = 350

  const options = computed(() => ({
    title: {
      text: '',
      align: 'left',
    },
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        barHeight: '50%',
        dataLabels: {
          hideOverflowingLabels: false,
        },
      },
    },
    stroke: {
      colors: ['#456EE9'], // Border color
      width: 2,
    },
    colors: ['#456EE9'],
    dataLabels: {
      enabled: true,
      inside: true,
      offsetX: 10,
      dropShadow: {
        enabled: false,
      },
      formatter: function (val: any, opts: any) {
        const label = opts.w.config.series[0].data[opts.dataPointIndex].x
        return label + ' 8:00 - 12:00'
      },
      style: {
        colors: ['#003366'],
        fontWeight: 'bold',
        fontSize: '14px',
      },
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      show: false,
    },
    grid: {
      row: {
        colors: ['transparent'],
        opacity: 1,
      },
    },
    tooltip: {
      enabled: true,
    },
    legend: {
      show: false,
    },
  }))

  const series = computed(() => [
    {
      data: [
        {
          x: 'Exam-1',
          y: [new Date('2019-02-27').getTime(), new Date('2019-03-04').getTime()],
        },
        {
          x: 'Exam-2',
          y: [new Date('2019-03-04').getTime(), new Date('2019-03-08').getTime()],
        },
        {
          x: 'Exam-3',
          y: [new Date('2019-03-07').getTime(), new Date('2019-03-10').getTime()],
        },
        {
          x: 'Exam-4',
          y: [new Date('2019-03-08').getTime(), new Date('2019-03-12').getTime()],
        },
        {
          x: 'Exam-5',
          y: [new Date('2019-03-12').getTime(), new Date('2019-03-17').getTime()],
        },
      ],
    },
  ])

  return {
    type,
    height,
    options,
    series,
  }
}
