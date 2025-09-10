import { shallowRef, computed } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'

export function useSuccessRateExamChart() {
  const type = 'radialBar'
  const height = 350

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: ['#456EE9'],
    plotOptions: {
      radialBar: {
        hollow: {
          size: '75%',
        },
        dataLabels: {
          show: true,
          name: {
            show: false,
            fontSize: '12px',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            offsetY: 5,
          },
          value: {
            show: true,
            fontWeight: 600,
            fontFamily: 'Roboto, sans-serif',
            fontSize: '16px',
            offsetY: 5,
          },
        },
      },
    },
    labels: ['Progress'],
  }

  const series = shallowRef([65])

  return {
    type,
    height,
    options,
    series,
  }
}
