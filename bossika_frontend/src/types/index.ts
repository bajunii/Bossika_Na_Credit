// Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  onboarding_completed: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

// Onboarding Types
export interface BusinessDetails {
  business_name: string;
  business_type: string;
  industry: string;
  registration_number?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface BusinessGoals {
  primary_goal: string;
  target_revenue?: number;
  target_profit?: number;
  time_frame?: string;
  additional_goals?: string[];
}

export interface IncomeExpenseSetup {
  monthly_income?: number;
  income_sources?: string[];
  monthly_expenses?: number;
  expense_categories?: ExpenseCategory[];
}

export interface ExpenseCategory {
  name: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface OnboardingData {
  business_details?: BusinessDetails;
  goals?: BusinessGoals;
  income_expense?: IncomeExpenseSetup;
  current_step: number;
  completed: boolean;
}

// Dashboard Types
export interface CashFlowSummary {
  total_income: number;
  total_expenses: number;
  net_cash_flow: number;
  period: string;
  trend: 'up' | 'down' | 'stable';
  change_percentage: number;
}

export interface BusinessHealthStatus {
  status: 'healthy' | 'warning' | 'critical';
  score: number;
  factors: HealthFactor[];
}

export interface HealthFactor {
  name: string;
  status: 'good' | 'warning' | 'critical';
  message: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action: string;
  category: string;
}

export interface DashboardSummary {
  cash_flow: CashFlowSummary;
  health_status: BusinessHealthStatus;
  recommendations: Recommendation[];
  quick_stats: QuickStats;
}

export interface QuickStats {
  total_transactions: number;
  pending_invoices: number;
  upcoming_expenses: number;
  available_credit: number;
}
