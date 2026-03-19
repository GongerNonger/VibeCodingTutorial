# InstaLanding - AI Landing Page Generator

> Night 1 of 25 Overnight Businesses

## What It Does
Paste your product description, choose a style, and get a complete, conversion-optimized landing page as a downloadable HTML file. No design skills needed.

## Revenue Model
- **Free tier**: 3 pages/month
- **Starter**: $9/mo for 10 pages
- **Pro**: $29/mo unlimited

## Tech Stack
- Next.js 15 (App Router)
- Tailwind CSS 4
- TypeScript
- Landing page template engine (built-in, no external AI API required for MVP)

## Getting Started

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## How It Works
1. User enters product name + description
2. Selects a style (modern, bold, or minimal)
3. Backend generates a complete HTML landing page with inline styles
4. User previews in-browser, then copies HTML or downloads the file
5. Drop the HTML on any hosting (Netlify, Vercel, GitHub Pages)

## Future Enhancements (Post-MVP)
- Claude API integration for AI-written copy
- More style templates
- Custom color palette picker
- Stripe integration for subscriptions
- User accounts and saved pages

## Built With
Claude Code Agent Teams - Frontend + Backend + QA working in parallel.
