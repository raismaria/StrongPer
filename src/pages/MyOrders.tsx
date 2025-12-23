// src/pages/MyOrders.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaArrowLeft, FaBox, FaClock, FaTruck } from "react-icons/fa6";
import api from "../utils/api";
import { motion } from "framer-motion";

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
  items: OrderItem[];
  total: number;
  status: string;
  email: string;
  phone: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
}

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get("/orders/my");
        setOrders(response.data.data?.orders || []);
      } catch (err: unknown) {
        const error = err as Record<string, unknown>;
        const message = (error?.response as Record<string, unknown>)
          ?.data as Record<string, unknown>;
        setError((message?.message as string) || "Failed to fetch orders");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-cyan-100 text-cyan-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <FaClock className="w-5 h-5" />;
      case "confirmed":
        return <FaBox className="w-5 h-5" />;
      case "shipped":
        return <FaTruck className="w-5 h-5" />;
      case "delivered":
        return <FaTruck className="w-5 h-5" />;
      default:
        return <FaBox className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-linear-to-br from-blue-50 to-cyan-50 py-12 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8 transition-colors"
        >
          <FaArrowLeft /> Back
        </button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600 mb-8">Track and manage your orders</p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <FaBox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Orders Yet
              </h2>
              <p className="text-gray-600 mb-6">
                You haven't placed any orders yet. Start shopping now!
              </p>
              <button
                onClick={() => navigate("/our-products")}
                className="bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-8 rounded-lg transition-all"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Order Header */}
                  <div className="bg-linear-to-r from-blue-600 to-cyan-600 text-white p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm opacity-90">Order ID</p>
                        <p className="font-bold text-lg">
                          {order._id.substring(0, 12)}...
                        </p>
                      </div>
                      <div>
                        <p className="text-sm opacity-90">Order Date</p>
                        <p className="font-bold text-lg">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm opacity-90">Total</p>
                        <p className="font-bold text-lg">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm opacity-90">Status</p>
                        <div className="flex items-center gap-2 font-bold">
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">
                      Items
                    </h3>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg"
                        >
                          <img
                            src={
                              item.productId.images[0] ||
                              "https://via.placeholder.com/80"
                            }
                            alt={item.productId.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {item.productId.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="p-6 bg-gray-50">
                      <h3 className="font-bold text-lg text-gray-900 mb-3">
                        Shipping Address
                      </h3>
                      <div className="text-sm text-gray-700">
                        <p className="font-semibold">
                          {order.shippingAddress.firstName}{" "}
                          {order.shippingAddress.lastName}
                        </p>
                        <p>{order.shippingAddress.address}</p>
                        <p>
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}{" "}
                          {order.shippingAddress.zipCode}
                        </p>
                        <p>{order.phone}</p>
                        <p>{order.email}</p>
                      </div>
                    </div>
                  )}

                  {/* Order Footer */}
                  <div className="p-6 flex items-center justify-between bg-white">
                    <div
                      className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </div>
                    {/*<button
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      View Details →
                    </button>*/}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MyOrders;
