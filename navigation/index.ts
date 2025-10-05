export default [
   
   {
       name: 'الأقسام',
       icon: { name: 'ph-buildings-duotone', class: 'w-5 h-5' },
       to: '/departments',
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
    name: 'ادارة الرواتب',
    icon: { name: 'ph-money-duotone', class: 'w-5 h-5' },
    children: [
        {
            name: 'الرواتب',
            icon: { name: 'ph-money-duotone', class: 'w-5 h-5' },
            to: '/salaries',
        },
        {
            name: 'المخصصات',
            icon: { name: 'ph-check-duotone', class: 'w-5 h-5' },
            to: '/allocations',
        },
        {
            name: 'الثوابت',
            icon: { name: 'ph-check-duotone', class: 'w-5 h-5' },
            to: '/approvals',
        },
    ]
   }
]
