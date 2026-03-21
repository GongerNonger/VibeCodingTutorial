import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FocusFlow - ADHD-Friendly Task Manager",
  description:
    "Brain dump your tasks, get one thing at a time. An AI-powered task manager designed for ADHD brains that reduces overwhelm and builds momentum.",
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
