import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ user, allowedRoles }) => {
  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized
  return <Outlet />;
};

export default PrivateRoute;