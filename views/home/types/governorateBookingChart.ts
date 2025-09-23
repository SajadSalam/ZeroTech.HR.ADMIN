   
export interface GovernorateBookingChartData {
   month:        number;
   year: number;
   monthName: string;
   governorates: GovernorateBookingChartDataGovernorate[];
}

export interface GovernorateBookingChartDataGovernorate {
    governorateId:    number;
    governorateName:  string;
    totalBookedSeats: number;
}