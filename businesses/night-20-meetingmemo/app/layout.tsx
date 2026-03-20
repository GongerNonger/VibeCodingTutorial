import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MeetingMemo - Meeting Notes Summarizer",
  description:
    "Paste meeting transcripts and get structured summaries with action items, decisions, key topics, and follow-ups.",
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
