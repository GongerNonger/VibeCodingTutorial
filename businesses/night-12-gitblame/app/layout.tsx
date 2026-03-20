import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitBlame - PR Review Summary Bot",
  description: "Paste a PR diff, get an auto-summary with review focus areas and potential issues.",
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
