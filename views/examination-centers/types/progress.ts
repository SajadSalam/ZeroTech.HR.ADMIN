export interface ProgressStatistics {
    totalStudentInExam:     number;
    totalCheckedInStudent:  number;
    totalAbsentStudent:     number;
    totalBlockedStudent:    number;
    currentExamName:        string;
    hallName:               string;
    capacity:               number;
    examStartDate:          string;
    examTime:               string;
    remainingStartExamTime: string;
}

export const progressHeaders = (t: any) => [
    {
        label: '#',
        key: 'index',
    },
    {
        label: t('name'),
        key: 'externalStudentName',
        icon: 'ph:user-duotone',
    },
    

    {
        label: t('progress'),
        key: 'progressOfExam',
        icon: 'ph:percent-duotone',
    },
    {
        label: t('checkedInDate'),
        key: 'checkedInDate',
        icon: 'ph:clock-duotone',
    },
    {
        label: t('exam-status'),
        key: 'examPresentStatus',
        icon: 'ph:clock-duotone',
    },
        {
        label: t('student-status'),
        key: 'examStatus',
        icon: 'ph:check-circle-duotone',
    },
   
]



export interface ProgressStudent {
    externalStudentId: number;
    externalStudentName: string;
    checkedInDate: string;
    progressOfExam: string;
    timeRemaining: string;
    examStatus: ExamStudentStatus;
    examPresentStatus: ExamPresentStatus;
}

export enum ExamStudentStatus
{
    NotStarted = 0,
    InProgress = 1,
    Completed = 2,
}


export enum ExamPresentStatus
{
    Present = 0,
    Absent = 1
}

export const examStudentStatus = (t: any) => [
    {
        label: t('not-started'),
        value: ExamStudentStatus.NotStarted,
        color: 'primary',
    },
    {
        label: t('in-progress'),
        value: ExamStudentStatus.InProgress,
        color: 'warning',
    },
    {
        label: t('completed'),
        value: ExamStudentStatus.Completed,
        color: 'success',
    },
]

export const examPresentStatus = (t: any) => [
    {
        label: t('present'),
        value: ExamPresentStatus.Present,
        color: 'success',
    },
    {
        label: t('absent'),
        value: ExamPresentStatus.Absent,
        color: 'primary',
    }
]

