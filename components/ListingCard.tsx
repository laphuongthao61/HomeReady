"use client";

import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/types";

interface ListingCardProps {
  listing: Listing;
}

function formatPrice(price: number): string {
  const billions = price / 1e9;
  if (billions >= 1) return `${billions.toFixed(1)}B VND`;
  return `${(price / 1e6).toFixed(0)}M VND`;
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={listing.image}
          alt={listing.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 rounded-lg text-xs font-medium text-slate-700">
          {listing.propertyType}
        </div>
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-primary-600 text-white rounded-lg text-xs font-semibold">
          {formatPrice(listing.priceVnd)}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition line-clamp-2">
          {listing.title}
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          {listing.district}, {listing.city}
        </p>
        <div className="flex gap-4 mt-3 text-sm text-slate-600">
          <span>{listing.beds} beds</span>
          <span>{listing.baths} baths</span>
          <span>{listing.areaM2} m²</span>
        </div>
      </div>
    </Link>
  );
}
