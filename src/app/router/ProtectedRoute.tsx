import { Navigate, Outlet } from 'react-router-dom';

import { useAppSelector } from '@/app/redux/hooks';
import { Spin } from 'antd';

interface ProtectedRouteProps {
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAuth = true }) => {
  const { user, initialized } = useAppSelector((state) => state.auth);

  if (!initialized) {
    return <Spin size="large" className="flex! items-center justify-center h-screen" />;
  }

  // Route cần login
  if (requireAuth && !user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Route auth (login / register)
  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
