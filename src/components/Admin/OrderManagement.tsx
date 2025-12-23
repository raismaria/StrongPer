import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import api from "../../utils/api";

interface OrderItem {
  productId: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  name: string;
  price: number;
  quantity: number;
  image: string;
  _id: string;
}

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  email: string;
  phone: string;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/orders");
      setOrders(response.data.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await api.delete(`/admin/orders/${orderId}`);
        fetchOrders();
        if (selectedOrder?._id === orderId) {
          setShowDetails(false);
          setSelectedOrder(null);
        }
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete order");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "processing":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "shipped":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "delivered":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status.toLowerCase() === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold text-white">Order Management</h2>
          <p className="text-slate-400 mt-1">
            Manage and track customer orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm">
            Total: {filteredOrders.length} orders
          </span>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 backdrop-blur-sm"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by order ID, email, or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden backdrop-blur-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-300">
            <thead className="bg-slate-900/50 border-b border-slate-700">
              <tr>
                <th className="text-left py-4 px-4 font-semibold text-white">
                  Order ID
                </th>
                <th className="text-left py-4 px-4 font-semibold text-white">
                  Customer
                </th>
                <th className="text-left py-4 px-4 font-semibold text-white">
                  Date
                </th>
                <th className="text-left py-4 px-4 font-semibold text-white">
                  Items
                </th>
                <th className="text-left py-4 px-4 font-semibold text-white">
                  Total
                </th>
                <th className="text-left py-4 px-4 font-semibold text-white">
                  Status
                </th>
                <th className="text-left py-4 px-4 font-semibold text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-700/20 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <span className="font-mono text-blue-400">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-white">
                          {order.user?.name || order.shippingAddress.firstName + " " + order.shippingAddress.lastName}
                        </p>
                        <p className="text-xs text-slate-400">{order.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-4">{order.items.length} item(s)</td>
                    <td className="py-4 px-4 font-semibold text-white">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          order.status
                        )} bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetails(true);
                          }}
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors text-xs font-medium"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors text-xs font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showDetails && selectedOrder && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetails(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-10 lg:inset-20 z-50 overflow-auto"
            >
              <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-w-4xl mx-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      Order Details
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                      Order ID: #{selectedOrder._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Customer Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white">
                        Customer Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p className="text-slate-300">
                          <span className="text-slate-500">Name:</span>{" "}
                          {selectedOrder.user?.name || selectedOrder.shippingAddress.firstName + " " + selectedOrder.shippingAddress.lastName}
                        </p>
                        <p className="text-slate-300">
                          <span className="text-slate-500">Email:</span>{" "}
                          {selectedOrder.email}
                        </p>
                        <p className="text-slate-300">
                          <span className="text-slate-500">Phone:</span>{" "}
                          {selectedOrder.phone}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white">
                        Shipping Address
                      </h4>
                      <div className="text-sm text-slate-300">
                        <p>
                          {selectedOrder.shippingAddress.firstName}{" "}
                          {selectedOrder.shippingAddress.lastName}
                        </p>
                        <p>{selectedOrder.shippingAddress.address}</p>
                        <p>
                          {selectedOrder.shippingAddress.city},{" "}
                          {selectedOrder.shippingAddress.state}{" "}
                          {selectedOrder.shippingAddress.zipCode}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">
                      Order Items
                    </h4>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700"
                        >
                          <img
                            src={item.image || "/placeholder.jpg"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-white font-medium">
                              {item.name}
                            </p>
                            <p className="text-sm text-slate-400">
                              Quantity: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <p className="text-white font-semibold">
                            ${(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">
                      Order Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-slate-300">
                        <span>Subtotal:</span>
                        <span>${selectedOrder.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Tax:</span>
                        <span>${selectedOrder.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-slate-700">
                        <span>Total:</span>
                        <span>${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-white">
                      Payment Method
                    </h4>
                    <p className="text-slate-300 text-sm">
                      {selectedOrder.paymentMethod === "CASH_ON_DELIVERY"
                        ? "Cash on Delivery"
                        : selectedOrder.paymentMethod}
                    </p>
                  </div>

                  {/* Order Status & Date */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-white">
                        Order Status
                      </h4>
                      <span
                        className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {selectedOrder.status.charAt(0).toUpperCase() +
                          selectedOrder.status.slice(1)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-white">
                        Order Date
                      </h4>
                      <p className="text-slate-300 text-sm">
                        {new Date(selectedOrder.createdAt).toLocaleString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedOrder.notes && (
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-white">
                        Notes
                      </h4>
                      <p className="text-slate-300 text-sm">
                        {selectedOrder.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700">
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors font-medium"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(selectedOrder._id)}
                    className="px-6 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors font-medium"
                  >
                    Delete Order
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderManagement;
