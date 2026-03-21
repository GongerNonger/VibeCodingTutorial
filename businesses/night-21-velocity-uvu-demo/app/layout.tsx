import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Velocity x UVU - AI Academic & Career Advising",
  description:
    "AI-powered academic advising for Utah Valley University. Personalized degree guidance, course recommendations, and career pathway analysis for UVU Wolverines.",
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
