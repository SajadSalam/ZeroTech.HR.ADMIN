import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useStudentRegistrationChart() {
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
      categories: [
        'category-1',
        'category-2',
        'category-3',
        'category-4',
        'category-5',
        'category-6',
        'category-7',
        'category-8',
        'category-9',
        'category-10',
        'category-11',
        'category-12',
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
      name: t('arrived'),
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 78, 85, 91],
    },
    {
      name: t('absence'),
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
