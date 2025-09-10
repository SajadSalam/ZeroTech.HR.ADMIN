import type { ExamEfficiencyStatCard, ExamEfficiencyHeader } from './types'

export const examEfficiencyStatCardData: ExamEfficiencyStatCard[] = [
  { label: 'total_number_of_employees', value: '62K' },
  { label: 'total_number_of_students', value: '62K' },
  { label: 'total_number_of_examinations_established', value: '62K' },
  { label: 'exams_rejected_by_the_committee', value: '62K' },
  { label: 'the_number_of_exams_that_have_not_been_conducted', value: '62K' },
  { label: 'the_number_of_exams_conducted', value: '62K' },
]

export const examEfficiencyHeaderData: ExamEfficiencyHeader = {
  title: 'total_exam_statistics',
  subTitle: 'dashboard_director_of_the_system',
  buttonText: 'export_reports',
}
