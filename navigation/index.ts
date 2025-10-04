export default [
     {
        name: 'awards',
        icon: { name: 'ph-trophy-duotone', class: 'w-5 h-5' },
        to: '/awards',
        permissions: ['api::award.award.find']
    },
    
    {
        name: 'audit-questions',
        icon: { name: 'ph-book-bookmark-duotone', class: 'w-5 h-5' },
        to: '/questions',
        permissions: ['api::question.question.find']
    },
    {
        name: 'applicants',
        icon: { name: 'ph-users-duotone', class: 'w-5 h-5' },
        to: '/applicants',
        permissions: ['api::applicant.applicant.find']
    },
    {
        name: 'exam-sessions',
        icon: { name: 'ph-house-duotone', class: 'w-5 h-5' },
        to: '/',
        permissions: ['api::exam-session.exam-session.find']
    }
]
