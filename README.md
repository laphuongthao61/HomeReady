# HomeReady

A modern real estate web application built with Next.js 14 (App Router), TypeScript, and Tailwind CSS.

## Features

- **Landing Page** – Hero search bar, featured listings, CTA
- **Listings** – Map + list layout with filters (city, property type)
- **Listing Detail** – Full property view
- **HomeReady Planner** – Multi-step wizard:
  - Step 1.1: Down payment check
  - Step 1.2: Savings plan (Scenario B)
  - Step 1.3: Fund recommendation quiz (Scenario B)
  - Step 2: Mortgage calculation

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Project Structure

```
HomeReady/
├── app/
│   ├── layout.tsx
│   ├── page.tsx          # Landing
│   ├── listings/
│   │   ├── page.tsx      # Map + list
│   │   └── [id]/page.tsx # Detail
│   └── planner/page.tsx  # Wizard
├── components/
│   ├── Navbar
│   ├── HeroSearch
│   ├── ListingCard
│   ├── MapPlaceholder
│   ├── Stepper
│   ├── ResultCard
│   └── FormField
├── lib/
│   ├── finance.ts        # All planner formulas
│   ├── types.ts
│   └── data.ts           # Mock listings
└── ...
```
