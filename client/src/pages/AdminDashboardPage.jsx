import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Tag,
  Users,
  ShoppingCart,
  DollarSign,
  Calendar,
  Filter,
  ChevronDown,
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
import SummaryCard from "../components/SummaryCard";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

const AdminDashboardPage = () => {
  const { counts, analytics, isDashboardLoading, fetchDashboard } =
    useAdminStore();

  const [filters, setFilters] = useState({
    year: new Date().getFullYear().toString(),
    month: "",
    range: "",
  });

  useEffect(() => {
    fetchDashboard(filters);
  }, [fetchDashboard, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };
      if (name === "range" && value === "7days") {
        newFilters.year = "";
        newFilters.month = "";
      } else if (name === "year" || name === "month") {
        newFilters.range = "";
      }
      return newFilters;
    });
  };

  const years = Array.from({ length: 5 }, (_, i) =>
    (new Date().getFullYear() - i).toString(),
  );
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

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
      label: "Total Categories",
      value: counts.categories,
      icon: Tag,
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: "Total Products",
      value: counts.products,
      icon: Package,
      color: "from-[#F76C2E] to-[#d45a22]",
    },
  ];

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Filters */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 bg-gray-800/50 p-4 rounded-xl border border-gray-700 backdrop-blur-md">
        <div className="flex items-center gap-2 text-emerald-400">
          <Filter size={20} />
          <span className="font-semibold text-sm uppercase tracking-wider">
            Filters:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <select
              name="range"
              value={filters.range}
              onChange={handleFilterChange}
              className="appearance-none border border-gray-700 bg-gray-900/60 py-2.5 pr-10 text-sm text-white rounded-lg outline-none focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
            >
              <option value="">Select Range</option>
              <option value="7days">Last 7 Days</option>
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>

          <div className="h-6 w-px bg-gray-700 hidden sm:block"></div>
          <div className="relative">
            <select
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              className="appearance-none border border-gray-700 bg-gray-900/60 py-2.5 text-sm text-white rounded-lg outline-none focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
            >
              <option value="">Select Year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>
          <div className="relative">
            <select
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
              className="appearance-none border border-gray-700 bg-gray-900/60 py-2.5 pr-5 text-sm text-white rounded-lg outline-none focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
            >
              <option value="">Full Year</option>
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>

          {(filters.year || filters.month || filters.range) && (
            <button
              onClick={() =>
                setFilters({
                  year: new Date().getFullYear().toString(),
                  month: "",
                  range: "",
                })
              }
              className="text-xs text-gray-400 hover:text-white transition-colors underline underline-offset-4"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 mb-10 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div>
            {/* <div
              key={stat.label}
              className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-md transition-all duration-300 hover:border-emerald-500/50"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-400">
                  {stat.label}
                </h3>
                <div
                  className={`rounded-lg bg-gradient-to-r p-2 ${stat.color}`}
                >
                  <stat.icon size={20} className="text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">
                {isDashboardLoading ? "..." : stat.value}
              </p>
            </div> */}
            <SummaryCard
              key={stat.label}
              title={stat.label}
              value={stat.value}
              icon={<stat.icon size={20} className="text-white" />}
              color={stat.color}
              bgColor="bg-gradient-to-r"
              isLoading={isDashboardLoading}
            />
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Sales Over Time - Line Chart */}
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 backdrop-blur-md">
          <h3 className="text-lg font-semibold mb-6 text-emerald-400">
            Sales Over Time{" "}
            {filters.range === "7days"
              ? "(Last 7 Days)"
              : filters.month
                ? `(${
                    months.find((m) => m.value === filters.month)?.label
                  } ${filters.year})`
                : filters.year
                  ? `(${filters.year})`
                  : "(Last 7 Days)"}
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
  );
};

export default AdminDashboardPage;
