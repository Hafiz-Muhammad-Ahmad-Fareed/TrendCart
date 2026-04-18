import {
  Tag,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

const AdminDashboardPage = () => {
  // Placeholder stats — replace with real API data later
  const stats = [
    {
      label: "Total Categories",
      value: "0",
      icon: Tag,
      color: "from-amber-500 to-orange-600",
    },
    {
      label: "Total Products",
      value: "0",
      icon: Package,
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: "Total Orders",
      value: "0",
      icon: ShoppingCart,
      color: "from-blue-500 to-indigo-600",
    },
    {
      label: "Total Users",
      value: "0",
      icon: Users,
      color: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard className="text-emerald-400" size={32} />
          <h1 className="text-4xl font-bold text-emerald-400">
            Admin Dashboard
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 hover:border-emerald-500/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm font-medium">
                  {stat.label}
                </h3>
                <div
                  className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}
                >
                  <stat.icon size={20} className="text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center gap-3 bg-amber-600 hover:bg-amber-700 text-white px-5 py-3 rounded-lg transition duration-300 cursor-pointer">
              <Tag size={18} />
              Add New Category
            </button>
            <button className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-lg transition duration-300 cursor-pointer">
              <Package size={18} />
              Add New Product
            </button>
            <button className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition duration-300 cursor-pointer">
              <ShoppingCart size={18} />
              View Orders
            </button>
            <button className="flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg transition duration-300 cursor-pointer">
              <Users size={18} />
              Manage Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
