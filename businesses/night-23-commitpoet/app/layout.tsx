import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CommitPoet - Creative Git Commit Messages",
  description:
    "Paste a git diff and get creative, funny, or professional commit messages in different personas. Free tool for developers who want more personality in their git history.",
  keywords: ["git", "commit messages", "developer tools", "code humor"],
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
