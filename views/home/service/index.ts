import axiosIns from "~/services/app-client/axios";
import type { Counts } from "../types/counts";
import type { GovernorateBookingChartData } from "../types/governorateBookingChart";
import type { ProficiencyExamGroupChartData } from "../types/proficiencyExamGroupChartData";

interface IHomeService {
  getCounts: () => Promise<Counts>
  getProficiencyExamGroupChartData: (year: number) => Promise<ProficiencyExamGroupChartData>
}

export class HomeService implements IHomeService {
  async getCounts(): Promise<Counts> {
    const response = await axiosIns.get<Counts>('/statistics/superadmin/counts-and-ratios')
    return response.data
  }
  
  async getProficiencyExamGroupChartData(year: number): Promise<ProficiencyExamGroupChartData> {
    const response = await axiosIns.get<ProficiencyExamGroupChartData>('/statistics/superadmin/proficiency-exam-group-chart-data?year=' + year)
    return response.data
  }

  async getGovernorateBookingChartData(year: number, month: number): Promise<GovernorateBookingChartData> {
    const response = await axiosIns.get<GovernorateBookingChartData>('/statistics/superadmin/governorate-booking-chart-data?year=' + year + '&month=' + month)
    return response.data
  }
}
