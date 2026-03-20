# GitBlame - PR Review Summary Bot

**Night 12 of 25** | Overnight Business Factory

## What It Does

Paste a PR diff or description and get an instant auto-summary with review focus areas, risk assessment, and actionable suggestions. No more spending 30 minutes trying to understand a large PR before reviewing it.

## Features

- **Diff Analysis** - Paste any git diff and get an intelligent breakdown of changes
- **Risk Assessment** - Automatic low/medium/high risk level based on file types and content
- **Focus Areas** - File-by-file review priorities with concern descriptions
- **Actionable Suggestions** - Concrete recommendations for improving the PR
- **Diff Stats** - Visual bar chart showing additions, deletions, and files changed
- **Copy Summary** - One-click copy formatted summary for pasting into PR comments
- **Dark Theme** - Easy on the eyes for late-night code reviews

## Revenue Model

| Plan | Price | Features |
|------|-------|----------|
| Per Repo | $19/mo | Single repo, unlimited reviews |
| Organization | $49/mo | Unlimited repos, team features |

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS (dark theme with amber accents)
- **Storage**: In-memory (suitable for demo/MVP)
- **AI**: Mock analysis engine (parses diff text for realistic review comments)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/reviews | Create a new review |
| GET | /api/reviews | List all reviews |
| GET | /api/reviews/[id] | Get a specific review |
| POST | /api/reviews/[id]/analyze | Analyze diff and generate summary |

## How It Works

1. Paste your PR diff text into the input form
2. Click "Analyze PR" to generate an AI-powered review summary
3. Review the risk level, focus areas, and suggestions
4. Copy the formatted summary and paste it into your PR comments
