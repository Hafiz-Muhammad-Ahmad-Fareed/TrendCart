import { useEffect } from "react";
import { LayoutDashboard, Package, Tag, Users } from "lucide-react";
import { Link } from "react-router-dom";
import useAdminStore from "../stores/useAdminStore";

const AdminDashboardPage = () => {
  const { counts, isDashboardLoading, fetchDashboard } = useAdminStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const stats = [
    {
      label: "Total Categories",
      value: counts.categories,
      icon: Tag,
      color: "from-amber-500 to-orange-600",
    },
    {
      label: "Total Products",
      value: counts.products,
      icon: Package,
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: "Active Products",
      value: counts.activeProducts,
      icon: Package,
      color: "from-blue-500 to-indigo-600",
    },
    {
      label: "Total Users",
      value: counts.users,
      icon: Users,
      color: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard className="text-emerald-400" size={32} />
          <div>
            <h2 className="text-4xl font-bold text-emerald-400">
              Admin Dashboard
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Track how much of the catalog is live and where to manage it next.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-12 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-md transition-all duration-300 hover:border-emerald-500/50"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-400">
                  {stat.label}
                </h3>
                <div className={`rounded-lg bg-gradient-to-r p-2 ${stat.color}`}>
                  <stat.icon size={20} className="text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">
                {isDashboardLoading ? "..." : stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-md">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/admin-dashboard/categories"
              className="flex items-center justify-center gap-3 rounded-lg bg-amber-600 px-5 py-3 text-white transition duration-300 hover:bg-amber-700"
            >
              <Tag size={18} />
              Manage Categories
            </Link>
            <Link
              to="/admin-dashboard/products"
              className="flex items-center justify-center gap-3 rounded-lg bg-emerald-600 px-5 py-3 text-white transition duration-300 hover:bg-emerald-700"
            >
              <Package size={18} />
              Manage Products
            </Link>
            <div className="flex items-center justify-center gap-3 rounded-lg border border-blue-500/30 bg-blue-600/20 px-5 py-3 text-blue-200">
              <Package size={18} />
              {isDashboardLoading ? "Refreshing..." : "Catalog synced"}
            </div>
            <div className="flex items-center justify-center gap-3 rounded-lg border border-purple-500/30 bg-purple-600/20 px-5 py-3 text-purple-200">
              <Users size={18} />
              {counts.users} synced users
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
