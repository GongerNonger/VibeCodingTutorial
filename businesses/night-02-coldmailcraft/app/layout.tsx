import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ColdMailCraft - AI Cold Email Writer",
  description:
    "Generate personalized cold email sequences that get replies. Input your product and target — get a ready-to-send email sequence.",
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
