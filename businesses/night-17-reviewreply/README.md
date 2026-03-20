# Night 17: ReviewReply — Google Review Response Writer

Paste customer reviews, get professional response suggestions with tone controls. Built for small business owners managing their online reputation.

**Revenue Model:** $19/mo per business location

## Features

- **Business Profile Setup** — Configure your business name, type, and voice/personality
- **Sentiment Analysis** — Automatic detection of positive/negative/mixed sentiment
- **Star Rating Detection** — Extracts explicit ratings or infers from content
- **Theme Extraction** — Identifies key themes (service, food quality, value, wait time, etc.)
- **Tone Controls** — Professional, Friendly, Empathetic, or Assertive response styles
- **Response Length** — Brief, Standard, or Detailed output
- **Copy to Clipboard** — One-click copy for each generated response
- **Review History** — Track previously analyzed reviews in-session
- **Template-Based Generation** — No external AI API calls required
- **Dark Theme** — Emerald accent on dark gray

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** In-memory (API routes)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Endpoints

| Method | Endpoint | Description |
| ------ | --------------- | ---------------------------------------- |
| POST | /api/analyze | Analyze review sentiment and themes |
| POST | /api/generate | Generate a professional response |
| GET | /api/businesses | List saved business profiles |
| POST | /api/businesses | Create a new business profile |

## Testing

```bash
npx tsx test.ts
```

## Deployment

```bash
npm run build
npm start
```

Deploy to Vercel:
```bash
npx vercel --prod
```

## Project Structure

```
app/
  layout.tsx          — Root layout with dark theme
  page.tsx            — Main client-side UI
  globals.css         — Tailwind base styles
  api/
    analyze/route.ts  — Sentiment analysis endpoint
    generate/route.ts — Response generation endpoint
    businesses/route.ts — Business profile CRUD
lib/
  engine.ts           — Core analysis & generation engine
test.ts               — Test suite (25+ assertions)
```
