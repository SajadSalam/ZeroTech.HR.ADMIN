import { shallowRef, computed } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'

export function useUserActionsBreaksDownReport() {
  const { t } = useI18n()
  const height = 350
  const type = 'donut'

  const options = computed(() => ({
    title: {
      text: '',
    },
    labels: [t('absent'), t('present')],
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
