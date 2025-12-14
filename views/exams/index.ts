export const tableHeaders = (t: (key: string) => string) => {
  return [
    {
      key: 'title',
      label: t('title'),
      icon: 'lucide:file-text',
    },
    {
      key: 'startAtUtc',
      label: t('exam-date'),
      icon: 'lucide:calendar',
    },
    {
      key: 'durationMinutes',
      label: t('duration'),
      icon: 'lucide:clock',
    },
    {
      key: 'examTemplateTitle',
      label: t('blueprint'),
      icon: 'lucide:file-search',
    },
    {
      key: 'totalQuestionsGrade',
      label: t('question-count'),
      icon: 'lucide:align-horizontal-distribute-center',
    },
    {   
      key: 'successGrade',
      label: t('success-grade'),
      icon: 'lucide:align-horizontal-distribute-center',
    },
    {
      key: 'groupTitle',
      label: t('proficiency-exam-group'),
      icon: 'lucide:users',
    },
    {
      key: 'actions',
      label: t('actions'),
      icon: 'lucide:more-vertical',
    },
  ]
}
