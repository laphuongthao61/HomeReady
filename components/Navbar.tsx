"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary-600 tracking-tight">
              HomeReady
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/listings"
              className="text-slate-600 hover:text-primary-600 font-medium transition text-sm"
            >
              Listings
            </Link>
            <Link
              href="/planner"
              className="text-slate-600 hover:text-primary-600 font-medium transition text-sm"
            >
              Planner
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
