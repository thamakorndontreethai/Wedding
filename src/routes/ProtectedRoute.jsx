import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * @param {{ children: import('react').ReactNode, allowedRoles?: string[] }} props
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoggedIn } = useAuthStore();

  // Guard against transient localStorage/state mismatch where token exists but user is missing.
  if (!isLoggedIn || !user) return <Navigate to="/login" replace />;

  if (allowedRoles.length > 0 && !user.role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // สิทธิ์ไม่ถึงให้กลับหน้าแรก
  }

  return children;
};

export default ProtectedRoute;