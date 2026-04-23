import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { PageLoader } from './Loader';

const ProtectedRoute = ({ requireRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireRole && user.role !== requireRole) {
    return <Navigate to={user.role === 'seller' ? '/dashboard' : '/'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
