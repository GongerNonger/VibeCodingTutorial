import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeaseEye - Apartment Lease Analyzer",
  description: "Paste your lease and get a plain-English summary of key terms, red flags, and important clauses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen">{children}</body>
    </html>
  );
}
