import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SEOBrief - AI Content Brief Generator",
  description: "Generate comprehensive SEO content briefs from any keyword. Get outlines, questions, related terms, and competitor analysis.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white antialiased">{children}</body>
    </html>
  );
}
