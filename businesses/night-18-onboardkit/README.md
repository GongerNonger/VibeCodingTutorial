# Night 18: OnboardKit — AI Employee Onboarding Document Generator

Generate complete, professional onboarding packets for new employees in minutes. Built for small businesses (10-100 employees) hiring without a dedicated HR team.

## Features

- **Company Profile Management** — Save and reuse company details across multiple hires
- **Complete Onboarding Packets** — Six professionally written sections generated from your inputs:
  - Welcome Letter
  - First Week Schedule
  - Role Expectations (30/60/90 day plan)
  - Company Culture Overview
  - IT Setup Checklist
  - HR Forms & Compliance Checklist
- **Section-by-Section Editing** — Customize any section after generation
- **One-Click Copy** — Copy individual sections or the full packet
- **Template-Based Generation** — No external AI API calls needed
- **Dark Theme** — Professional dark UI with amber accents

## Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Storage:** In-memory (server-side)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Routes

| Method | Route            | Description                          |
|--------|------------------|--------------------------------------|
| POST   | `/api/generate`  | Generate onboarding packet           |
| GET    | `/api/companies` | List saved company profiles          |
| POST   | `/api/companies` | Save a company profile               |
| GET    | `/api/packets`   | List generated packets               |

## Testing

```bash
npx tsx test.ts
```

## Revenue Model

- **Pay-per-packet:** $15 per onboarding packet
- **Subscription:** $39/mo for unlimited packets

## Deployment

Deploy to Vercel:

```bash
npm run build
npx vercel --prod
```

Or any Node.js hosting platform that supports Next.js.
