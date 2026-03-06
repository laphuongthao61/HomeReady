"use client";

export default function MapPlaceholder() {
  return (
    <div className="w-full h-full min-h-[400px] bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
      <div className="text-center p-8">
        <svg
          className="w-16 h-16 mx-auto text-slate-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
        <p className="text-slate-500 font-medium">Map view</p>
        <p className="text-slate-400 text-sm mt-1">Location preview</p>
      </div>
    </div>
  );
}
