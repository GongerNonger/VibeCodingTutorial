# CommitPoet - Creative Git Commit Message Generator

**Night 23 of 25** - Overnight Business Factory

## What It Does

Paste a git diff and get creative, funny, or professional commit messages generated in different personas. Choose from Professional (conventional commits), Pirate, Shakespeare, Emoji Master, Haiku, and Senior Dev styles.

## Revenue Model

- Free tool with sponsorship placements
- Premium personas (Villain Monologue, Corporate Buzzword, etc.) as paid unlock

## Features

- **Diff Analysis** - Parses git diffs to detect files changed, lines added/removed, change types, languages, and function names
- **6 Personas** - Professional, Pirate, Shakespeare, Emoji Master, Haiku, Senior Dev
- **Conventional Commits** - Professional persona follows feat:/fix:/refactor:/docs:/test:/chore: format
- **Copy to Clipboard** - One-click copy for any generated message
- **Generation History** - Browse and reload previous generations
- **Dark Theme** - Fuchsia-accented dark UI

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- All generation logic is local/algorithmic (no external APIs)

## Getting Started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # Production build
npm test        # Run test suite
```

## Deployment

Deploy to Vercel:

```bash
npx vercel --prod
```

No environment variables or external services required. Everything runs client-side + serverless functions.
