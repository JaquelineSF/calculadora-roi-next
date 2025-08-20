"use client";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "ghost";
};

export function Button({ className = "", variant = "solid", ...props }: Props) {
  const base = "inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold transition";
  const solid = "bg-emerald-400 text-slate-900 hover:bg-emerald-300";
  const ghost = "border border-white/10 bg-transparent text-slate-100 hover:bg-slate-900";
  return <button className={`${base} ${variant === "solid" ? solid : ghost} ${className}`} {...props} />;
}
