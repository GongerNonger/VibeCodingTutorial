import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PitchDeck - AI Pitch Deck Outline Generator",
  description:
    "Generate structured pitch deck outlines with talking points for every slide. Perfect for startup founders preparing investor presentations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
