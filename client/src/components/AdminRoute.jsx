import { useAuth } from "@clerk/react";
import { Navigate } from "react-router-dom";
import useUserStore from "../stores/useUserStore";

const AdminRoute = ({ children }) => {
  const { userId, isLoaded } = useAuth();
  const { user, isLoading, hasFetched } = useUserStore();

  if (!isLoaded || (userId && (isLoading || !hasFetched))) {
    return null;
  }

  if (!userId || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
