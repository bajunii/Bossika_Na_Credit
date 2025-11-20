import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  CreditCard 
} from 'lucide-react';
import { dashboardService } from '@/services/dashboard.service';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

function StatCard({ title, value, icon, color, bgColor }: StatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1 font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`p-4 ${bgColor} rounded-xl shadow-sm`}>
            <div className={color}>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function QuickStatsGrid() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: () => dashboardService.getDashboardSummary(),
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="shadow-md">
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = data?.quick_stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Transactions"
        value={stats?.total_transactions || 0}
        icon={<FileText className="h-6 w-6" />}
        color="text-blue-600"
        bgColor="bg-blue-100"
      />
      <StatCard
        title="Pending Invoices"
        value={stats?.pending_invoices || 0}
        icon={<DollarSign className="h-6 w-6" />}
        color="text-green-600"
        bgColor="bg-green-100"
      />
      <StatCard
        title="Upcoming Expenses"
        value={stats?.upcoming_expenses || 0}
        icon={<Calendar className="h-6 w-6" />}
        color="text-orange-600"
        bgColor="bg-orange-100"
      />
      <StatCard
        title="Available Credit"
        value={stats?.available_credit ? `$${stats.available_credit.toLocaleString()}` : '$0'}
        icon={<CreditCard className="h-6 w-6" />}
        color="text-purple-600"
        bgColor="bg-purple-100"
      />
    </div>
  );
}
