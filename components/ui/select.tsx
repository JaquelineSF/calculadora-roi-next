"use client";
import React from "react";

type SelectProps = {
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode; // <SelectItem />
  className?: string;
};

export function Select({ value, onValueChange, children, className = "" }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={`w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm outline-none ring-emerald-400/30 focus:ring ${className}`}
    >
      {children}
    </select>
  );
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children}</option>;
}
