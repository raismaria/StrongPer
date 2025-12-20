import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../utils/api";
import { MOCK_PRODUCTS } from "../data/mockProducts";
import ProductCardWithAuth from "../components/ProductCardWithAuth";
import {
  FaMagnifyingGlass,
  FaFilter,
  FaArrowUpLong,
  FaXmark,
  FaBox,
  FaTag,
  FaTruck,
  FaChevronDown,
  FaWater,
  FaSolarPanel,
  FaIndustry,
} from "react-icons/fa6";
import { HiEllipsisVertical } from "react-icons/hi2";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string | { _id: string; name: string };
  images: string[];
  stock: number;
}

const CATEGORIES = [
  {
    name: "All Categories",
    icon: FaBox,
  },
  {
    name: "Peripheral",
    icon: FaTag,
  },
  {
    name: "Self-priming",
    icon: FaWater,
  },
  {
    name: "Centrifugal pumps",
    icon: FaIndustry,
  },
  {
    name: "Swimming pool",
    icon: FaWater,
  },
  {
    name: "Multi-usage",
    icon: FaBox,
  },
  {
    name: "DC dot booster pump",
    icon: FaTruck,
  },
  {
    name: "Inverter automatic pump",
    icon: FaIndustry,
  },
  {
    name: "Automatic submersible pump",
    icon: FaWater,
  },
  {
    name: "Submersible sewage pump",
    icon: FaTruck,
  },
  {
    name: "Solar pump",
    icon: FaSolarPanel,
  },
];

