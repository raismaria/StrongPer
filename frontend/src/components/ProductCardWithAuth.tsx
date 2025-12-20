// src/components/ProductCardWithAuth.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../hooks/useCart";
import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";
import {
  FaBasketShopping,
  FaHeart,
  FaCheck,
  FaExclamation,
} from "react-icons/fa6";

// Définition de l'interface produit avec slug
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: { _id: string; name: string } | string;
  images: string[];
  stock: number;
  slug?: string; // ajout du slug
}

interface ProductCardWithAuthProps {
  product: Product;
  onProductClick?: (product: Product) => void;
}

export const ProductCardWithAuth = ({
  product,
  onProductClick,
}: ProductCardWithAuthProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useUser();
  const [isAdded, setIsAdded] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState<"success" | "warning">(
    "success"
  );
  const [isFavorited, setIsFavorited] = useState(false);

  // Génération automatique du slug si inexistant
  useEffect(() => {
    if (!product.slug) {
      product.slug = product.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
    }
  }, [product]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      setMessageType("warning");
      setShowMessage(true);
      setTimeout(() => {
        navigate("/login", {
          state: {
            message:
              "Vous devez vous connecter pour ajouter un produit au panier.",
          },
        });
      }, 1500);
      return;
    }

    addToCart({
      index: Math.random(),
      name: product.name,
      price: product.price,
      image: product.images[0] || "/placeholder.jpg",
    });

    setMessageType("success");
    setIsAdded(true);
    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
      setIsAdded(false);
    }, 2000);
  };

  const handleProductClick = () => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      // Navigation vers la page détail avec slug
      navigate(`/product/${product._id}`);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/placeholder.jpg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={handleProductClick}
      className="cursor-pointer h-full"
    >
      <motion.div
        whileHover={{ y: -8, transition: { duration: 0.3 } }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 overflow-hidden h-full flex flex-col border border-white/10 hover:border-white/20 group"
      >
        {/* Image Container */}
        <div className="relative overflow-hidden h-56 bg-gradient-to-br from-slate-800 to-slate-900">
          <motion.img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.jpg";
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Stock Badge */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute top-3 right-3 bg-white/10 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1.5 text-sm font-bold border border-white/20"
          >
            {product.stock > 0 ? (
              <>
                <FaCheck className="text-green-400 w-4 h-4" />
                <span className="text-green-400">In Stock</span>
              </>
            ) : (
              <>
                <FaExclamation className="text-red-400 w-4 h-4" />
                <span className="text-red-400">Out of Stock</span>
              </>
            )}
          </motion.div>
          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFavorite}
            className={`absolute top-3 left-3 p-2.5 rounded-full backdrop-blur-md transition-all border ${
              isFavorited
                ? "bg-red-500/30 text-red-400 border-red-400/50"
                : "bg-white/10 text-slate-400 hover:text-red-400 border-white/20 hover:border-red-400/50"
            }`}
          >
            <FaHeart size={18} className="w-5 h-5" />
          </motion.button>
          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="absolute bottom-3 left-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3 py-1.5 rounded-full text-xs font-bold"
          >
            {typeof product.category === "object" && product.category !== null
              ? product.category.name
              : typeof product.category === "string"
              ? product.category
              : "Uncategorized"}
          </motion.div>
        </div>

        {/* Content Container */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-lg text-white line-clamp-2 mb-2 group-hover:text-cyan-400 transition-colors">
              {product.name}
            </h3>
            <p className="text-slate-400 text-sm line-clamp-2 group-hover:text-slate-300 transition-colors">
              {product.description}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              ${product.price.toFixed(2)}
            </p>
            {product.stock > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {product.stock} units available
                </span>
                <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/10">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-400 to-cyan-400"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min((product.stock / 30) * 100, 100)}%`,
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}
          </div>
          {/* Add to Cart Button */}
          <motion.button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            whileHover={product.stock > 0 ? { scale: 1.02 } : {}}
            whileTap={product.stock > 0 ? { scale: 0.98 } : {}}
            className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
              isAdded
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : product.stock > 0
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-cyan-500/20"
                : "bg-slate-700/50 text-slate-500 cursor-not-allowed border border-slate-600/50"
            }`}
          >
            {isAdded ? (
              <>
                <FaCheck size={18} className="w-5 h-5" />
                Added!
              </>
            ) : (
              <>
                <FaBasketShopping size={18} className="w-5 h-5" />
                Add to Cart
              </>
            )}
          </motion.button>

          {/* View Details */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              handleProductClick();
            }}
            className="w-full mt-2 py-2 px-4 rounded-lg font-semibold text-cyan-400 border border-cyan-400/30 hover:border-cyan-400/60 hover:bg-cyan-400/10 transition-all"
          >
            View Details
          </motion.button>
        </div>

        {/* Message Alert */}
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`px-4 py-2 text-sm text-center border-t ${
              messageType === "success"
                ? "bg-green-500/20 text-green-400 border-green-500/30"
                : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
            }`}
          >
            {messageType === "success"
              ? "✓ Added to cart!"
              : "⚠ Please log in first"}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProductCardWithAuth;
