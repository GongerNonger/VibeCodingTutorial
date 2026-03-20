# InvoiceAI - Smart Invoice Generator

> **Night 16 of 25** - Overnight Business Factory

## What It Does

Describe your work in plain English, and InvoiceAI generates a professional invoice with auto-generated line items, totals, tax, and a print-ready format. No sign-up required.

## Features

- **Natural Language Input** - Describe work done in plain English, get structured invoices
- **Smart Line Item Parsing** - Automatically detects hourly, fixed-price, and per-unit billing
- **Tax Calculation** - Configurable tax rates with automatic subtotal/tax/total computation
- **Multi-Currency** - Support for USD, EUR, GBP, and CAD
- **Professional Preview** - Clean invoice layout styled like a real invoice
- **Print/Download** - Print-friendly CSS for PDF export via browser print
- **Invoice History** - Browse and view all generated invoices with status badges

## Revenue Model

- **Free:** 3 invoices per month
- **Pro:** $12/month for unlimited invoices, custom branding, and recurring invoices

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- In-memory data store

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Testing

```bash
npx tsx test.ts
```

## Deployment

```bash
npm run build
npm start
```

Deploy to Vercel, Railway, or any Node.js hosting platform.
