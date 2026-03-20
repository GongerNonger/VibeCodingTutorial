import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MigrateBot - Database Migration Generator",
  description:
    "Describe schema changes in English, get migration files for your ORM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-950 text-gray-100">
        {children}
      </body>
    </html>
  );
}
