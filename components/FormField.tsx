"use client";

interface FormFieldProps {
  label: string;
  type?: "text" | "number" | "select";
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  required?: boolean;
}

export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  options,
  min,
  max,
  step,
  unit,
  required,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {type === "select" && options ? (
        <select
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative">
          <input
            type={type}
            value={value}
            onChange={(e) =>
              onChange(type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)
            }
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            required={required}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
          />
          {unit && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
              {unit}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
