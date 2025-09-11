export const useDynamicNavigation = () => {
  const route = useRoute()
  
  const getExamCenterNavigation = (examCenterId: string, examCenterName?: string) => {
    return [
      // Back button
      {
        name: 'back-to-examination-centers',
        icon: { name: 'ph-arrow-left-duotone', class: 'w-5 h-5' },
        to: '/examination-centers',
      },
      { divider: true },
      // Exam center specific navigation
      {
        name: 'exam-center-overview',
        icon: { name: 'ph-building-duotone', class: 'w-5 h-5' },
        to: `/examination-centers/${examCenterId}`,
        label: examCenterName || 'Exam Center',
      },
      {
        name: 'halls',
        icon: { name: 'ph-door-duotone', class: 'w-5 h-5' },
        to: `/examination-centers/${examCenterId}/halls`,
      },
      {
        name: 'exams',
        icon: { name: 'ph-list-checks-duotone', class: 'w-5 h-5' },
        to: `/examination-centers/${examCenterId}/exams`,
      },
      {
        name: 'statistics',
        icon: { name: 'ph-chart-pie-duotone', class: 'w-5 h-5' },
        to: `/examination-centers/${examCenterId}/statistics`,
      },
    ]
  }

  const isExamCenterRoute = computed(() => {
    return route.path.startsWith('/examination-centers/') && route.params.id
  })

  return {
    getExamCenterNavigation,
    isExamCenterRoute,
  }
}