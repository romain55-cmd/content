import React from "react";
import { motion } from "framer-motion";
import { Rocket, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Logo({ className = "", size = "default", showText = true }) {
  const sizes = {
    small: { icon: "w-8 h-8", iconInner: "w-4 h-4", text: "text-lg" },
    default: { icon: "w-10 h-10", iconInner: "w-6 h-6", text: "text-xl" },
    large: { icon: "w-14 h-14", iconInner: "w-8 h-8", text: "text-3xl" }
  };

  const currentSize = sizes[size] || sizes.default;

  return (
    <Link to="/" className={`flex items-center gap-3 group ${className}`}>
      {/* Animated icon container */}
      <motion.div
        className={`${currentSize.icon} relative rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25 overflow-hidden`}
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-0"
          animate={{
            opacity: [0, 1, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Main icon */}
        <motion.div
          className="relative z-10"
          animate={{
            y: [0, -3, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Rocket className={`${currentSize.iconInner} text-white`} />
        </motion.div>

        {/* Sparkle effect */}
        <motion.div
          className="absolute top-1 right-1"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          <Sparkles className="w-3 h-3 text-yellow-300" fill="currentColor" />
        </motion.div>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-white"
          animate={{
            opacity: [0, 0.2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Brand text */}
      {showText && (
        <div className="flex flex-col">
          <motion.span
            className={`${currentSize.text} font-black tracking-tight leading-none bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent`}
            style={{
              backgroundSize: "200% auto",
            }}
            animate={{
              backgroundPosition: ["0% center", "200% center"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            ИМПУЛЬС
          </motion.span>
          <motion.span
            className={`text-[0.6em] font-medium tracking-wider text-muted-foreground group-hover:text-purple-600 transition-colors`}
            initial={{ opacity: 0.7 }}
            whileHover={{ opacity: 1 }}
          >
            AI
          </motion.span>
        </div>
      )}
    </Link>
  );
}
