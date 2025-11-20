/**
 * Enhanced Data Models for Dashboard Implementation
 * These models represent the core business entities displayed on the dashboard
 */

// ============================================
// USER MODEL - User account and profile data
// ============================================
export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  
  // Authentication
  is_active: boolean;
  email_verified: boolean;
  last_login?: string;
  
  // Profile
  profile?: UserProfile;
  
  // Business linkage
  business_profiles: BusinessProfile[];
  current_business_id?: string;
  
  // Onboarding
  onboarding_completed: boolean;
  onboarding_step?: number;
}

export interface UserProfile {
  first_name: string;
  last_name: string;
  avatar_url?: string;
  bio?: string;
  timezone?: string;
  language?: string;
  notification_preferences: NotificationPreferences;
}

export interface NotificationPreferences {
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  weekly_report: boolean;
  loan_alerts: boolean;
}

// ============================================
// BUSINESS PROFILE MODEL - Business information
// ============================================
export interface BusinessProfile {
  id: string;
  user_id: string;
  
  // Basic Information
  business_name: string;
  business_type: 'sole_proprietorship' | 'partnership' | 'corporation' | 'llc' | 'other';
  industry: string;
  registration_number?: string;
  tax_id?: string;
  
  // Contact Details
  email?: string;
  phone?: string;
  website?: string;
  
  // Address
  address: BusinessAddress;
  
  // Business Details
  founded_date?: string;
  employee_count?: number;
  annual_revenue?: number;
  
  // Goals and Metrics
  goals: BusinessGoals;
  
  // Financial Status
  financial_health_score: number;
  credit_score?: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface BusinessAddress {
  street?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country: string;
}

export interface BusinessGoals {
  primary_goal: string;
  target_revenue?: number;
  target_profit?: number;
  time_frame?: string;
  growth_rate_target?: number;
  additional_goals: string[];
}

// ============================================
// CASH FLOW MODEL - Income and expense tracking
// ============================================
export interface CashFlow {
  id: string;
  business_id: string;
  
  // Period Information
  period_start: string;
  period_end: string;
  period_type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  
  // Income
  total_income: number;
  income_breakdown: IncomeBreakdown[];
  
  // Expenses
  total_expenses: number;
  expense_breakdown: ExpenseBreakdown[];
  
  // Net Cash Flow
  net_cash_flow: number;
  opening_balance: number;
  closing_balance: number;
  
  // Trends
  trend: 'increasing' | 'decreasing' | 'stable';
  change_percentage: number;
  compared_to_previous_period: ComparisonData;
  
  // Projections
  projected_next_period?: ProjectedCashFlow;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface IncomeBreakdown {
  category: string;
  amount: number;
  percentage_of_total: number;
  source: string;
  date: string;
  recurring: boolean;
}

export interface ExpenseBreakdown {
  category: string;
  amount: number;
  percentage_of_total: number;
  vendor?: string;
  date: string;
  recurring: boolean;
  is_necessary: boolean;
}

export interface ComparisonData {
  previous_income: number;
  previous_expenses: number;
  previous_net: number;
  income_change: number;
  expense_change: number;
  net_change: number;
}

export interface ProjectedCashFlow {
  projected_income: number;
  projected_expenses: number;
  projected_net: number;
  confidence_level: 'high' | 'medium' | 'low';
}

// ============================================
// LOAN MODEL - Loan application and management
// ============================================
export interface Loan {
  id: string;
  business_id: string;
  user_id: string;
  
  // Loan Details
  loan_type: 'working_capital' | 'equipment' | 'expansion' | 'emergency' | 'other';
  loan_amount: number;
  currency: string;
  
  // Terms
  interest_rate: number;
  term_months: number;
  monthly_payment: number;
  total_repayment: number;
  
  // Status
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'active' | 'completed' | 'defaulted';
  approval_date?: string;
  disbursement_date?: string;
  maturity_date?: string;
  
  // Purpose
  purpose: string;
  description?: string;
  
  // Eligibility
  eligibility_score: number;
  eligibility_status: 'eligible' | 'partially_eligible' | 'not_eligible';
  requirements_met: LoanRequirement[];
  
  // Repayment
  repayment_schedule: RepaymentSchedule[];
  payments_made: number;
  total_paid: number;
  outstanding_balance: number;
  next_payment_date?: string;
  next_payment_amount?: number;
  
  // Credit Check
  credit_check_status?: 'pending' | 'completed' | 'failed';
  credit_score_used?: number;
  
  // Documents
  required_documents: LoanDocument[];
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface LoanRequirement {
  requirement: string;
  met: boolean;
  details?: string;
}

export interface RepaymentSchedule {
  payment_number: number;
  due_date: string;
  principal_amount: number;
  interest_amount: number;
  total_amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'missed';
  paid_date?: string;
  paid_amount?: number;
}

export interface LoanDocument {
  document_type: string;
  required: boolean;
  uploaded: boolean;
  file_url?: string;
  uploaded_at?: string;
}

// ============================================
// ADVICE MODEL - AI-generated recommendations
// ============================================
export interface Advice {
  id: string;
  business_id: string;
  
  // Advice Details
  title: string;
  category: 'cash_flow' | 'expenses' | 'revenue' | 'loans' | 'growth' | 'risk' | 'general';
  priority: 'critical' | 'high' | 'medium' | 'low';
  
  // Content
  description: string;
  detailed_analysis: string;
  recommended_actions: RecommendedAction[];
  
  // Impact
  potential_impact: ImpactMetrics;
  time_to_implement: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  effort_level: 'low' | 'medium' | 'high';
  
  // Status
  status: 'new' | 'viewed' | 'in_progress' | 'completed' | 'dismissed';
  viewed_at?: string;
  completed_at?: string;
  
  // AI Context
  generated_by: 'ai' | 'system' | 'manual';
  confidence_score: number;
  data_sources: string[];
  
  // Related Data
  related_cash_flow_id?: string;
  related_loan_id?: string;
  tags: string[];
  
  // Feedback
  user_rating?: number;
  user_feedback?: string;
  was_helpful?: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

export interface RecommendedAction {
  step_number: number;
  action: string;
  description: string;
  completed: boolean;
  completed_at?: string;
}

export interface ImpactMetrics {
  financial_impact?: number; // positive or negative dollar amount
  risk_reduction?: number; // percentage
  efficiency_gain?: number; // percentage
  revenue_increase?: number; // percentage
  cost_savings?: number; // dollar amount
  description: string;
}

// ============================================
// DASHBOARD AGGREGATED MODELS
// ============================================
export interface DashboardData {
  user: User;
  business_profile: BusinessProfile;
  current_cash_flow: CashFlow;
  cash_flow_history: CashFlow[];
  active_loans: Loan[];
  loan_history: Loan[];
  active_advice: Advice[];
  advice_history: Advice[];
  
  // Aggregated Metrics
  metrics: DashboardMetrics;
}

export interface DashboardMetrics {
  // Financial Overview
  total_revenue_ytd: number;
  total_expenses_ytd: number;
  net_profit_ytd: number;
  profit_margin: number;
  
  // Cash Position
  current_cash_balance: number;
  projected_cash_30_days: number;
  burn_rate: number;
  runway_months: number;
  
  // Loan Summary
  total_loan_amount: number;
  total_outstanding: number;
  monthly_loan_payments: number;
  next_payment_due: string | null;
  
  // Business Health
  health_score: number;
  health_status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  risk_level: 'low' | 'medium' | 'high';
  
  // Activity
  pending_actions: number;
  unread_advice: number;
  upcoming_payments: number;
  overdue_payments: number;
}
