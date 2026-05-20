import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="glass-card p-8 text-center max-w-md">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-dark-100 mb-2">Access Denied</h2>
          <p className="text-dark-400 text-sm">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
