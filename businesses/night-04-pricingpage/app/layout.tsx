import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PricingPage - SaaS Pricing Page Generator",
  description: "Generate beautiful, responsive pricing pages for your SaaS product. Input tiers, features, and pricing — copy or download the result.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white antialiased">{children}</body>
    </html>
  );
}
