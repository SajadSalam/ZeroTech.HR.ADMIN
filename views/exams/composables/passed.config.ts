import { shallowRef, computed } from 'vue'
export function PassedStudentChart() {
  const height = 60
  const type = 'line'

  const options = {
    chart: {
      id: 'sparkline1',
      sparkline: {
        enabled: true,
      },
      group: 'sparklines',
    },
    grid: {
      padding: {
        top: 10,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    stroke: {
      curve: 'smooth',
      width: [2],
    },
    markers: {
      size: 0,
    },
    yaxis: {
      min: 0,
      labels: {
        minWidth: 100,
      },
    },
    tooltip: {
      fixed: {
        enabled: true,
        position: 'right',
      },
      x: {
        show: false,
      },
    },
    colors: ['#44D580'],
  } as const

  const series = shallowRef([
    {
      name: 'Passed Students',
      data: [2565, 6126, 4271, 5249, 2245, 4424, 1752, 3996, 976, 2157],
    },
  ])

  return { height, type, options, series }
}
