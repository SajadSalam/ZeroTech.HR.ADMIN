import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useCompletedExamsChart() {
  const type = 'radialBar'
  const height = 350

  const options = {
    chart: {
      offsetY: -10,
    },
    colors: ['#456EE9'],
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        inverseOrder: true,
        dataLabels: {
          show: true,
          name: {
            show: true,
            fontSize: '14px',
            fontWeight: 500,
            offsetY: -10,
          },
          value: {
            show: true,
            fontWeight: 600,
            fontSize: '16px',
            offsetY: -5,
          },
          total: {
            show: true,
            fontSize: '14px',
            fontWeight: 500,
          },
        },
        hollow: {
          margin: 15,
          size: '75%',
        },
        track: {
          strokeWidth: '100%',
        },
      },
    },

    stroke: {
      lineCap: 'round',
    },
    labels: ['Progress'],
  }

  const series = shallowRef([75])

  return {
    type,
    height,
    options,
    series,
  }
}
