import React from 'react';
import { cn } from "@/lib/utils";

export default function GlassCard({ children, className, hover = true, ...props }) {
  return (
    <div
      className={cn(
        "bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg",
        hover && "hover:shadow-2xl hover:bg-white/80 transition-all duration-500",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}