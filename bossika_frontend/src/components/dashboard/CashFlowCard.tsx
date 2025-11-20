import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { dashboardService } from '@/services/dashboard.service';

export default function CashFlowCard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cashFlowSummary'],
    queryFn: () => dashboardService.getCashFlow(),
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Cash Flow Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Cash Flow Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>Failed to load cash flow data</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const cashFlow = data;
  const isPositive = cashFlow.net_cash_flow >= 0;
  const trendUp = cashFlow.trend === 'up';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-blue-600" />
          Cash Flow Summary
        </CardTitle>
        <CardDescription>
          {cashFlow.period} Overview
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Income */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ArrowUpRight className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Income</p>
              <p className="text-2xl font-bold text-green-700">
                {formatCurrency(cashFlow.total_income)}
              </p>
            </div>
          </div>
          {cashFlow.change_percentage !== undefined && (
            <div className="text-right">
              <p className="text-xs text-gray-600">vs last period</p>
              <p className={`text-sm font-semibold ${
                cashFlow.change_percentage >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {cashFlow.change_percentage > 0 ? '+' : ''}{cashFlow.change_percentage.toFixed(1)}%
              </p>
            </div>
          )}
        </div>

        {/* Total Expenses */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <ArrowDownRight className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-red-700">
                {formatCurrency(cashFlow.total_expenses)}
              </p>
            </div>
          </div>
        </div>

        {/* Net Cash Flow */}
        <div className={`flex items-center justify-between p-4 rounded-lg border ${
          isPositive 
            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' 
            : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isPositive ? 'bg-blue-100' : 'bg-orange-100'
            }`}>
              {trendUp ? (
                <TrendingUp className={`h-5 w-5 ${isPositive ? 'text-blue-600' : 'text-orange-600'}`} />
              ) : (
                <TrendingDown className={`h-5 w-5 ${isPositive ? 'text-blue-600' : 'text-orange-600'}`} />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Net Cash Flow</p>
              <p className={`text-2xl font-bold ${
                isPositive ? 'text-blue-700' : 'text-orange-700'
              }`}>
                {isPositive ? '+' : ''}{formatCurrency(cashFlow.net_cash_flow)}
              </p>
            </div>
          </div>
          {cashFlow.change_percentage !== undefined && (
            <div className="flex items-center gap-1">
              {trendUp ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm font-semibold ${
                trendUp ? 'text-green-600' : 'text-red-600'
              }`}>
                {cashFlow.change_percentage > 0 ? '+' : ''}{cashFlow.change_percentage.toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        {/* Period Info */}
        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500 text-center">
            Data for {cashFlow.period}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
