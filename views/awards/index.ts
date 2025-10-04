import type { AwardDto } from './types'

export const tableHeader = (t: (key: string) => string) => {
  return [
    {
      key: 'awardName',
      label: t('award-name'),
    },
    {
      key: 'awardStatus',
      label: t('award-status'),
    },
    {
      key: 'academicYear',
      label: t('academic-year'),
    },
    {
      key: 'lunchDate',
      label: t('lunch-date'),
    },
    {
      key: 'applicationEndDate',
      label: t('application-end-date'),
    },
     {
      key: 'examTime',
      label: t('exam-time'),
    },
    {
      key: 'examDate',
      label: t('exam-date'),
    },
     {
      key: 'resultDate',
      label: t('result-date'),
    },
    {
      key: 'honoringDate',
      label: t('honoring-date'),
    },
    {
      key: 'actions',
      label: t('actions'),
    },
  ]
}

export const fakeData: AwardDto[] = [
  {
    id: '1',
    awardName: 'Excellence in Science Award',
    awardStatus: 'inprogress',
    academicYear: '2024-2025',
    lunchDate: '2024-09-01',
    applicationPeriod: 30,
    evaluationPeriod: 15,
    resultDate: '2024-12-15',
    formRequirement: 'Complete application form with supporting documents',
    criteria: 'Outstanding academic performance in science subjects',
    examTime: 120,
    delayAllowedTime: 15,
    deleted: false,
    creationDate: '2024-08-01',
  },
  {
    id: '2',
    awardName: 'Mathematics Achievement Award',
    awardStatus: 'completed',
    academicYear: '2023-2024',
    lunchDate: '2023-09-01',
    applicationPeriod: 25,
    evaluationPeriod: 10,
    resultDate: '2023-12-01',
    formRequirement: 'Application form with math portfolio',
    criteria: 'Exceptional performance in mathematics',
    examTime: 90,
    delayAllowedTime: 10,
    deleted: false,
    creationDate: '2023-08-15',
  },
  {
    id: '3',
    awardName: 'Literature and Arts Award',
    awardStatus: 'inprogress',
    academicYear: '2024-2025',
    lunchDate: '2024-10-01',
    applicationPeriod: 35,
    evaluationPeriod: 20,
    resultDate: '2025-01-15',
    formRequirement: 'Creative portfolio and essay submission',
    criteria: 'Outstanding creativity in literature and arts',
    examTime: 150,
    delayAllowedTime: 20,
    deleted: false,
    creationDate: '2024-09-01',
  },
  {
    id: '4',
    awardName: 'Technology Innovation Award',
    awardStatus: 'completed',
    academicYear: '2023-2024',
    lunchDate: '2023-10-15',
    applicationPeriod: 40,
    evaluationPeriod: 25,
    resultDate: '2024-02-01',
    formRequirement: 'Project proposal and prototype demonstration',
    criteria: 'Innovative technology project with practical application',
    examTime: 180,
    delayAllowedTime: 30,
    deleted: false,
    creationDate: '2023-09-15',
  },
]
