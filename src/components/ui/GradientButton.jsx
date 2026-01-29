import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function GradientButton({ 
  children, 
  variant = "primary", 
  size = "default",
  className, 
  ...props 
}) {
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25",
    secondary: "bg-white/10 backdrop-blur-sm border border-white/30 text-slate-800 hover:bg-white/20",
    outline: "border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white",
    ghost: "text-slate-600 hover:bg-slate-100",
    dark: "bg-slate-900 text-white hover:bg-slate-800"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "font-semibold rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}