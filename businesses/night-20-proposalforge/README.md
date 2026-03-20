# Night 20: ProposalForge — Freelancer Proposal & Quote Generator

Generate professional proposals with scope, timeline, pricing tables, and terms. Built for freelancers, consultants, and small agencies.

## Features

- **Freelancer Profile** — Store your name, title, skills, hourly rate, email, and portfolio URL
- **Project Details Form** — Client name, company, project description, deliverables, and deadline
- **Pricing Calculator** — Hourly or fixed pricing with multiple line items, quantities, and subtotals
- **Template-Based Generation** — No external AI APIs required; proposals are generated from rich templates
- **3 Proposal Styles** — Minimal, Professional, and Creative
- **Complete Proposal Sections** — Cover Letter, Project Understanding, Scope of Work, Timeline & Milestones, Pricing Table, Terms & Conditions
- **Copy Full Proposal** — One-click copy to clipboard
- **Dark Theme** — Sleek dark UI with cyan-500 accent color

## Revenue Model

- $9/mo for 10 proposals
- $29/mo for unlimited proposals

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Storage:** In-memory (server-side)
- **Testing:** Custom test runner with tsx

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/generate` | Generate a complete proposal from project + freelancer details |
| GET | `/api/profiles` | List all stored freelancer profiles |
| POST | `/api/profiles` | Save a new freelancer profile |
| GET | `/api/proposals` | List all generated proposals |

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

# Run tests
npx tsx test.ts
```

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Deploy with zero configuration (Next.js is auto-detected)

Alternatively, build and run with Docker or any Node.js hosting platform:

```bash
npm run build
npm start
```

The app runs on port 3000 by default.
