import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useUser } from "../context/UserContext";
import DashboardSidebar from "../components/Admin/DashboardSidebar.tsx";
import DashboardHeader from "../components/Admin/DashboardHeader.tsx";
import DashboardOverview from "../components/Admin/DashboardOverview.tsx";
import ProductManagement from "../components/Admin/ProductManagement.tsx";
import CategoryManagement from "../components/Admin/CategoryManagement.tsx";
import UserManagement from "../components/Admin/UserManagement.tsx";
import OrderManagement from "../components/Admin/OrderManagement.tsx";

type DashboardTab = "overview" | "products" | "categories" | "orders" | "users";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useUser();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (!isAdmin) {
      navigate("/", { replace: true, state: { message: "Not Authorized" } });
      return;
    }

    setLoading(false);
  }, [user, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    >
      {/* Sidebar */}
      <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader user={user} onLogout={handleLogout} />

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
          <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {activeTab === "overview" && <DashboardOverview />}
            {activeTab === "products" && <ProductManagement />}
            {activeTab === "categories" && <CategoryManagement />}
            {activeTab === "orders" && <OrderManagement />}
            {activeTab === "users" && <UserManagement />}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
