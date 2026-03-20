import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EnvGuard - .env File Security Scanner",
  description:
    "Scan your .env and config files for leaked secrets, weak values, and security issues.",
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
