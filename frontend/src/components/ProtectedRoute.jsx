import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function ProtectedRoute({ role, children }) {
  const { token, role: userRole } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    // Logged in but wrong role — send to their own dashboard
    const fallback =
      userRole === "Admin"
        ? "/admin"
        : userRole === "Doctor"
        ? "/doctor"
        : "/patient";
    return <Navigate to={fallback} replace />;
  }

  return children;
}
