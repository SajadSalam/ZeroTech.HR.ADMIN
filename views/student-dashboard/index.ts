import type { ExamsCard, StudentDashboardHeader } from './types'

export const studentDashboardHeaderData: StudentDashboardHeader = {
  title: 'student_dashboard_header',
  subTitle: 'student_dashboard_header_description',
  buttonText: 'start_mock_exam',
}

export const todaysExamsData: ExamsCard[] = [
  {
    id: 1,
    tag: "Today's Exams",
    tagColor: 'primary',
    time: '01:30 PM',
    address: 'An exam address here may be long It may be short',
    progress: 2,
    description: 'An exam address here may be long It may be short',
    date: '2024, July 8 - 9:00 AM',
  },
  {
    id: 2,
    tag: "Today's Exams",
    tagColor: 'primary',
    time: '01:30 PM',
    address: 'An exam address here may be long It may be short',
    progress: 2,
    description: 'An exam address here may be long It may be short',
    date: '2024, July 8 - 9:00 AM',
  },
  {
    id: 3,
    tag: "Today's Exams",
    tagColor: 'primary',
    time: '01:30 PM',
    address: 'An exam address here may be long It may be short',
    progress: 2,
    description: 'An exam address here may be long It may be short',
    date: '2024, July 8 - 9:00 AM',
  },
]

export const notPerformedExamsData: ExamsCard[] = [
  {
    id: 4,
    tag: 'Did Not Perform It',
    tagColor: 'danger',
    time: '',
    address: 'An exam address here may be long It may be short',
    progress: 2,
    description: 'An exam address here may be long It may be short',
    date: '2024, July 8 - 9:00 AM',
  },
]

export const performedExamsData: ExamsCard[] = [
  {
    id: 5,
    tag: 'Successful',
    tagColor: 'success',
    time: '',
    address: 'An exam address here may be long It may be short',
    progress: 100,
    description: 'An exam address here may be long It may be short',
    date: '2024, July 8 - 9:00 AM',
  },
  {
    id: 6,
    tag: 'Deposit',
    tagColor: 'danger',
    time: '',
    address: 'An exam address here may be long It may be short',
    progress: 100,
    description: 'An exam address here may be long It may be short',
    date: '2024, July 8 - 9:00 AM',
  },
]
