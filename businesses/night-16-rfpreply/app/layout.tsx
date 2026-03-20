import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RFPReply - AI RFP & Grant Response Writer",
  description: "Generate tailored RFP and grant application responses powered by AI",
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
