import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ThumbnailCopy - YouTube Thumbnail Text Optimizer",
  description: "Get optimized thumbnail text suggestions with visual preview for your YouTube videos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white min-h-screen">{children}</body>
    </html>
  );
}
