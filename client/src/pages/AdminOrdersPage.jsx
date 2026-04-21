import React, { useEffect, useState, useMemo } from "react";
import {
  Package,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
  ChevronDown,
  User,
  Calendar,
  CreditCard,
  ShoppingCart,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import useAdminStore from "../stores/useAdminStore";
import SummaryCard from "../components/SummaryCard";

const AdminOrdersPage = () => {
  const {
    orders,
    isOrdersLoading,
    fetchOrders,
    updateOrderStatus,
    isUpdatingOrder,
  } = useAdminStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // --- 1. Summary Statistics Logic ---
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    );
    const pending = orders.filter((o) => o.status === "pending").length;
    const processing = orders.filter((o) => o.status === "processing").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;

    return {
      totalRevenue,
      totalOrders: orders.length,
      activeOrders: pending + processing,
      deliveredOrders: delivered,
    };
  }, [orders]);

  // --- 2. Filtering Logic ---
  const filteredOrders = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    let result = [...orders].filter((order) => {
      const matchesSearch =
        order._id.toLowerCase().includes(searchLower) ||
        order.user?.fullName?.toLowerCase().includes(searchLower) ||
        order.user?.email?.toLowerCase().includes(searchLower);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    switch (sortOption) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "amountHighLow":
        result.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      case "amountLowHigh":
        result.sort((a, b) => a.totalAmount - b.totalAmount);
        break;
      case "itemsHighLow":
        result.sort((a, b) => b.items.length - a.items.length);
        break;
      case "itemsLowHigh":
        result.sort((a, b) => a.items.length - b.items.length);
        break;
      default:
        break;
    }

    return result;
  }, [orders, searchTerm, statusFilter, sortOption]);

  // --- 3. UI Helper Functions ---
  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "shipped":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "processing":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "cancelled":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle size={14} />;
      case "shipped":
        return <Truck size={14} />;
      case "processing":
        return <Clock size={14} />;
      case "cancelled":
        return <XCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-blue-500/20 p-3 text-blue-400">
          <ShoppingCart size={24} />
        </div>
        <h2 className="text-3xl font-bold text-white">Order Management</h2>
      </div>

      {/* --- Summary Cards Section --- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          icon={<DollarSign size={20} />}
          color="text-emerald-400"
          bgColor="bg-emerald-500/10"
        />
        <SummaryCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<Package size={20} />}
          color="text-blue-400"
          bgColor="bg-blue-500/10"
        />
        <SummaryCard
          title="Active Orders"
          value={stats.activeOrders}
          icon={<TrendingUp size={20} />}
          color="text-amber-400"
          bgColor="bg-amber-500/10"
        />
        <SummaryCard
          title="Completed"
          value={stats.deliveredOrders}
          icon={<CheckCircle size={20} />}
          color="text-purple-400"
          bgColor="bg-purple-500/10"
        />
      </div>

      {/* --- Search & Filters --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between w-full md:w-full">
          <div className="relative">
            <Search
              className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search ID, name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-gray-900/60 py-2.5 pr-4 pl-10 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none sm:w-80"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter
                className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-700 bg-gray-900/60 py-2.5 pr-10 pl-10 text-sm text-white focus:border-emerald-500 outline-none sm:w-52"
              >
                <option value="">Sort By</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amountHighLow">Amount: High → Low</option>
                <option value="amountLowHigh">Amount: Low → High</option>
                <option value="itemsHighLow">Items: High → Low</option>
                <option value="itemsLowHigh">Items: Low → High</option>
              </select>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                size={16}
              />
            </div>
            <div className="relative">
              <Filter
                className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-700 bg-gray-900/60 py-2.5 pr-10 pl-10 text-sm text-white focus:border-emerald-500 outline-none sm:w-48"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                size={16}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Table Section --- */}
      <div className="rounded-3xl border border-gray-800 bg-gray-900/40 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/30 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4">Order Details</th>
                <th className="px-6 py-4 text-center">Customer</th>
                <th className="px-6 py-4 text-center">Total</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {isOrdersLoading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-20 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                      Loading orders...
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-20 text-center text-gray-400"
                  >
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="group transition hover:bg-gray-800/30">
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs text-gray-500">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                          <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-300">
                            <Calendar size={14} className="text-gray-500" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-emerald-400">
                            <User size={18} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">
                              {order.user?.fullName || "Guest User"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {order.user?.email || "No email"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-lg font-bold text-emerald-400">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                        <div className="text-[10px] text-gray-500">
                          {order.items.length} items
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold capitalize ${getStatusColor(order.status)}`}
                        >
                          {getStatusIcon(order.status)} {order.status}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div
                          className={`inline-flex items-center gap-1.5 text-xs font-medium ${order.paymentStatus === "paid" ? "text-emerald-400" : "text-amber-400"}`}
                        >
                          <CreditCard size={14} />{" "}
                          {order.paymentStatus.toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              setExpandedOrder(
                                expandedOrder === order._id ? null : order._id,
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50 text-gray-400 transition hover:border-emerald-500/50 hover:text-emerald-400"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Detail View */}
                    {expandedOrder === order._id && (
                      <tr className="bg-gray-800/20">
                        <td
                          colSpan="6"
                          className="px-8 py-6 border-b border-gray-800"
                        >
                          <div className="grid gap-8 lg:grid-cols-2">
                            <div className="space-y-4">
                              <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400">
                                <Package size={14} /> Order Items
                              </h4>
                              <div className="space-y-3 rounded-2xl border border-gray-700/50 bg-gray-950/30 p-4">
                                {order.items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between gap-4 py-2 border-b border-gray-800 last:border-0"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-800">
                                        {item.image ? (
                                          <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                          />
                                        ) : (
                                          <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-600">
                                            IMG
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-white">
                                          {item.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          Qty: {item.quantity} × $
                                          {item.price.toFixed(2)}
                                        </p>
                                      </div>
                                    </div>
                                    <p className="text-sm font-bold text-gray-300">
                                      ${(item.quantity * item.price).toFixed(2)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-6">
                              <div className="space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                                  Update Status
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {[
                                    "pending",
                                    "processing",
                                    "shipped",
                                    "delivered",
                                    "cancelled",
                                  ].map((status) => (
                                    <button
                                      key={status}
                                      disabled={
                                        isUpdatingOrder ||
                                        order.status === status
                                      }
                                      onClick={() =>
                                        handleStatusChange(order._id, status)
                                      }
                                      className={`rounded-xl px-4 py-2 text-xs font-bold transition disabled:opacity-50 ${
                                        order.status === status
                                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                          : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-emerald-500/50 hover:text-emerald-400"
                                      }`}
                                    >
                                      {status.toUpperCase()}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                                  Shipping Information
                                </h4>
                                <div className="rounded-2xl border border-gray-700/50 bg-gray-950/30 p-4">
                                  {order.shippingAddress ? (
                                    <div className="text-sm text-gray-300 space-y-1">
                                      <p className="font-semibold text-white">
                                        {order.shippingAddress.name ||
                                          order.user?.fullName}
                                      </p>
                                      <p>{order.shippingAddress.line1}</p>
                                      {order.shippingAddress.line2 && (
                                        <p>{order.shippingAddress.line2}</p>
                                      )}
                                      <p>
                                        {order.shippingAddress.city},{" "}
                                        {order.shippingAddress.state}{" "}
                                        {order.shippingAddress.postal_code}
                                      </p>
                                      <p>{order.shippingAddress.country}</p>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-500 italic">
                                      No shipping address provided
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
