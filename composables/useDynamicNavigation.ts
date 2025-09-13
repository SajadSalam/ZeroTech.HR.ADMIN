export const useDynamicNavigation = () => {
  const route = useRoute()
  
  const getExamCenterNavigation = (examCenterId: string) => {
    return [
      // Back button
      {
        name: 'back-to-examination-centers',
        icon: { name: 'ph-arrow-left-duotone', class: 'w-5 h-5' },
        to: '/examination-centers',
        role:['ums@ems:exam-center-manager','ums@ems:superadmin']

      },
      { divider: true },
      {
        name: 'halls',
        icon: { name: 'ph-door-duotone', class: 'w-5 h-5' },
        to: `/examination-centers/${examCenterId}/halls`,
        role:['ums@ems:exam-center-manager','ums@ems:superadmin']

      },
      {
        name: 'exams',
        icon: { name: 'ph-list-checks-duotone', class: 'w-5 h-5' },
        to: `/examination-centers/${examCenterId}/exams`,
        role:['ums@ems:exam-center-manager','ums@ems:superadmin']

      },
      {
        name: 'statistics',
        icon: { name: 'ph-chart-pie-duotone', class: 'w-5 h-5' },
        to: `/examination-centers/${examCenterId}/statistics`,
        role:['ums@ems:exam-center-manager','ums@ems:superadmin']
      },
      {
        name: 'students',
        icon: { name: 'ph-users-duotone', class: 'w-5 h-5' },
        to: `/examination-centers/${examCenterId}/all-students`,
        role:['ums@ems:exam-center-manager','ums@ems:superadmin']
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