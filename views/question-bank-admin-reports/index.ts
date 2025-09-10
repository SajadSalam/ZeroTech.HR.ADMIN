export const tableHeader = (t: (key: string) => string) => {
  return [
    {
      key: 'id',
      label: t('id'),
    },
    {
      key: 'subject',
      label: t('subject'),
    },
    {
      key: 'totalQuestions',
      label: t('total-questions'),
    },
    {
      key: 'questionsCreator',
      label: t('questions-creator'),
    },
    {
      key: 'auditor',
      label: t('auditor'),
    },
    {
      key: 'status',
      label: t('status'),
    },
  ]
}
