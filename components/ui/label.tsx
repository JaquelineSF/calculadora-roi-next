"use client";
import React from "react";

export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className="mb-1 block text-xs text-slate-400" {...props} />;
}
