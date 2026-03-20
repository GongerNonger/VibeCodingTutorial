# LeaseEye - Apartment Lease Analyzer

**Night 24 of 25** - Overnight Business Factory

## What It Does

Users paste their apartment lease text and get a plain-English analysis including key terms, red flags, important clauses, and an overall risk score. No legal jargon, just clear explanations.

## Revenue Model

- $9 per individual analysis
- $19/month unlimited analyses

## Features

- **Rent & Deposit Extraction** - Automatically finds monthly rent, security deposit, lease duration
- **Red Flag Detection** - Identifies excessive penalties, waived rights, unreasonable entry, auto-renewal traps, liability waivers, non-refundable fees
- **Risk Score (0-100)** - Color-coded meter based on number and severity of red flags
- **Plain-English Translations** - Every clause translated from legal speak to everyday language
- **Clause Categorization** - Organized by financial, maintenance, rules, and termination
- **Maintenance Breakdown** - Side-by-side landlord vs tenant responsibilities
- **Pet Policy Detection** - Identifies pet rules and required deposits
- **Analysis History** - Review past analyses anytime

## Tech Stack

- Next.js 14 + TypeScript
- Tailwind CSS (dark theme with cyan-500 accents)
- Local algorithmic analysis (no external APIs)
- In-memory data store

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Testing

```bash
npx tsx test.ts
```

## Deployment

```bash
npm run build
npm start
```

Deploy to Vercel, Railway, or any Node.js host.
