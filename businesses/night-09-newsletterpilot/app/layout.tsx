import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NewsletterPilot - Newsletter Content Assistant",
  description:
    "Input your niche and topics, get a ready-to-send newsletter. Powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-950 font-sans">
        {children}
      </body>
    </html>
  );
}
