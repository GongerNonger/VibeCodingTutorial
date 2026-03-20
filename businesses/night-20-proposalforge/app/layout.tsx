import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProposalForge — Freelancer Proposal & Quote Generator",
  description:
    "Generate professional proposals with scope, timeline, pricing tables, and terms. Built for freelancers, consultants, and small agencies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0a0a] text-gray-200 antialiased">
        {children}
      </body>
    </html>
  );
}
