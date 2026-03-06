import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AppStateProvider } from "@/lib/app-state";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HomeReady - Find Your Perfect Home",
  description: "Modern real estate platform for Vietnam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AppStateProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </AppStateProvider>
      </body>
    </html>
  );
}
