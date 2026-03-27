import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoggedIn } = useAuthStore();

  if (!isLoggedIn) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />; // สิทธิ์ไม่ถึงให้กลับหน้าแรก
  }

  return children;
};

export default ProtectedRoute;