import { useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  Tag,
  Users,
  ShoppingCart,
  DollarSign,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import useAdminStore from "../stores/useAdminStore";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

const AdminDashboardPage = () => {
  const { counts, analytics, isDashboardLoading, fetchDashboard } =
    useAdminStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const stats = [
    {
      label: "Total Revenue",
      value: `$${counts.totalRevenue?.toFixed(2) || "0.00"}`,
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
    },
    {
      label: "Total Orders",
      value: counts.orders || "0",
      icon: ShoppingCart,
      color: "from-blue-500 to-indigo-600",
    },
    {
      label: "Total Products",
      value: counts.products,
      icon: Package,
      color: "from-emerald-500 to-teal-600",
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
              Real-time store analytics and overview.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
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

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Sales Over Time - Line Chart */}
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 backdrop-blur-md">
            <h3 className="text-lg font-semibold mb-6 text-emerald-400">
              Sales Over Time (Last 7 Days)
            </h3>
            <div className="h-80 w-full">
              {analytics?.salesOverTime ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.salesOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="date"
                      stroke="#9ca3af"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        borderColor: "#374151",
                        color: "#fff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#10b981" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Loading analytics...
                </div>
              )}
            </div>
          </div>

          {/* Top Products - Bar Chart */}
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 backdrop-blur-md">
            <h3 className="text-lg font-semibold mb-6 text-emerald-400">
              Top 5 Products by Revenue
            </h3>
            <div className="h-80 w-full">
              {analytics?.topProducts ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.topProducts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9ca3af" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#9ca3af"
                      width={100}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        borderColor: "#374151",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Loading analytics...
                </div>
              )}
            </div>
          </div>

          {/* Order Status Distribution - Pie Chart */}
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 backdrop-blur-md">
            <h3 className="text-lg font-semibold mb-6 text-emerald-400">
              Order Status Distribution
            </h3>
            <div className="h-80 w-full">
              {analytics?.statusDistribution ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analytics.statusDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        borderColor: "#374151",
                        color: "#fff",
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Loading analytics...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
