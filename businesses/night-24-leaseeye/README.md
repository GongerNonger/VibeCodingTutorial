# LeaseEye - Apartment Lease Analyzer

**Night 24** - Overnight Business Factory

## What It Does

Paste your apartment lease text and get a plain-English analysis including key terms, red flags, important dates, tenant rights, and an overall lease score (1-10). No legal jargon, just clear explanations.

## Revenue Model

- $9 per individual analysis
- $19/month unlimited analyses

## Features

- **Rent & Deposit Extraction** - Automatically finds monthly rent, security deposit, lease duration
- **Red Flag Detection** - Identifies excessive penalties, waived rights, unreasonable entry, auto-renewal traps, mandatory arbitration, liability waivers, non-refundable fees, vague deposit deductions
- **Lease Score (1-10)** - Overall lease quality rating
- **Risk Score (0-100)** - Color-coded meter based on number and severity of red flags
- **Color-Coded Clauses** - Green (favorable), Yellow (note), Red (concern)
- **Plain-English Translations** - Every clause translated from legal speak to everyday language
- **Important Dates** - Lease start/end, notice-to-vacate deadlines, rent increase dates
- **Tenant Rights** - Common protections based on state laws
- **Questions for Your Landlord** - Automatically generated based on lease gaps and red flags
- **Maintenance Breakdown** - Side-by-side landlord vs tenant responsibilities
- **Pet Policy Detection** - Identifies pet rules and required deposits
- **Analysis History** - Review past analyses anytime
- **Disclaimer** - Clear "not legal advice" notice

## Tech Stack

- Next.js 14 + TypeScript
- Tailwind CSS (dark theme with rose-500 accents)
- Template-based pattern matching analysis (no external API calls)
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
