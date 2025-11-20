import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import QuickStatsGrid from '@/components/dashboard/QuickStatsGrid';
import CashFlowCard from '@/components/dashboard/CashFlowCard';
import BusinessHealthCard from '@/components/dashboard/BusinessHealthCard';
import RecommendationsCard from '@/components/dashboard/RecommendationsCard';
import { LogOut, Settings } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:h-16">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">Bossika Na Credit</h1>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                Welcome back, <span className="font-semibold text-blue-600">{user?.name || 'User'}</span>
              </p>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 ml-2">
              <Button variant="outline" size="sm" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 hidden sm:flex">
                <Settings className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
              <Button variant="outline" size="sm" className="sm:hidden text-gray-700">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hidden sm:flex">
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="sm:hidden text-red-600 border-red-200">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 text-white shadow-lg">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">Dashboard</h2>
            <p className="text-blue-100 text-sm sm:text-base md:text-lg">
              Monitor your business performance and get insights
            </p>
          </div>

          {/* Quick Stats */}
          <QuickStatsGrid />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Cash Flow */}
            <div className="lg:col-span-2 space-y-6">
              <CashFlowCard />
              <RecommendationsCard />
            </div>

            {/* Right Column - Health Status */}
            <div className="lg:col-span-1">
              <BusinessHealthCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
