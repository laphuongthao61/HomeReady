"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSearch() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [type, setType] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (type) params.set("type", type);
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-4 sm:p-6 flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto"
    >
      <div className="flex-1">
        <label className="block text-xs font-medium text-slate-500 mb-1">
          Location
        </label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        >
          <option value="">All cities</option>
          <option value="Hanoi">Hanoi</option>
          <option value="HCM">Ho Chi Minh City</option>
          <option value="DaNang">Da Nang</option>
        </select>
      </div>
      <div className="flex-1">
        <label className="block text-xs font-medium text-slate-500 mb-1">
          Property type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        >
          <option value="">All types</option>
          <option value="Apartment">Apartment</option>
          <option value="Ground House">Ground House</option>
        </select>
      </div>
      <div className="flex items-end">
        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition shadow-lg shadow-primary-500/25"
        >
          Search
        </button>
      </div>
    </form>
  );
}
