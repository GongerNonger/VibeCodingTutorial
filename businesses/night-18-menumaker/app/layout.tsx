import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MenuMaker - Restaurant Menu Builder",
  description: "Create beautiful digital menus with QR codes for your restaurant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen">{children}</body>
    </html>
  );
}
