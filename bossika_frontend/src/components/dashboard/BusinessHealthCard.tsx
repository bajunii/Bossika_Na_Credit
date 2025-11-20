import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Activity 
} from 'lucide-react';
import { dashboardService } from '@/services/dashboard.service';
import type { BusinessHealthStatus } from '@/types';

export default function BusinessHealthCard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['healthStatus'],
    queryFn: () => dashboardService.getHealthStatus(),
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Business Health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Business Health</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>Failed to load health status</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const health = data as BusinessHealthStatus;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'critical':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle>Business Health Status</CardTitle>
        <CardDescription>Overall health assessment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Status */}
        <div className={`p-6 rounded-lg ${getStatusColor(health.status)}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold capitalize">{health.status}</h3>
            <Badge variant="outline" className="text-lg font-bold">
              {health.score}/100
            </Badge>
          </div>
          <div className="w-full bg-white/50 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all"
              style={{
                width: `${health.score}%`,
                backgroundColor:
                  health.status === 'healthy'
                    ? '#22c55e'
                    : health.status === 'warning'
                    ? '#eab308'
                    : '#ef4444',
              }}
            />
          </div>
        </div>

        {/* Health Factors */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Key Factors</h4>
          {health.factors.map((factor, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="mt-0.5">{getStatusIcon(factor.status)}</div>
              <div className="flex-1">
                <p className="font-medium text-sm">{factor.name}</p>
                <p className="text-sm text-muted-foreground">{factor.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
