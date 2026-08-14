import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/authContextValue";

const ProtectedRoute = ({ adminOnly = false }) => {
  const { token, isAdmin } = useAuth();

  if (!token) {
    return <Navigate to={adminOnly ? "/admin/login" : "/login"} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
