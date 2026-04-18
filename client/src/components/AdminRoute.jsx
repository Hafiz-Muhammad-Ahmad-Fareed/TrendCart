import { Navigate } from "react-router-dom";
import useUserStore from "../stores/useUserStore";

/**
 * Protects admin-only routes.
 * - If user data is still loading → shows nothing (or a loader)
 * - If user is not admin → redirects to home
 * - If user is admin → renders the child route
 */
const AdminRoute = ({ children }) => {
  const { user } = useUserStore();

  if (!user) {
    return null; // still loading user data
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
