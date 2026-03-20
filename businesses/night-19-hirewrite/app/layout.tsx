import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireWrite - Inclusive Job Description Generator",
  description:
    "Generate optimized, bias-free job postings with inclusivity scoring and smart suggestions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
