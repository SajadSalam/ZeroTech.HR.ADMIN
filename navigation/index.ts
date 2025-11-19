const defaultNavigation = [
  {
    name: 'home-page',
    icon: { name: 'ph-house-duotone', class: 'w-5 h-5' },
    to: '/',
    privilege: 'ums:ems:statistics:superadmin',
  },

  {
    name: 'questions-management',
    icon: { name: 'ph-folders-duotone', class: 'w-5 h-5' },
    privilege: 'ums:ems:question-bank:view-any',
    children: [
      {
        name: 'questions-bank',
        icon: { name: 'ph-folders-duotone', class: 'w-5 h-5' },
        to: '/question-bank',
        privilege: 'ums:ems:question-bank:view-any',
      },
      {
        name: 'audit-questions',
        icon: { name: 'ph-book-bookmark-duotone', class: 'w-5 h-5' },
        to: '/questions',
        privilege: 'ums:ems:question:view-any',
      },
      {
        name: 'topics',
        icon: { name: 'ph-book-open-duotone', class: 'w-5 h-5' },
        to: '/topics',
        privilege: 'ums:ems:topics:view-any',
      },
      {
        name: 'subjects',
        icon: { name: 'ph-file-cloud-duotone', class: 'w-5 h-5' },
        to: '/subjects',
        privilege: 'ums:ems:subjects:view-any',
      },
      {
        name: 'categories',
        icon: { name: 'ph-folder-simple-duotone', class: 'w-5 h-5' },
        to: '/category',
        privilege: 'ums:ems:category:view-any',
      },
      {
        name: 'groups',
        icon: { name: 'ph-list-checks-duotone', class: 'w-5 h-5' },
        to: '/groups',
        privilege: 'ums:ems:groups:view-any',
      },
    ],
  },
  {
    name: 'exams-management',
    icon: { name: 'ph-list-checks-duotone', class: 'w-5 h-5' },
    privilege: 'ums:ems:exam:view-any',
    children: [
      {
        name: 'blueprints',
        icon: { name: 'ph-file-archive-duotone', class: 'w-5 h-5' },
        to: '/blueprint',
        privilege: 'ums:ems:examtemplate:view-any',
      },

      {
        name: 'exams',
        icon: { name: 'ph-list-checks-duotone', class: 'w-5 h-5' },
        to: '/exams',
        privilege: 'ums:ems:exam:view-any',
      },

      {
        name: 'evaluations',
        icon: { name: 'ph-user-list-duotone', class: 'w-5 h-5' },
        to: '/evaluations',
        // privilege: 'ums:ems:exam:get-exam-grade',
        role:'ums@exam:corrector'
      },
    ],
  },


]

// Default export for backward compatibility
export default defaultNavigation
