import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OnboardKit — AI Employee Onboarding Document Generator",
  description:
    "Generate complete onboarding packets for new employees in minutes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-gray-100 min-h-screen">{children}</body>
    </html>
  );
}
