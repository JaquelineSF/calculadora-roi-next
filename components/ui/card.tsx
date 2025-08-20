"use client";
import React from "react";

export function Card({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur ${className}`}
      {...props}
    />
  );
}
