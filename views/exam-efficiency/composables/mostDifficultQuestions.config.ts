import { shallowRef, computed } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'
export function useMostDifficultQuestionsReport() {
  const type = 'bar'
  const height = 350
  const { t } = useI18n()

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: ['#456EE9', '#7A8A91'],
    title: {
      text: '',
      align: 'left',
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: 'top',
        },
        columnWidth: '40%',
        endingShape: 'rounded',
        borderRadius: 5,
      },
    },

    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: {
        fontSize: '12px',
        colors: ['#fff'],
      },
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['#fff'],
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
    },
  }

  const series = computed(() => [
    {
      name: t('series-1'),
      data: [44, 55, 41, 64, 22, 43, 21],
    },
    {
      name: t('series-2'),
      data: [53, 32, 33, 52, 13, 44, 32],
    },
  ])

  return {
    type,
    height,
    options,
    series,
  }
}
