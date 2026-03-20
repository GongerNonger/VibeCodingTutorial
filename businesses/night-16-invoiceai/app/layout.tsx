import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'InvoiceAI - Smart Invoice Generator',
  description: 'Describe your work in plain English and generate professional invoices instantly. Auto-generated line items, tax calculation, and downloadable format.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
