
export interface FinancialDashboardResponse {
    totalIncome:                    number;
    totalComputerExamIncome:        number;
    totalArabicExamIncome:          number;
    totalEnglishExamIncome:         number;
    incomeByExamType:               IncomeByExamType[];
    monthlyIncome:                  MonthlyIncome[];
    bookingPercentageByGovernorate: BookingPercentageByGovernorate[];
    incomeByExamCenter:             IncomeByExamCenter[];
}

export interface BookingPercentageByGovernorate {
    governorateName: string;
    percentage:      number;
}

export interface IncomeByExamCenter {
    examCenterName: string;
    income:         number;
}

export interface IncomeByExamType {
    examType:   string;
    percentage: number;
}

export interface MonthlyIncome {
    month:            string;
    totalIncome:      number;
    examTypeIncomes:  ExamTypeIncome[];
}

export interface ExamTypeIncome {
    examType: number;
    income:   number;
}