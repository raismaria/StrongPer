import { motion } from "framer-motion";
import { useState } from "react";

type TabType = "overview" | "products" | "categories" | "orders" | "users";

interface DashboardSidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const DashboardSidebar = ({
  activeTab,
  setActiveTab,
}: DashboardSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "products", label: "Products", icon: "📦" },
    { id: "categories", label: "Categories", icon: "🏷️" },
    { id: "orders", label: "Orders", icon: "🛒" },
    { id: "users", label: "Users", icon: "👥" },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 p-2 rounded-lg text-white text-xl"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className={`w-64 bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700 p-6 space-y-6 overflow-y-auto ${
          isOpen ? "fixed left-0 top-0 h-full z-40" : "hidden md:flex flex-col"
        }`}
      >
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center text-xl"></div>
          <div>
            <h1 className="text-white font-bold text-lg">Admin</h1>
            <p className="text-xs text-slate-400">Dashboard</p>
          </div>
        </motion.div>

        <div className="h-px bg-slate-700" />

        {/* Menu Items */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                onClick={() => {
                  setActiveTab(item.id as TabType);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        <div className="h-px bg-slate-700 mt-auto" />

        {/* Logout Button */}
        <motion.button
          whileHover={{ x: 4 }}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
        >
          <span className="text-xl"></span>
          <span className="font-medium">Logout</span>
        </motion.button>
      </motion.div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default DashboardSidebar;
