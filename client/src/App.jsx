import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "@clerk/react";
import HomePage from "./pages/HomePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import CategoryPage from "./pages/CategoryPage";
import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import useUserStore from "./stores/useUserStore";

function App() {
  const { userId, isLoaded } = useAuth();
  const { user, fetchUser, resetUser, hasFetched, isLoading } = useUserStore();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!userId) {
      resetUser();
      return;
    }

    if (!hasFetched && !isLoading) {
      fetchUser();
    }
  }, [fetchUser, hasFetched, isLoaded, isLoading, resetUser, userId]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 h-full w-full -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>

      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              user?.role === "admin" ? (
                <Navigate to="/admin-dashboard" replace />
              ) : (
                <HomePage />
              )
            }
          />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route
            path="/admin-dashboard"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="products" element={<AdminProductsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
