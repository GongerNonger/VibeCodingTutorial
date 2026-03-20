# Night 23: GrantScout — Small Business Grant Finder & Application Helper

Find grants you qualify for and get AI-powered help drafting your applications.

## Features

- **Grant Matching**: Input your business profile (industry, location, size, demographics) and get a curated list of grants you're eligible for with eligibility scores
- **18 Real Grant Programs**: SBA (7(a), Microloan, Community Advantage), SBIR/STTR, minority/women/veteran-owned business grants, and state-level programs (CA, TX, NY, FL)
- **Application Drafter**: Template-based narrative generation for common grant application questions — no external AI API calls required
- **Bookmark & Save**: Save grants for later and store business profiles
- **Dark Theme UI**: Clean dark interface with teal accent colors

## Revenue Model

- **Free ($0)**: Browse grants and basic matching
- **Starter ($19/mo)**: Grant matching with eligibility scoring
- **Pro ($49/mo)**: AI application drafting and advanced features

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: In-memory (grants + profiles)
- **AI Drafting**: Template-based generation (no external APIs)

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/grants` | List all grants with optional filters (industry, state, category, demographics) |
| GET | `/api/grants/[id]` | Get a specific grant's details |
| POST | `/api/match` | Match a business profile to eligible grants |
| POST | `/api/draft` | Generate application narrative drafts for a grant |
| GET/POST | `/api/profiles` | Retrieve all / save a business profile |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build & Deploy

```bash
npm run build
npm start
```

Deploy to Vercel:

```bash
npx vercel
```

## Testing

```bash
npx tsx test.ts
```

39 assertions covering grant database integrity, matching logic, filtering, profile storage, and draft generation.
