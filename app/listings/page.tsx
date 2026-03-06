"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, Suspense } from "react";
import ListingCard from "@/components/ListingCard";
import MapPlaceholder from "@/components/MapPlaceholder";
import { listings } from "@/lib/data";

function ListingsContent() {
  const searchParams = useSearchParams();
  const city = searchParams.get("city");
  const type = searchParams.get("type");

  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      if (city && l.city !== city) return false;
      if (type && l.propertyType !== type) return false;
      return true;
    });
  }, [city, type]);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
      {/* List panel */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">
            {filteredListings.length} properties
          </h1>
          <div className="grid sm:grid-cols-2 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </div>

      {/* Map panel */}
      <div className="lg:w-[45%] lg:min-w-[400px] p-4 lg:p-6 bg-slate-50">
        <MapPlaceholder />
      </div>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading...</div>}>
      <ListingsContent />
    </Suspense>
  );
}
