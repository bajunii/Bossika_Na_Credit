// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  TIMEOUT: 30000,
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  ONBOARDING: {
    BUSINESS_DETAILS: '/onboarding/business',
    GOALS: '/onboarding/goals',
    INCOME_EXPENSE: '/onboarding/income-expense',
    COMPLETE: '/onboarding/complete',
  },
  DASHBOARD: {
    SUMMARY: '/dashboard/summary',
    CASH_FLOW: '/dashboard/cash-flow',
    HEALTH_STATUS: '/dashboard/health-status',
    RECOMMENDATIONS: '/dashboard/recommendations',
  },
  BUSINESS: {
    PROFILE: '/business/profile',
    UPDATE: '/business/update',
  },
};
