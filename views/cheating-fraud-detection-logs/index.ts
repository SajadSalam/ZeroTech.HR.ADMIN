export const tableHeader = (t: (key: string) => string) => {
  return [
    {
      key: 'studentId',
      label: t('student-id'),
    },
    {
      key: 'studentName',
      label: t('student-name'),
    },
    {
      key: 'examName',
      label: t('exam-name'),
    },
    {
      key: 'violationType',
      label: t('violation-type'),
    },
    {
      key: 'timeStamp',
      label: t('time-stamp'),
    },
    {
      key: 'status',
      label: t('status'),
    },
  ]
}
