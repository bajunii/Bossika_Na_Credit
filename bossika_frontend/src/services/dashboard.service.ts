import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api';
import type {
  DashboardSummary,
  CashFlowSummary,
  BusinessHealthStatus,
  Recommendation,
} from '@/types';

export const dashboardService = {
  // Get complete dashboard summary
  async getDashboardSummary(): Promise<DashboardSummary> {
    const response = await axiosInstance.get<DashboardSummary>(
      API_ENDPOINTS.DASHBOARD.SUMMARY
    );
    return response.data;
  },

  // Get cash flow data
  async getCashFlow(period?: string): Promise<CashFlowSummary> {
    const response = await axiosInstance.get<CashFlowSummary>(
      API_ENDPOINTS.DASHBOARD.CASH_FLOW,
      { params: { period } }
    );
    return response.data;
  },

  // Get business health status
  async getHealthStatus(): Promise<BusinessHealthStatus> {
    const response = await axiosInstance.get<BusinessHealthStatus>(
      API_ENDPOINTS.DASHBOARD.HEALTH_STATUS
    );
    return response.data;
  },

  // Get recommendations
  async getRecommendations(): Promise<Recommendation[]> {
    const response = await axiosInstance.get<Recommendation[]>(
      API_ENDPOINTS.DASHBOARD.RECOMMENDATIONS
    );
    return response.data;
  },
};
