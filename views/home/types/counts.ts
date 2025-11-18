
export interface Counts {
    totalUpcomingExams:            number;
    currentActiveExams:            number;
    totalGroups:                   number;
    totalExaminedStudents:         number;
    totalAbsentStudents:           number;
    collegeStudentCounts:  CollegeStudentCount[];
    passFailChartData: PassFailChartData;
    groupStudentCounts: GroupStudentCount[];
    registeredStudentsStatistics: RegisteredStudentsStatistics;
}




export interface ProficiencyExamGroupChartData {
    year:          number;
    englishExams:  ProficiencyExamGroupChartDataExam[];
    arabicExams:   ProficiencyExamGroupChartDataExam[];
    computerExams: ProficiencyExamGroupChartDataExam[];
}

export interface ProficiencyExamGroupChartDataExam {
    month:                    number;
    monthName:                string;
    totalStudentsUsedTickets: number;
}

export interface SuperadminCurrentExamsTable {
    currentExams:        CurrentExam[];
    totalCurrentExams:   number;
    totalActiveStudents: number;
}

export interface CurrentExam {
    examId:                 string;
    examName:               string;
    examCenterId:           string;
    examCenterName:         string;
    governorateId:          number;
    governorateName:        string;
    currentStudentsCount:   number;
    examStatus:             string;
    examStartTime:          Date;
    examEndTime:            Date;
    completedStudentsCount: number;
    activeStudentsCount:    number;
}

export interface RegisteredStudentsStatistics {
    totalRegisteredStudents:               number;
    totalStudentsBookedExams:              number;
    totalStudentsPresencedInExams:         number;
    totalStudentsAbsencedInExams:          number;
    totalStudentsBookedExamsRatio:         number;
    totalStudentsPresencedInExamsRatio:    number;
    totalStudentsAbsencedInExamsRatio:     number;
}

export interface PassFailData {
    groupId: number | null;
    groupName: string;
    subjectId: number | null;
    subjectName: string;
    passed: number;
    failed: number;
}

export interface PassFailChartData {
    data: PassFailData[];
    groups: { id: number; name: string }[];
    subjects: { id: number; name: string }[];
}

export interface GroupStudentCount {
    groupId: number;
    groupName: string;
    studentCount: number;
}

export interface CollegeStudentCount {
    collegeId: number;
    collegeName: string;
    studentCount: number;
}