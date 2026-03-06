import Link from "next/link";
import HeroSearch from "@/components/HeroSearch";
import ListingCard from "@/components/ListingCard";
import { listings } from "@/lib/data";

export default function HomePage() {
  const featuredListings = listings.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059ee617?w=1920"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Find your perfect home
            </h1>
            <p className="mt-4 text-lg text-slate-300">
              Browse properties across Vietnam. Plan your purchase with our
              HomeReady Planner.
            </p>
          </div>
          <div className="mt-10">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Featured properties
          </h2>
          <Link
            href="/listings"
            className="text-primary-600 font-semibold hover:text-primary-700 transition"
          >
            View all →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 bg-primary-600 rounded-2xl p-8 sm:p-12 text-white">
            <div>
              <h2 className="text-2xl font-bold">Ready to buy?</h2>
              <p className="mt-2 text-primary-100">
                Use our HomeReady Planner to calculate your down payment, savings
                plan, and mortgage.
              </p>
            </div>
            <Link
              href="/planner"
              className="shrink-0 px-8 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition shadow-lg"
            >
              Start Planner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
