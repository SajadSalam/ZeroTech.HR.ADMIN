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