export const OurProducts = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "newest">(
    "newest"
  );
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const params: Record<string, string> = { limit: "100" };
        if (selectedCategory !== "All Categories") {
          params.category = selectedCategory;
        }
        const response = await api.get("/products", { params });
        if (
          response.data &&
          response.data.data &&
          response.data.data.products
        ) {
          setAllProducts(response.data.data.products);
        } else if (response.data && Array.isArray(response.data)) {
          setAllProducts(response.data);
        } else {
          setAllProducts(MOCK_PRODUCTS);
        }
      } catch {
        setAllProducts(MOCK_PRODUCTS);
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, [selectedCategory]);

  useEffect(() => {
    let filtered = [...allProducts];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(query);
        const descMatch = p.description.toLowerCase().includes(query);

        const categoryName =
          typeof p.category === "string"
            ? p.category
            : p.category?.name || "";

        const catMatch = categoryName.toLowerCase().includes(query);

        return nameMatch || descMatch || catMatch;
      });

    }
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    setFilteredProducts(filtered);
  }, [allProducts, searchQuery, sortBy]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white py-12 px-4 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-linear-to-br from-white via-blue-50 to-white pointer-events-none" />
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <FaBox className="w-12 h-12 text-blue-600 mx-auto" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black text-navy mb-3 leading-tight">
            Our Premium <br />
            <span className="text-blue-600">Pump Collection</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto font-medium mb-8">
            Discover our comprehensive range of high-performance pumps for every
            application.
          </p>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto"
          >
            {[
              {
                icon: FaBox,
                label: "Products",
                count: filteredProducts.length,
              },
              {
                icon: FaTag,
                label: "Categories",
                count: CATEGORIES.length - 1,
              },
              { icon: FaTruck, label: "Fast Shipping", count: "2-3 Days" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, y: -4 }}
                className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white border-2 border-blue-200 hover:border-blue-400 transition-all shadow-md"
              >
                <stat.icon className="w-6 h-6 text-blue-600" />
                <span className="text-navy font-bold text-sm">
                  {stat.count}
                </span>
                <span className="text-gray-700 text-xs">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Main Content with Sidebar */}
        <div className="flex gap-8">
          {/* Left Sidebar - Categories Filter */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block w-72 shrink-0"
          >
            <div className="sticky top-24 space-y-6">
              {/* Sidebar Header */}
              <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-white border-2 border-blue-200 shadow-md">
                <FaFilter className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-navy">Categories</h2>
              </div>

              {/* Category List */}
              <div className="space-y-2 p-4 rounded-xl bg-white border-2 border-blue-200 shadow-md">
                {CATEGORIES.map((category) => {
                  const CategoryIcon = category.icon;
                  return (
                    <motion.button
                      key={category.name}
                      whileHover={{ x: 8 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                        selectedCategory === category.name
                          ? "bg-linear-to-r from-blue-600 to-blue-400 text-white shadow-lg"
                          : "bg-white text-navy hover:bg-blue-50 border border-transparent hover:border-blue-300"
                      }`}
                    >
                      <CategoryIcon className="w-4 h-4" />
                      <span className="text-sm">{category.name}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Clear Filters Button */}
              {(selectedCategory !== "All Categories" || searchQuery) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedCategory("All Categories");
                    setSearchQuery("");
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white hover:bg-red-50 text-navy hover:text-red-600 transition-all font-semibold border-2 border-red-300 shadow-md"
                >
                  <FaXmark className="w-4 h-4" />
                  Clear Filters
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Right Content - Products and Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex-1"
          >
            {/* Search and Sort Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-8 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Bar */}
                <div className="relative col-span-1 md:col-span-2 group">
                  <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search pumps..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-blue-300 rounded-lg text-navy placeholder-gray-500 focus:outline-none focus:border-blue-600 transition-all shadow-md group-hover:shadow-lg"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <FaXmark className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="w-full px-4 py-3 bg-white border-2 border-blue-300 rounded-lg text-navy font-semibold hover:border-blue-600 transition-all flex items-center justify-between shadow-md hover:shadow-lg"
                  >
                    <div className="flex items-center gap-2">
                      <FaArrowUpLong className="w-4 h-4 text-blue-600" />
                      <span>
                        {sortBy === "newest"
                          ? "Newest"
                          : sortBy === "price-asc"
                          ? "Low to High"
                          : "High to Low"}
                      </span>
                    </div>
                    <FaChevronDown
                      className={`w-4 h-4 transition-transform ${
                        showSortDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showSortDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 w-full bg-white border-2 border-blue-300 rounded-lg overflow-hidden z-20 shadow-lg"
                    >
                      {[
                        { value: "newest", label: "Newest First" },
                        { value: "price-asc", label: "Price: Low to High" },
                        { value: "price-desc", label: "Price: High to Low" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value as typeof sortBy);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-3 transition-all ${
                            sortBy === option.value
                              ? "bg-blue-100 text-blue-600 border-l-4 border-blue-600 font-semibold"
                              : "text-navy hover:bg-blue-50"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Results Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="p-4 rounded-lg bg-white border-2 border-blue-200 shadow-md"
              >
                <p className="text-navy font-semibold">
                  Showing{" "}
                  <span className="text-blue-600 font-bold text-lg">
                    {filteredProducts.length}
                  </span>{" "}
                  of{" "}
                  <span className="text-blue-600 font-bold text-lg">
                    {allProducts.length}
                  </span>{" "}
                  products
                </p>
              </motion.div>
            </motion.div>

            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center py-24"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-16 h-16 border-4 border-blue-300 border-r-blue-600 rounded-full mx-auto mb-4"
                  />
                  <p className="text-navy text-lg font-semibold">
                    Loading premium pumps...
                  </p>
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-6 shadow-md"
              >
                <div className="flex items-start gap-4">
                  <HiEllipsisVertical className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-red-700 mb-1">
                      Error Loading Products
                    </h3>
                    <p className="text-red-600">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Products Grid */}
            {!loading && filteredProducts.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProducts.map((product) => (
                  <motion.div key={product._id} variants={itemVariants}>
                    <ProductCardWithAuth product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Empty State */}
            {!loading && filteredProducts.length === 0 && !error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-24 p-8 rounded-2xl bg-white border-2 border-blue-200 shadow-lg"
              >
                <FaBox className="w-16 h-16 text-blue-300 mx-auto mb-6" />
                <h3 className="text-3xl font-black text-navy mb-2">
                  No Pumps Found
                </h3>
                <p className="text-gray-700 mb-8 text-lg">
                  Try adjusting your search or filter criteria.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedCategory("All Categories");
                    setSearchQuery("");
                  }}
                  className="px-8 py-4 bg-linear-to-r from-blue-600 to-blue-400 text-white rounded-lg hover:shadow-lg hover:shadow-blue-400/30 transition-all font-bold text-lg"
                >
                  Clear All Filters
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default OurProducts;
