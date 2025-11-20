import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api';
import type {
  BusinessDetails,
  BusinessGoals,
  IncomeExpenseSetup,
  OnboardingData,
} from '@/types';

export const onboardingService = {
  // Save business details
  async saveBusinessDetails(
    data: BusinessDetails
  ): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.ONBOARDING.BUSINESS_DETAILS,
      data
    );
    return response.data;
  },

  // Save business goals
  async saveBusinessGoals(
    data: BusinessGoals
  ): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.ONBOARDING.GOALS,
      data
    );
    return response.data;
  },

  // Save income/expense setup
  async saveIncomeExpenseSetup(
    data: IncomeExpenseSetup
  ): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.ONBOARDING.INCOME_EXPENSE,
      data
    );
    return response.data;
  },

  // Complete onboarding
  async completeOnboarding(): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.ONBOARDING.COMPLETE
    );
    return response.data;
  },

  // Get onboarding status
  async getOnboardingStatus(): Promise<OnboardingData> {
    const response = await axiosInstance.get<OnboardingData>(
      API_ENDPOINTS.ONBOARDING.BUSINESS_DETAILS
    );
    return response.data;
  },
};
