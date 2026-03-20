import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CronSpeak - Natural Language Cron Builder",
  description: "Describe a schedule in English, get a cron expression with visual timeline",
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
