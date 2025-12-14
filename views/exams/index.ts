
export const tableHeaders = (t: (key: string) => string) => {
    return [
        {
            key: 'title',
            label: t('title'),
            icon: 'lucide:file-text',
        },


        {
            key: 'examDate',
            label: t('exam-date'),
            icon: 'lucide:calendar',
        },
        {
            key: 'time',
            label: t('time') + ' (24hrs)',
            icon: 'lucide:clock',
        },
        {
            key: 'templateName',
            label: t('blueprint'),
            icon: 'lucide:file-search',
        },
        {
            key: 'questionCount',
            label: t('question-count'),
            icon: 'lucide:align-horizontal-distribute-center',
        },
        {
            key: 'successGrade',
            label: t('full-grade'),
            icon: 'lucide:align-horizontal-distribute-center',
        },
        {
            key: 'actions',
            label: t('actions'),
            icon: 'lucide:more-vertical',
        },
    ]
}
