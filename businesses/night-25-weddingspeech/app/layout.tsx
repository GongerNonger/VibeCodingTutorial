import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WeddingSpeech - Personalized Wedding Speech Writer",
  description:
    "Create a heartfelt, personalized wedding speech in seconds. Choose your tone, length, and let us craft the perfect words for the big day.",
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
