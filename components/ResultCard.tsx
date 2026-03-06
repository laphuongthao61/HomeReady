"use client";

interface ResultCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: "default" | "success" | "warning";
}

export default function ResultCard({ title, value, subtitle, variant = "default" }: ResultCardProps) {
  const bgMap = {
    default: "bg-slate-50 border-slate-200",
    success: "bg-emerald-50 border-emerald-200",
    warning: "bg-amber-50 border-amber-200",
  };

  const textMap = {
    default: "text-slate-900",
    success: "text-emerald-700",
    warning: "text-amber-700",
  };

  return (
    <div className={`rounded-xl border p-4 ${bgMap[variant]}`}>
      <p className="text-sm font-medium text-slate-600">{title}</p>
      <p className={`text-xl font-bold mt-1 ${textMap[variant]}`}>{value}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
}
