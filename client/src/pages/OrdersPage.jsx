import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { axiosInstance } from "../lib/axios";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/orders/my-orders");
        setOrders(res.data.orders);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

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
        return <CheckCircle size={16} />;
      case "shipped":
        return <Truck size={16} />;
      case "processing":
        return <Clock size={16} />;
      case "cancelled":
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        <div className="px-6 py-20 text-center text-gray-400">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            Loading your orders...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white">
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-10 text-4xl font-bold flex items-center gap-4">
          <Package className="text-emerald-400" size={36} />
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="rounded-4xl border border-dashed border-gray-700 bg-gray-900/40 p-16 text-center">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              No orders found
            </h2>
            <p className="mb-8 text-gray-400">
              You haven't placed any orders yet.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 font-bold text-white transition hover:bg-emerald-500"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="overflow-hidden rounded-3xl border border-gray-800 bg-gray-900/70 transition hover:border-gray-700"
              >
                <div
                  className="p-6 cursor-pointer flex flex-wrap items-center justify-between gap-4"
                  onClick={() =>
                    setExpandedOrder(
                      expandedOrder === order._id ? null : order._id,
                    )
                  }
                >
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-800 text-emerald-400">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="font-semibold text-white">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm text-gray-400">Total Amount</p>
                      <p className="text-lg font-bold text-emerald-400">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>

                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>

                    {expandedOrder === order._id ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </div>
                </div>

                {expandedOrder === order._id && (
                  <div className="border-t border-gray-800 bg-gray-900/40 p-6 space-y-6">
                    <div className="grid gap-4">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 overflow-hidden rounded-xl bg-gray-800">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-gray-700" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-white">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-400">
                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <p className="font-bold text-white">
                            ${(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
                      <div className="text-sm">
                        <p className="text-gray-400">
                          Payment Status:{" "}
                          <span
                            className={`font-semibold capitalize ${order.paymentStatus === "paid" ? "text-emerald-400" : "text-amber-400"}`}
                          >
                            {order.paymentStatus}
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">
                          Subtotal: ${order.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-xl font-bold text-emerald-400">
                          Total: ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
