import { LayoutDashboard, Package, Tag, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const linkClasses = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition ${
    isActive
      ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
      : "border-gray-700 bg-gray-900/60 text-gray-300 hover:border-emerald-500/40 hover:text-emerald-200"
  }`;

const AdminLayout = () => {
  return (
    <div className="relative min-h-screen text-white">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-emerald-300/70">
              TrendCart Admin
            </p>
            <h1 className="text-4xl font-bold text-white">
              Catalog control center
            </h1>
            <p className="mt-2 max-w-2xl text-gray-300">
              Manage categories, products, and the live storefront catalog from
              one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <NavLink end to="/admin-dashboard" className={linkClasses}>
              <LayoutDashboard size={16} />
              Dashboard
            </NavLink>
            <NavLink to="/admin-dashboard/categories" className={linkClasses}>
              <Tag size={16} />
              Categories
            </NavLink>
            <NavLink to="/admin-dashboard/products" className={linkClasses}>
              <Package size={16} />
              Products
            </NavLink>
            <NavLink to="/admin-dashboard/users" className={linkClasses}>
              <Users size={16} />
              Users
            </NavLink>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
