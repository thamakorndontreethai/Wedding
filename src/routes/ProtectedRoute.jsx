import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * @param {{ children: import('react').ReactNode, allowedRoles?: string[] }} props
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoggedIn } = useAuthStore();

  if (!isLoggedIn) return <Navigate to="/login" />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />; // สิทธิ์ไม่ถึงให้กลับหน้าแรก
  }

  return children;
};

export default ProtectedRoute;