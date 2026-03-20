# MenuMaker - Restaurant Menu Builder

**Night 18 of 25** | Overnight Business Factory

## What It Does

Restaurant owners input dishes and prices, get a beautiful digital menu with QR code for table display. Customers scan the QR code at their table to view the menu on their phone.

## Revenue Model

$15/mo per restaurant

## Features

- **Menu Builder** - Add restaurant name, description, categories, and menu items
- **Theme Selector** - Choose from Elegant, Casual, or Modern menu styles
- **Dietary Tags** - Mark items as vegetarian, vegan, gluten-free, or spicy with visual badges
- **Live Preview** - See your menu exactly as customers will, updating in real-time
- **QR Code Generation** - Generate a QR code SVG for table display
- **Print Support** - Print-friendly menu output
- **Multi-Currency** - Support for USD, EUR, and GBP

## Tech Stack

- **Frontend:** Next.js 14 + React + Tailwind CSS
- **Backend:** Next.js API Routes
- **Language:** TypeScript
- **Storage:** In-memory (demo)
- **Theme:** Emerald-500 accent on dark (gray-950) background

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

```bash
npx tsx test.ts
```

## Deployment

1. Deploy to Vercel: `npx vercel`
2. Or build and run: `npm run build && npm start`
3. For production, replace in-memory store with a database (SQLite/Supabase)
