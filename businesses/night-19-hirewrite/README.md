# HireWrite - Inclusive Job Description Generator

**Night 19 of 25** - Overnight Business Factory

## What It Does

HireWrite generates optimized, inclusive job postings from basic role details. Input a job title, company, and requirements, and get a complete, professionally structured job description with built-in bias detection and inclusivity scoring.

## Features

- **Smart Job Generation** - Produces structured postings with responsibilities, qualifications, nice-to-haves, and benefits
- **Bias Detection** - Flags gendered language (ninja, rockstar, manpower), excessive requirements, and exclusionary phrases
- **Inclusivity Score** - 0-100 score with color-coded feedback (red/yellow/green)
- **Copy to Clipboard** - One-click copy of the full formatted posting
- **Job History** - Browse and review previously generated postings
- **Dark Theme** - Professional sky-500 accent on gray-950 background

## Revenue Model

- $5 per individual job posting
- $29/month for unlimited postings

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- In-memory store (no external database required)
- No external APIs - all generation logic is local/algorithmic

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

```bash
npm run build
npm start
```

Deploy to Vercel, Railway, or any Node.js hosting platform.
