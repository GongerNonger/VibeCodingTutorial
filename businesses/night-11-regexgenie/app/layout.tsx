import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RegexGenie - Natural Language to Regex",
  description: "Describe what you want to match in plain English, get tested regex patterns.",
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
