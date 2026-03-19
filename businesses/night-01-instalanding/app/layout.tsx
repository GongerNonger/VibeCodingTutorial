import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InstaLanding - AI Landing Page Generator",
  description:
    "Paste your product description, get a conversion-optimized landing page in seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white antialiased">{children}</body>
    </html>
  );
}
