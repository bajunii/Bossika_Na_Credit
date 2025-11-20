import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireOnboarding = false 
}: ProtectedRouteProps) {
  // Bypass authentication check when backend is disabled
  // TODO: Remove this bypass when backend is integrated
  const BACKEND_DISABLED = true;

  if (BACKEND_DISABLED) {
    // Allow access to all routes without authentication
    return <>{children}</>;
  }

  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If the route requires onboarding and user hasn't completed it
  if (requireOnboarding && !user?.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
