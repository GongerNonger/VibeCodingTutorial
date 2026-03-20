import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireWrite - Job Description Generator",
  description: "Generate inclusive, optimized job postings with bias detection",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gray-950 text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
