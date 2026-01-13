export default [
   
   {
       name: 'الأقسام',
       icon: { name: 'ph-buildings-duotone', class: 'w-5 h-5' },
       to: '/departments',
   },
   {
       name: 'إدارة الطلبات',
       icon: { name: 'ph-clipboard-text-duotone', class: 'w-5 h-5' },
       children: [
           {
               name: 'جميع الطلبات',
               icon: { name: 'ph-list-duotone', class: 'w-5 h-5' },
               to: '/requests',
           },
           {
               name: 'الموافقات المعلقة',
               icon: { name: 'ph-clock-duotone', class: 'w-5 h-5' },
               to: '/pending-approvals',
           },
           {
               name: 'أنواع الطلبات',
               icon: { name: 'ph-file-text-duotone', class: 'w-5 h-5' },
               to: '/request-types',
           },
           {
               name: 'فئات الطلبات',
               icon: { name: 'ph-folder-duotone', class: 'w-5 h-5' },
               to: '/request-categories',
           },
       ]
   },
   {
       name: 'سلاسل الموافقات',
       icon: { name: 'ph-flow-arrow-duotone', class: 'w-5 h-5' },
       to: '/approval-chains',
   },
   {
       name: 'المناطق الجغرافية',
       icon: { name: 'ph-map-pin-duotone', class: 'w-5 h-5' },
       to: '/zones',
   },
   {
       name: 'جداول العمل',
       icon: { name: 'ph-calendar-duotone', class: 'w-5 h-5' },
       to: '/work-schedules',
   },
   {
    name: 'الموظفين',
    icon: { name: 'ph-users', class: 'w-5 h-5' },
    to:'/employees',
   },
   {
    name: 'المستخدمين',
    icon: { name: 'ph-users-duotone', class: 'w-5 h-5' },
    to: '/users',
   },
   {
    name: 'الأدوار',
    icon: { name: 'ph-user-duotone', class: 'w-5 h-5' },
    to: '/roles',
   },
   {
    name: 'الحضور والانصراف',
    icon: { name: 'ph-clock-duotone', class: 'w-5 h-5' },
    to: '/attendance',
   },
   {
    name: 'ادارة الرواتب',
    icon: { name: 'ph-money-duotone', class: 'w-5 h-5' },
    children: [
        {
            name: 'دفعات الرواتب',
            icon: { name: 'ph-money-duotone', class: 'w-5 h-5' },
            to: '/payroll-batches',
        },
        // {
        //     name: 'رواتب الموظفين',
        //     icon: { name: 'ph-user-circle-duotone', class: 'w-5 h-5' },
        //     to: '/employee-payrolls',
        // },
        // {
        //     name: 'المخصصات',
        //     icon: { name: 'ph-check-duotone', class: 'w-5 h-5' },
        //     to: '/allocations',
        // },
        // {
        //     name: 'الثوابت',
        //     icon: { name: 'ph-check-duotone', class: 'w-5 h-5' },
        //     to: '/approvals',
        // },
    ]
   }
]
