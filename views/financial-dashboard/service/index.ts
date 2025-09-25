import axiosIns from "~/services/app-client/axios"
import type { FinancialDashboardResponse } from "../types"

export interface IFinancialDashboardService {
    getFinancialDashboard(year: number, month: number): Promise<FinancialDashboardResponse>
}

export class FinancialDashboardService implements IFinancialDashboardService {
    async getFinancialDashboard(year: number, month: number): Promise<FinancialDashboardResponse> {
        const response = await axiosIns.get<FinancialDashboardResponse>(`/statistics/financial?year=${year}&month=${month}`)
        return response.data
    }
}

