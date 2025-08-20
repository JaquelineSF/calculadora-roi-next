"use client";
import React from "react";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-400/30 placeholder:text-slate-500 focus:ring ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
