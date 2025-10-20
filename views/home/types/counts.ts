
export interface Counts {
  totalActiveExamCenters:        number;
    totalHalls:                    number;
    totalActiveExternalStudents:   number;
    totalHallSeatsCapacity:        number;
    totalPaidAmounts:              number;
    totalUpcomingExams:            number;
    todayTicketsToSeatsRatio:      number;
    currentActiveExams:            number;
    examCentersAcceptanceStatus:   ExamCentersAcceptanceStatus;
    monthlyBookingStatistics:      MonthlyBookingStatistics;
    proficiencyExamGroupChartData: ProficiencyExamGroupChartData;
    governorateBookingChartData:   GovernorateBookingChartData;
    superadminCurrentExamsTable:   SuperadminCurrentExamsTable;
    registeredStudentsStatistics:  RegisteredStudentsStatistics;
}

export interface ExamCentersAcceptanceStatus {
    acceptedCenters:      number;
    totalCentersForExams: number;
    acceptanceRatio:      number;
    rejectionRatio:       number;
}

export interface GovernorateBookingChartData {
    month:        number;
    year:         number;
    monthName:    string;
    governorates: any[];
}

export interface MonthlyBookingStatistics {
    totalSeatsBooked: number;
    totalCapacity:    number;
    totalEmptySeats:  number;
    bookingRatio:     number;
    emptySeatsRatio:  number;
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