# Night 22: PitchDeck — AI Pitch Deck Outline Generator

Describe your startup, get a structured pitch deck outline with talking points for each slide. Built for founders preparing for fundraising.

## Features

- **Startup Input Form** — Enter your company name, industry, problem, solution, target market, business model, traction, team, and funding ask
- **10-Slide Pitch Deck** — Standard investor deck structure: Title, Problem, Solution, Market Size, Business Model, Traction, Competition, Team, Financials, The Ask
- **Per-Slide Detail** — Each slide includes key bullet points, talking points, and suggested visuals
- **3 Deck Styles** — YC-style (concise, data-driven), Classic (professional, thorough), Storytelling (narrative, emotional)
- **Slide Navigator** — Carousel view with easy slide-to-slide navigation
- **Copy Functionality** — Copy the full outline or individual slides to clipboard
- **Dark Theme** — Dark UI with orange-500 accent color

## Revenue Model

- $19 per deck (one-time generation)
- $39/mo unlimited decks

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Template-based generation (no external AI APIs)
- In-memory storage

## API Routes

- `POST /api/generate` — Generate a pitch deck from startup details
- `GET /api/decks` — List all saved decks
- `GET /api/decks/[id]` — Get a specific deck by ID

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

## Tests

```bash
npx tsx test.ts
```

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Deploy — zero configuration needed for Next.js on Vercel
