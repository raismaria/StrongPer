import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router";
import api from "../utils/api";

interface Order {
  _id: string;
  orderNumber?: string;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{
    productId: {
      _id: string;
      name: string;
      price: number;
      images: string[];
    };
    name: string;
    quantity: number;
    price: number;
    image: string;
    _id: string;
  }>;
}

const ProfilePage = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get("/orders/my");
        setOrders(response.data.data?.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load order history");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Please Log In
          </h1>
          <p className="text-gray-600 mb-8">
            You must be logged in to view your profile.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-lg mb-2">Welcome back!</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {user.name}
              </h1>
              <p className="text-blue-100 text-lg">Email: {user.email}</p>
              {user.isAdmin && (
                <div className="mt-4 inline-block bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg font-semibold">
                  Admin Account
                </div>
              )}
            </div>
            <div className="text-7xl"></div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Account Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Full Name:
              </label>
              <p className="text-lg text-gray-900 font-medium">{user.name}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Email Address:
              </label>
              <p className="text-lg text-gray-900 font-medium">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Account Type:
              </label>
              <p className="text-lg text-gray-900 font-medium">
                {user.isAdmin ? "Admin" : "Customer"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {user.isAdmin && (
              <button
                onClick={() => navigate("/admin")}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg transition shadow-md"
              >
                Go to Admin Dashboard
              </button>
            )}
            <button
              onClick={() => navigate("/our-products")}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition shadow-md"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition shadow-md"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Order History Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Order History
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin">⏳</div>
              <p className="ml-3 text-gray-600">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                You haven't placed any orders yet.
              </p>
              <button
                onClick={() => navigate("/our-products")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-bold text-gray-700">
                      Order #
                    </th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">
                      Items
                    </th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">
                      Amount
                    </th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="py-4 px-4">
                        <span className="font-semibold text-blue-600">
                          #
                          {order.orderNumber ||
                            order._id.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-700">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-700">
                          {order.items.length} item(s)
                          <div className="text-sm text-gray-500 mt-1">
                            {order.items.map((item) => (
                              <div key={item._id}>
                                {item.name} (x{item.quantity})
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-gray-900">
                          ${order.total.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-4 py-2 rounded-full font-semibold text-sm ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
