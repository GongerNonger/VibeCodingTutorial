# MeetingMemo - Meeting Notes Summarizer

**Night 20 of 25** | Overnight Business Factory

## What It Does

MeetingMemo lets users paste meeting transcripts and instantly get structured summaries with action items, decisions, key topics, follow-ups, and sentiment analysis. No AI APIs needed - all analysis is done locally using pattern recognition and heuristics.

## Features

- **Transcript Analysis** - Paste any meeting transcript and get an instant structured breakdown
- **Action Item Extraction** - Automatically identifies tasks with assignee detection (e.g., "John will...")
- **Decision Detection** - Finds statements containing "decided", "agreed", "will go with", etc.
- **Key Topic Identification** - Extracts most frequently discussed subjects using word frequency analysis
- **Follow-up Tracking** - Detects mentions of follow-ups, deadlines, and next steps
- **Sentiment Analysis** - Rates meetings as productive, neutral, or unproductive
- **Participant Activity** - Shows contribution breakdown per speaker
- **Markdown Export** - One-click copy of formatted summary as markdown
- **Meeting History** - Browse and review past meeting summaries

## Revenue Model

- $15/mo individual plan
- $49/mo team plan

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS (dark theme with rose-500 accents)
- In-memory data store
- Local algorithmic analysis (no external APIs)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Testing

```bash
npm test
```

## Deployment

```bash
npm run build
npm start
```

Deploy to Vercel, Railway, or any Node.js hosting platform.
