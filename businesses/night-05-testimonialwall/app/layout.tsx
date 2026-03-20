import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TestimonialWall - Collect & Display Testimonials",
  description: "Create beautiful testimonial walls, collect customer feedback, and embed them anywhere with a simple widget.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white antialiased">{children}</body>
    </html>
  );
}
