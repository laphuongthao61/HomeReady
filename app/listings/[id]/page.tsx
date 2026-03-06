"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { listings } from "@/lib/data";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ListingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const listing = listings.find((l) => l.id === id);

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Listing not found</h1>
        <Link href="/listings" className="mt-4 inline-block text-primary-600 hover:underline">
          ← Back to listings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/listings"
        className="inline-flex items-center text-slate-600 hover:text-primary-600 mb-6"
      >
        ← Back to listings
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Image */}
        <div className="lg:col-span-2">
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100">
            <Image
              src={listing.image}
              alt={listing.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
            <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
              {listing.propertyType}
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">
              {listing.title}
            </h1>
            <p className="text-slate-500 mt-1">
              {listing.district}, {listing.city}
            </p>
            <p className="text-2xl font-bold text-primary-600 mt-4">
              {formatPrice(listing.priceVnd)}
            </p>
            <div className="flex gap-6 mt-6 text-slate-600">
              <div>
                <span className="text-sm text-slate-500">Beds</span>
                <p className="font-semibold">{listing.beds}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Baths</span>
                <p className="font-semibold">{listing.baths}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Area</span>
                <p className="font-semibold">{listing.areaM2} m²</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          About this property
        </h2>
        <p className="text-slate-600">
          {listing.title} is a {listing.propertyType.toLowerCase()} located in{" "}
          {listing.district}, {listing.city}. This property features{" "}
          {listing.beds} bedrooms, {listing.baths} bathrooms, and{" "}
          {listing.areaM2} square meters of living space.
        </p>
      </div>
    </div>
  );
}
